import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL')!;
const PUBLIC_SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') || 'https://jahntella.com').replace(/\/$/, '');
const MARKETING_ADMIN_EMAILS = (Deno.env.get('MARKETING_ADMIN_EMAILS') || '').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);
const UNSUBSCRIBE_SECRET = Deno.env.get('UNSUBSCRIBE_SECRET')!;

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const json = (body: unknown, status=200, headers: Record<string,string>={}) => new Response(JSON.stringify(body), { status, headers: { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', ...headers } });
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decodeBase64url = (value: string) => { const padded=value.replace(/-/g,'+').replace(/_/g,'/') + '==='.slice((value.length+3)%4); return Uint8Array.from(atob(padded),c=>c.charCodeAt(0)); };

async function hmac(message: string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(UNSUBSCRIBE_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
  return new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message)));
}
async function makeUnsubscribeToken(userId: string){
  const payload=base64url(new TextEncoder().encode(JSON.stringify({sub:userId,exp:Date.now()+1000*60*60*24*180})));
  return `${payload}.${base64url(await hmac(payload))}`;
}
async function verifyUnsubscribeToken(token: string){
  const [payload,sig]=token.split('.'); if(!payload||!sig)throw new Error('Invalid unsubscribe token');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(UNSUBSCRIBE_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
  const ok=await crypto.subtle.verify('HMAC',key,decodeBase64url(sig),new TextEncoder().encode(payload)); if(!ok)throw new Error('Invalid unsubscribe token');
  const data=JSON.parse(new TextDecoder().decode(decodeBase64url(payload))); if(!data.sub||Number(data.exp)<Date.now())throw new Error('Expired unsubscribe token');
  return String(data.sub);
}

async function requireAdmin(req: Request){
  const auth=req.headers.get('authorization')||''; const token=auth.replace(/^Bearer\s+/i,''); if(!token)throw new Error('Authentication required');
  const {data,error}=await db.auth.getUser(token); if(error||!data.user)throw new Error('Authentication required');
  const email=(data.user.email||'').toLowerCase();
  const allowed=MARKETING_ADMIN_EMAILS.includes(email) || data.user.app_metadata?.marketing_admin===true || data.user.app_metadata?.role==='admin';
  if(!allowed)throw new Error('This account is not authorized to send Sweeties marketing emails.');
  return data.user;
}

async function listRecipients(){
  const users=[]; let page=1;
  while(true){
    const {data,error}=await db.auth.admin.listUsers({page,perPage:1000}); if(error)throw error;
    users.push(...(data.users||[])); if(!data.users||data.users.length<1000)break; page++;
  }
  return users.filter(user=>Boolean(user.email_confirmed_at)&&user.user_metadata?.marketing_opt_in===true&&Boolean(user.email));
}

function renderEmail(campaign: any, recipient: any, unsubscribeUrl: string){
  const firstName=String(recipient.user_metadata?.first_name||'Sweetie').trim();
  const message=String(campaign.message||'').trim().split(/\n+/).filter(Boolean).map((p:string)=>`<p style="margin:0 0 18px;line-height:1.7;color:#3d2943;font-size:16px">${escapeHtml(p).replace(/\[first_name\]/gi,escapeHtml(firstName))}</p>`).join('');
  const image=campaign.imageUrl?`<img src="${escapeHtml(campaign.imageUrl)}" alt="Jahntella" style="display:block;width:100%;max-width:620px;height:auto;border:0;margin:0 auto 24px;border-radius:18px">`:'';
  const button=campaign.buttonText&&campaign.buttonUrl?`<p style="text-align:center;margin:28px 0"><a href="${escapeHtml(campaign.buttonUrl)}" style="display:inline-block;background:#b14bd8;color:#fff;text-decoration:none;font-weight:800;padding:14px 25px;border-radius:999px">${escapeHtml(campaign.buttonText)}</a></p>`:'';
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(campaign.subject)}</title></head><body style="margin:0;background:#f6eafa;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(campaign.preheader||campaign.headline)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6eafa"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border-radius:24px;overflow:hidden"><tr><td style="padding:30px;text-align:center;background:linear-gradient(135deg,#42105d,#8f2aa8)"><div style="color:#ffd6f5;font-size:12px;font-weight:800;letter-spacing:4px">♡ JAHNTELLA ♡</div><div style="color:#fff;font-size:13px;margin-top:8px">SWEETIES</div></td></tr><tr><td style="padding:34px 30px 30px">${image}<p style="text-align:center;color:#8f2aa8;font-weight:800">Hi ${escapeHtml(firstName)} ♡</p><h1 style="margin:0 0 20px;color:#6d237f;font-size:30px;line-height:1.15;text-align:center">${escapeHtml(campaign.headline)}</h1>${message}${button}<p style="margin:28px 0 0;text-align:center;color:#8d7793;font-size:13px;line-height:1.6">You're receiving this because you opted in to Jahntella announcements.<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#7b3b90">Unsubscribe from Sweeties marketing</a></p></td></tr></table></td></tr></table></body></html>`;
}

async function resendBatch(messages: any[]){
  const response=await fetch('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(messages)});
  const body=await response.json().catch(()=>({})); if(!response.ok)throw new Error(body?.message||`Resend returned ${response.status}`); return body;
}

Deno.serve(async req=>{
  try{
    if(req.method==='GET'){
      const url=new URL(req.url); const token=url.searchParams.get('unsubscribe'); if(!token)return new Response('Jahntella Sweeties Marketing', {headers:{'content-type':'text/plain'}});
      const userId=await verifyUnsubscribeToken(token);
      const {data:user,error:getError}=await db.auth.admin.getUserById(userId); if(getError||!user)throw new Error('Subscription not found');
      const metadata={...(user.user_metadata||{}),marketing_opt_in:false};
      const {error}=await db.auth.admin.updateUserById(userId,{user_metadata:metadata}); if(error)throw error;
      return new Response('<!doctype html><html><body style="font-family:Arial;text-align:center;padding:60px;background:#f6eafa;color:#42105d"><h1>♡ You are unsubscribed.</h1><p>You will no longer receive Jahntella marketing emails.</p><p><a href="https://jahntella.com/">Return to Jahntella</a></p></body></html>',{headers:{'content-type':'text/html; charset=utf-8'}});
    }
    if(req.method!=='POST')return json({error:'Method not allowed'},405);
    const admin=await requireAdmin(req); const body=await req.json(); const action=body?.action;
    if(action==='count'){
      const recipients=await listRecipients(); return json({count:recipients.length});
    }
    const campaign=body?.campaign||{}; if(!campaign.subject||!campaign.headline||!campaign.message)return json({error:'Subject, headline, and message are required.'},400);
    if(action==='test'){
      const token=await makeUnsubscribeToken(admin.id); const unsubscribeUrl=`${SUPABASE_URL}/functions/v1/send-sweeties-campaign?unsubscribe=${encodeURIComponent(token)}`;
      const result=await resendBatch([{from:RESEND_FROM_EMAIL,to:[admin.email],subject:campaign.subject,html:renderEmail(campaign,admin,unsubscribeUrl)}]);
      return json({ok:true,email:admin.email,id:result?.data?.[0]?.id||result?.id||null});
    }
    if(action==='send'){
      const recipients=await listRecipients(); let sent=0; let failed=0;
      for(let i=0;i<recipients.length;i+=100){
        const chunk=recipients.slice(i,i+100);
        const messages=await Promise.all(chunk.map(async recipient=>{const token=await makeUnsubscribeToken(recipient.id);const unsubscribeUrl=`${SUPABASE_URL}/functions/v1/send-sweeties-campaign?unsubscribe=${encodeURIComponent(token)}`;return {from:RESEND_FROM_EMAIL,to:[recipient.email],subject:campaign.subject,html:renderEmail(campaign,recipient,unsubscribeUrl)}}));
        try{await resendBatch(messages);sent+=messages.length}catch{failed+=messages.length}
      }
      return json({ok:true,sent,failed});
    }
    return json({error:'Unknown action.'},400);
  }catch(error){return json({error:error instanceof Error?error.message:'Unexpected error.'},500)}
});
