/* Jahntella Sweetie member access — Supabase Auth + release-date gate */
(()=>{
  'use strict';

  const PROJECT_URL='https://mchyedehbudsqixvfvbm.supabase.co';
  const PUBLISHABLE_KEY='sb_publishable_3rnNUWJVSUIUiGyFXCvJTA_d68suwx1';
  const DEFAULT_CUTOFF='2026-08-27T04:00:00.000Z';
  const TEST_MODE=new URLSearchParams(location.search).get('sweetie-access-test')==='1';
  const LOCKABLE_CLICK='button.play-button,[data-track],.release-card img,.exp44-new-music-card img,.gallery-item img,.exp60-shine-video-frame video';
  let client=null;
  let session=null;
  let gateActive=TEST_MODE;
  let modal=null;

  const loadSdk=()=>new Promise((resolve,reject)=>{
    if(window.supabase?.createClient)return resolve();
    const existing=document.querySelector('script[data-jahntella-supabase]');
    if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async=true;
    script.dataset.jahntellaSupabase='true';
    script.onload=resolve;
    script.onerror=reject;
    document.head.appendChild(script);
  });

  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

  const buildOptions=(count,label)=>Array.from({length:count},(_,i)=>`<option value="${i+1}">${label(i+1)}</option>`).join('');

  const ensureModal=()=>{
    if(modal)return modal;
    const wrap=document.createElement('div');
    wrap.id='sweetieAccessModal';
    wrap.className='sweetie-access-modal';
    wrap.hidden=true;
    wrap.innerHTML=`
      <div class="sweetie-access-backdrop" data-sweetie-close></div>
      <section class="sweetie-access-dialog" role="dialog" aria-modal="true" aria-labelledby="sweetieAccessTitle">
        <button class="sweetie-access-close" type="button" aria-label="Close Sweetie Access" data-sweetie-close>×</button>
        <p class="sweetie-access-kicker">♡ SWEETIE MEMBER ACCESS ♡</p>
        <h2 id="sweetieAccessTitle">Unlock the full Jahntella experience.</h2>
        <p class="sweetie-access-intro">Join the Sweeties to enjoy the complete concert playlist, exclusive previews, and future Sweetville surprises.</p>
        <form id="sweetieAccessForm">
          <div class="sweetie-access-grid">
            <label><span>First name *</span><input name="first_name" autocomplete="given-name" maxlength="60" required></label>
            <label><span>Email *</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label>
            <label><span>City</span><input name="city" autocomplete="address-level2" maxlength="100"></label>
            <label><span>State / region</span><input name="region" autocomplete="address-level1" maxlength="100"></label>
            <label><span>Country</span><input name="country" autocomplete="country-name" maxlength="100"></label>
            <label><span>Favorite Jahntella song</span><input name="favorite_song" maxlength="120"></label>
            <label><span>Birthday month</span><select name="birthday_month"><option value="">Month</option>${buildOptions(12,n=>new Date(2000,n-1,1).toLocaleString(undefined,{month:'long'}))}</select></label>
            <label><span>Birthday day</span><select name="birthday_day"><option value="">Day</option>${buildOptions(31,n=>String(n))}</select></label>
          </div>
          <label class="sweetie-access-check"><input name="access_consent" type="checkbox" required><span>I agree to receive a secure sign-in email and allow Jahntella to store this information for member access. *</span></label>
          <label class="sweetie-access-check"><input name="marketing_opt_in" type="checkbox"><span>Yes, send me Jahntella music news, Sweetville updates, and special announcements. (Optional)</span></label>
          <button class="sweetie-access-submit" type="submit">SEND MY SWEETIE ACCESS LINK ♡</button>
          <p class="sweetie-access-status" id="sweetieAccessStatus" aria-live="polite"></p>
        </form>
        <p class="sweetie-access-note">No password needed. We’ll email you a secure sign-in link.</p>
      </section>`;
    document.body.appendChild(wrap);
    modal=wrap;
    wrap.querySelectorAll('[data-sweetie-close]').forEach(node=>node.addEventListener('click',closeModal));
    wrap.querySelector('form').addEventListener('submit',submitSignup);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!wrap.hidden)closeModal();});
    return wrap;
  };

  const openModal=()=>{
    const m=ensureModal();
    m.hidden=false;
    document.documentElement.classList.add('sweetie-access-open');
    window.setTimeout(()=>m.querySelector('input[name="first_name"]')?.focus(),30);
  };

  const closeModal=()=>{
    if(!modal)return;
    modal.hidden=true;
    document.documentElement.classList.remove('sweetie-access-open');
  };

  const setStatus=(message,type='')=>{
    const status=document.getElementById('sweetieAccessStatus');
    if(!status)return;
    status.textContent=message;
    status.dataset.type=type;
  };

  async function submitSignup(event){
    event.preventDefault();
    if(!client)return setStatus('Sweetie Access is still loading. Please try again.','error');
    const form=event.currentTarget;
    const submit=form.querySelector('button[type="submit"]');
    const values=Object.fromEntries(new FormData(form).entries());
    submit.disabled=true;
    setStatus('Sending your secure access link…');
    const metadata={
      first_name:String(values.first_name||'').trim(),
      city:String(values.city||'').trim(),
      region:String(values.region||'').trim(),
      country:String(values.country||'').trim(),
      favorite_song:String(values.favorite_song||'').trim(),
      birthday_month:values.birthday_month||null,
      birthday_day:values.birthday_day||null,
      marketing_opt_in:Boolean(values.marketing_opt_in)
    };
    const {error}=await client.auth.signInWithOtp({
      email:String(values.email||'').trim(),
      options:{emailRedirectTo:'https://jahntella.com/',data:metadata}
    });
    submit.disabled=false;
    if(error)return setStatus(error.message||'We could not send the link. Please try again.','error');
    form.reset();
    setStatus('Check your email! Your Sweetie Access link is on its way. ♡','success');
  }

  const isMember=()=>Boolean(session?.user);

  const shouldLockTarget=target=>Boolean(target.closest?.(LOCKABLE_CLICK));

  const guardClick=event=>{
    if(!gateActive||isMember()||!shouldLockTarget(event.target))return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    document.querySelectorAll('audio,video').forEach(media=>{if(!media.paused)media.pause();});
    openModal();
  };

  const guardMedia=event=>{
    if(!gateActive||isMember())return;
    const media=event.target;
    if(!(media instanceof HTMLMediaElement))return;
    media.pause();
    try{media.currentTime=0;}catch{}
    openModal();
  };

  const updateMemberBadge=()=>{
    let badge=document.getElementById('sweetieMemberBadge');
    if(!gateActive){badge?.remove();return;}
    if(!badge){
      badge=document.createElement('button');
      badge.id='sweetieMemberBadge';
      badge.className='sweetie-member-badge';
      badge.type='button';
      badge.addEventListener('click',()=>isMember()?client.auth.signOut():openModal());
      document.body.appendChild(badge);
    }
    badge.textContent=isMember()?'SWEETIE ACCESS ✓':'UNLOCK FULL PLAYLIST ♡';
    badge.setAttribute('aria-label',isMember()?'Signed in as a Sweetie. Click to sign out.':'Unlock the full Jahntella playlist');
  };

  const PRIVATE_AUDIO_BUCKET='jahntella-private';
  const AUDIO_ID_TITLES={
    audioFunDipp:'fun dipp',audioPinkLips:'fun dipp pink lips remix',audioBiteLip:'bite lip',audioGloss:'gloss',
    audioYourGirl:'i want to be your girl',audioEmbraceMe:'embrace me',audioWeComeTogether:'we come together',
    audioPlayWithMe:'play with me',audioCarnival:'carnival',audioMadeOfLight:'made of light',
    audioCandyWrapper:'candy wrapper',audioPlayground:'playground',audioMilkShake:'milk shake',audioTonight:'tonight',
    audioSweetDreams:'sweet dreams',audioWeAre1:'we are 1',audioBootsSmileAttitude:'boots smile attitude'
  };
  const normalizeTrack=value=>String(value||'').toLowerCase().replace(/%20/g,' ').replace(/&/g,' and ').replace(/remastered/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  let privateAudioPromise=null;

  const findPrivateTrack=(files,wanted)=>{
    const key=normalizeTrack(wanted);
    return files.find(file=>normalizeTrack(file.name)===key)||
      files.find(file=>normalizeTrack(file.name).startsWith(key))||
      files.find(file=>key.startsWith(normalizeTrack(file.name)));
  };

  async function preparePrivateAudio(){
    if(!gateActive||!isMember()||!client)return;
    if(privateAudioPromise)return privateAudioPromise;
    privateAudioPromise=(async()=>{
      try{
        const [rootResult,folderResult]=await Promise.all([
          client.storage.from(PRIVATE_AUDIO_BUCKET).list('',{limit:100,sortBy:{column:'name',order:'asc'}}),
          client.storage.from(PRIVATE_AUDIO_BUCKET).list('audio',{limit:100,sortBy:{column:'name',order:'asc'}})
        ]);
        const files=[...(rootResult.data||[]).filter(file=>/\\.mp3$/i.test(file.name)).map(file=>({...file,path:file.name})),
          ...(folderResult.data||[]).filter(file=>/\\.mp3$/i.test(file.name)).map(file=>({...file,path:'audio/'+file.name}))];
        const assignments=[];
        document.querySelectorAll('audio').forEach(audio=>{
          const source=audio.querySelector('source');
          const current=source?.getAttribute('src')||audio.getAttribute('src')||'';
          const basename=decodeURIComponent(current.split('/').pop()?.split('?')[0]||'').replace(/\\.(mp3|mp4)$/i,'');
          const wanted=AUDIO_ID_TITLES[audio.id]||basename;
          const file=findPrivateTrack(files,wanted);
          if(file)assignments.push({audio,source,path:file.path});
        });
        const uniquePaths=[...new Set(assignments.map(item=>item.path))];
        if(!uniquePaths.length)return;
        const {data,error}=await client.storage.from(PRIVATE_AUDIO_BUCKET).createSignedUrls(uniquePaths,3600);
        if(error)throw error;
        const signed=new Map((data||[]).filter(item=>item.signedUrl).map(item=>[item.path,item.signedUrl]));
        assignments.forEach(({audio,source,path})=>{
          const url=signed.get(path);if(!url)return;
          audio.pause();audio.removeAttribute('src');
          if(source)source.setAttribute('src',url);else audio.setAttribute('src',url);
          audio.load();
        });
        document.documentElement.dataset.privateAudioReady='true';
        document.documentElement.dataset.privateAudioCount=String(assignments.length);
      }catch(error){
        privateAudioPromise=null;
        console.warn('Private Sweetie audio could not be prepared.',error);
      }
    })();
    return privateAudioPromise;
  }

  const readCutoff=async()=>{
    try{
      const {data}=await client.from('site_settings').select('setting_value').eq('setting_key','full_listening_public_until').maybeSingle();
      return data?.setting_value||DEFAULT_CUTOFF;
    }catch{return DEFAULT_CUTOFF;}
  };

  async function init(){
    try{
      await loadSdk();
      client=window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const {data}=await client.auth.getSession();
      session=data.session;
      const cutoff=await readCutoff();
      gateActive=TEST_MODE||Date.now()>=Date.parse(cutoff);
      ensureModal();
      updateMemberBadge();
      if(session)preparePrivateAudio();
      client.auth.onAuthStateChange((_event,nextSession)=>{session=nextSession;updateMemberBadge();if(session){closeModal();preparePrivateAudio();}else privateAudioPromise=null;});
      document.documentElement.dataset.sweetieAccessReady='true';
      document.documentElement.dataset.sweetieGateActive=String(gateActive);
    }catch(error){
      console.warn('Sweetie Access could not initialize.',error);
    }
  }

  document.addEventListener('click',guardClick,true);
  document.addEventListener('play',guardMedia,true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();