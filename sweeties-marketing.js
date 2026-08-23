(()=>{
  'use strict';
  const SUPABASE_URL='https://mchyedehbudsqixvfvbm.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_3rnNUWJVSUIUiGyFXCvJTA_d68suwx1';
  const FUNCTION_URL=`${SUPABASE_URL}/functions/v1/send-sweeties-campaign`;
  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const $=id=>document.getElementById(id);
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const values=()=>({subject:$('subject').value.trim(),preheader:$('preheader').value.trim(),headline:$('headline').value.trim(),message:$('message').value.trim(),buttonText:$('buttonText').value.trim(),buttonUrl:$('buttonUrl').value.trim(),imageUrl:$('imageUrl').value.trim()});
  const setStatus=(text,error=false)=>{ $('formStatus').textContent=text; $('formStatus').dataset.type=error?'error':'success'; };
  const setLoginStatus=(text,error=false)=>{ $('loginStatus').textContent=text; $('loginStatus').dataset.type=error?'error':'success'; };
  const buildEmail=({subject,preheader,headline,message,buttonText,buttonUrl,imageUrl,unsubscribeUrl='https://jahntella.com/'})=>{
    const paragraphs=escapeHtml(message).split(/\n+/).filter(Boolean).map(p=>`<p style="margin:0 0 18px;line-height:1.7;color:#3d2943;font-size:16px">${p}</p>`).join('');
    const image=imageUrl?`<img src="${escapeHtml(imageUrl)}" alt="Jahntella" style="display:block;width:100%;max-width:620px;height:auto;border:0;margin:0 auto 24px;border-radius:18px">`:'';
    const button=buttonText&&buttonUrl?`<p style="text-align:center;margin:28px 0"><a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background:#b14bd8;color:#fff;text-decoration:none;font-weight:800;padding:14px 25px;border-radius:999px">${escapeHtml(buttonText)}</a></p>`:'';
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head><body style="margin:0;background:#f6eafa;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader||headline)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6eafa"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border-radius:24px;overflow:hidden"><tr><td style="padding:30px 30px 12px;text-align:center;background:linear-gradient(135deg,#42105d,#8f2aa8)"><div style="color:#ffd6f5;font-size:12px;font-weight:800;letter-spacing:4px">♡ JAHNTELLA ♡</div><div style="color:#fff;font-size:13px;margin-top:8px">SWEETIES</div></td></tr><tr><td style="padding:34px 30px 30px">${image}<h1 style="margin:0 0 20px;color:#6d237f;font-size:30px;line-height:1.15;text-align:center">${escapeHtml(headline)}</h1>${paragraphs}${button}<p style="margin:28px 0 0;text-align:center;color:#8d7793;font-size:13px;line-height:1.6">You're receiving this because you opted in to Jahntella announcements.<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#7b3b90">Unsubscribe from Sweeties marketing</a></p></td></tr></table></td></tr></table></body></html>`;
  };
  const showPreview=()=>{const data=values();if(!data.subject||!data.headline||!data.message)return setStatus('Add a subject, headline, and message first.',true);$('previewFrame').srcdoc=buildEmail(data);$('previewCard').hidden=false;$('previewCard').scrollIntoView({behavior:'smooth',block:'start'});};
  async function invoke(payload){
    const {data:{session}}=await client.auth.getSession();
    if(!session)throw new Error('Your Sweetie admin session has expired. Please sign in again.');
    const response=await fetch(FUNCTION_URL,{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    let body={};try{body=await response.json()}catch{}
    if(!response.ok)throw new Error(body.error||body.message||`Request failed (${response.status})`);
    return body;
  }
  const refreshCount=async()=>{try{const result=await invoke({action:'count'});$('recipientCount').textContent=Number(result.count||0).toLocaleString();setStatus('Subscriber count refreshed.')}catch(error){setStatus(error.message,true)}};
  const sendTest=async()=>{try{const data=values();if(!data.subject||!data.headline||!data.message)return setStatus('Add a subject, headline, and message first.',true);$('sendTest').disabled=true;setStatus('Sending a test to jahntella@gmail.com…');const result=await invoke({action:'test',campaign:data});setStatus(`Test sent to ${result.email||'jahntella@gmail.com'} ♡`)}catch(error){setStatus(error.message,true)}finally{$('sendTest').disabled=false}};
  const sendCampaign=async event=>{event.preventDefault();const data=values();if(!data.subject||!data.headline||!data.message)return setStatus('Add a subject, headline, and message first.',true);if(!confirm('Send this campaign to every verified Sweetie who opted into marketing?'))return;try{$('sendCampaign').disabled=true;setStatus('Sending the Sweeties campaign…');const result=await invoke({action:'send',campaign:data});setStatus(`Campaign sent to ${Number(result.sent||0).toLocaleString()} Sweeties. ${result.failed?Number(result.failed).toLocaleString()+' failed.':''}`)}catch(error){setStatus(error.message,true)}finally{$('sendCampaign').disabled=false}};
  async function requestAdminLink(event){
    event.preventDefault();
    const email=$('adminEmail').value.trim();
    if(!email)return;
    const button=$('adminLoginButton');
    button.disabled=true;
    setLoginStatus('Sending your secure sign-in link…');
    const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:'https://jahntella.com/sweeties-marketing.html'}});
    button.disabled=false;
    if(error)return setLoginStatus(error.message||'We could not send the sign-in link. Please try again.',true);
    setLoginStatus('Check your email. Click the secure link to return here and finish signing in. ♡');
  }
  async function init(){
    const {data:{session}}=await client.auth.getSession();
    if(!session){
      $('authStatus').textContent='Admin sign-in required';
      $('loginCard').hidden=false;
      return;
    }
    $('authStatus').textContent=`Signed in as ${session.user.email}`;$('signOut').hidden=false;
    try{const result=await invoke({action:'count'});$('recipientCount').textContent=Number(result.count||0).toLocaleString();$('app').hidden=false}catch(error){$('authStatus').textContent=error.message;$('authStatus').dataset.type='error';return}
    $('app').hidden=false;
  }
  $('preview').addEventListener('click',showPreview);
  $('closePreview').addEventListener('click',()=>$('previewCard').hidden=true);
  $('refreshCount').addEventListener('click',refreshCount);
  $('sendTest').addEventListener('click',sendTest);
  $('campaignForm').addEventListener('submit',sendCampaign);
  $('adminLoginForm').addEventListener('submit',requestAdminLink);
  $('signOut').addEventListener('click',async()=>{await client.auth.signOut();location.reload()});
  init();
})();
