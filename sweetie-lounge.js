(()=>{'use strict';
const mount=()=>{
 if(document.getElementById('sweetieLounge'))return;
 const featured=document.getElementById('featuredNow');if(!featured)return;
 const lounge=document.createElement('section');lounge.id='sweetieLounge';lounge.setAttribute('aria-label','Sweetie Music Lounge');
 lounge.innerHTML=`<div class="lounge-shell"><p class="lounge-kicker">🌸 THE WORLD OF SWEET · MUSIC LOUNGE</p><h2>What's your mood, Sweetie?</h2>
 <p class="lounge-desc">Put on a song, keep working, or find a new favorite. Five eras. Every mood. Your soundtrack.</p>
 <div class="lounge-moods" role="group" aria-label="Choose a Jahntella era">
 <button class="mood" data-mood="Sweet" aria-pressed="true">💗 Sweet</button><button class="mood" data-mood="Shine" aria-pressed="false">💜 Shine</button>
 <button class="mood" data-mood="Sparkle" aria-pressed="false">🩵 Sparkle</button><button class="mood" data-mood="Siren" aria-pressed="false">💚 Siren</button>
 <button class="mood" data-mood="Surge" aria-pressed="false">🧡 Surge</button></div>
 <div class="lounge-stage"><div class="lounge-art"><div class="lounge-art-label" data-lounge-era>💗 THE SWEET ERA</div><div class="lounge-bars" aria-hidden="true">${Array.from({length:24},()=>'<i></i>').join('')}</div></div>
 <div><p class="lounge-now">YOUR JAHNTELLA SOUNDTRACK</p><p class="lounge-song" data-lounge-title>Pick your mood</p><p class="lounge-subtext" data-lounge-desc>Find a song that fits how you're feeling.</p>
 <div class="lounge-actions"><button type="button" data-lounge-start>▶ Play this mood</button><button type="button" class="secondary" data-lounge-surprise>✦ Surprise Me</button><button type="button" class="secondary" data-lounge-chill>☾ Work & Chill: Off</button></div>
 <p class="lounge-note" data-lounge-status role="status" aria-live="polite"></p></div></div>
 <div class="lounge-footer"><p>♡ Want first dibs on songs, Living Ebooks, beauty, and future Little Luxuries? Just your email. No birthdays, no gate.</p>
 <button class="lounge-signup-button" type="button" data-lounge-signup>♡ Join the Sweeties</button></div>
 <p class="lounge-note">Music plays through Jahntella's existing player. Light effects are decorative and can be paused by your device's reduced-motion setting.</p></div>`;
 featured.before(lounge);
 const signup=document.createElement('div');signup.id='sweetieSignup';signup.hidden=true;
 signup.innerHTML=`<div class="signup-card" role="dialog" aria-modal="true" aria-labelledby="sweetieSignupTitle"><button class="signup-close" aria-label="Close signup" type="button">×</button><p>💗 THE WORLD OF SWEET</p><h2 id="sweetieSignupTitle">A little love in your inbox.</h2><p>Jahntella news, new songs, ebooks and future Little Luxuries. Just your email, and only when you choose.</p>
 <form id="simpleSweetieSignup"><label for="simpleSweetieEmail">Email address</label><input type="email" id="simpleSweetieEmail" name="email" autocomplete="email" placeholder="you@example.com" maxlength="254" required>
 <label class="signup-optin"><input type="checkbox" name="consent" required> <span>Yes, I'd like Jahntella's music, ebook and future product updates by email. I can unsubscribe whenever I like.</span></label>
 <button type="submit">♡ Send my verification email</button><p class="signup-status" id="simpleSweetieStatus" role="status" aria-live="polite"></p></form>
 <p style="font-size:.8rem">Free, optional and never required to listen. Please verify your email to complete the signup.</p></div>`;
 document.body.appendChild(signup);
 const moods={
 Sweet:{color:'#f48ac3',icon:'💗',description:'Playful, flirty, feel-good pop.',songs:['fun-dipp','pink-lips','we-come-together','gloss','play-with-me']},
 Shine:{color:'#b58be8',icon:'💜',description:'Confidence, attitude and dancing.',songs:['boots-smile-attitude','sweet-dreams','midnight-rodeo','we-are-1']},
 Sparkle:{color:'#6fcee2',icon:'🩵',description:'Dreamy, hypnotic and discovering yourself.',songs:['pink-petals','touch','what-you-do-to-me','exist']},
 Siren:{color:'#75d1b2',icon:'💚',description:'Emotion, romance and real connection.',songs:['show-me-something-real','pretty-little-problem','obsessed-with-me','read-my-lips']},
 Surge:{color:'#f6a15a',icon:'🧡',description:'Fearless, electric and unstoppable.',songs:['tik-tok','untouchable','electric-tangerine','anxiety']}
 };
 const extra=Array.isArray(window.JAHNTELLA_EXTRA_TRACKS)?window.JAHNTELLA_EXTRA_TRACKS:[];
 const names=Object.fromEntries(extra.map(t=>[t.key,t.title]));
 Object.assign(names,{'fun-dipp':'Fun Dipp','pink-lips':'Fun Dipp (Pink Lips Remix)','we-come-together':'We Come Together','gloss':'Gloss','play-with-me':'Play With Me','boots-smile-attitude':'Boots, Smile & Attitude','sweet-dreams':'Sweet Dreams','we-are-1':'We Are 1'});
 const eraFromKey=key=>Object.entries(moods).find(([,m])=>m.songs.includes(key))?.[0]||extra.find(t=>t.key===key)?.era||'Sweet';
 const titleNode=lounge.querySelector('[data-lounge-title]'),descNode=lounge.querySelector('[data-lounge-desc]'),eraNode=lounge.querySelector('[data-lounge-era]'),statusNode=lounge.querySelector('[data-lounge-status]');
 let mood='Sweet',chill=false;
 const setMood=name=>{mood=name;const data=moods[name];lounge.style.setProperty('--lounge',data.color);lounge.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===name)));eraNode.textContent=data.icon+' THE '+name.toUpperCase()+' ERA';descNode.textContent=data.description;titleNode.textContent=(names[data.songs[0]]||data.songs[0]);};
 const playKey=key=>{if(typeof window.jahntellaSelectSiteTrack!=='function'){statusNode.textContent='Player is still loading. Please choose a song in the album section.';return}window.jahntellaSelectSiteTrack(key,true);titleNode.textContent=names[key]||key;statusNode.textContent='Now playing +(names[key]||key)+' in the existing music player.';};
 const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
 lounge.querySelectorAll('[data-mood]').forEach(b=>b.addEventListener('click',()=>setMood(b.dataset.mood)));
 lounge.querySelector('[data-lounge-start]').addEventListener('click',()=>playKey(moods[mood].songs[0]));
 lounge.querySelector('[data-lounge-surprise]').addEventListener('click',()=>{const keys=Object.values(moods).flatMap(m=>m.songs);playKey(pick(keys))});
 const chillButton=lounge.querySelector('[data-lounge-chill]');
 chillButton.addEventListener('click',()=>{chill=!chill;chillButton.textContent=chill?'☾ Work & Chill: On':'☾ Work & Chill: Off';lounge.classList.toggle('is-chill',chill);statusNode.textContent=chill?'Work & Chill: the player remains available; distractions stay minimal.':'Work & Chill is off.'});
 const open=()=>{signup.hidden=false;signup.querySelector('#simpleSweetieEmail').focus()};
 const close=()=>{signup.hidden=true;lounge.querySelector('[data-lounge-signup]').focus()};
 lounge.querySelector('[data-lounge-signup]').addEventListener('click',open);signup.querySelector('.signup-close').addEventListener('click',close);
 signup.addEventListener('click',e=>{if(e.target===signup)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!signup.hidden)close()});
 const audioNodes=()=>[...document.querySelectorAll('audio')].filter(a=>a.id&&a.id!=='simpleSweetieAudio');
 function sync(){const live=audioNodes().find(a=>!a.paused&&!a.ended);lounge.classList.toggle('is-playing',Boolean(live));const playerTitle=document.getElementById('playerTitle');if(live&&playerTitle?.textContent?.trim()){titleNode.textContent=playerTitle.textContent.trim();const matching=Object.entries(names).find(([,name])=>name.toLowerCase()===titleNode.textContent.toLowerCase());if(matching){const era=eraFromKey(matching[0]);if(moods[era])setMoodVisualOnly(era)}}}
 function setMoodVisualOnly(name){if(mood===name)return;const data=moods[name];lounge.style.setProperty('--lounge',data.color);eraNode.textContent=data.icon+' THE '+name.toUpperCase()+' ERA';}
 document.addEventListener('play',sync,true);document.addEventListener('pause',sync,true);document.addEventListener('ended',sync,true);
 const playerTitle=document.getElementById('playerTitle');if(playerTitle)new MutationObserver(sync).observe(playerTitle,{childList:true,subtree:true,characterData:true});
 setMood('Sweet');sync();
 const form=signup.querySelector('form'),msg=signup.querySelector('#simpleSweetieStatus');
 const getClient=async()=>{if(!window.supabase?.createClient){await new Promise((resolve,reject)=>{const el=document.createElement('script');el.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';el.onload=resolve;el.onerror=reject;document.head.appendChild(el)})}return window.supabase.createClient('https://mchyedehbudsqixvfvbm.supabase.co','sb_publishable_3rnNUWJVSUIUiGyFXCvJTA_d68suwx1',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})};
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;
 const email=form.elements.email.value.trim(),button=form.querySelector('[type=submit]');
 button.disabled=true;msg.textContent='Sending your verification email…';
 try{const client=await getClient();const result=await client.auth.signInWithOtp({email,options:{emailRedirectTo:'https://jahntella.com/',data:{marketing_opt_in:true,signup_source:'sweetie_music_lounge'}}});if(result.error)throw result.error;
 try{localStorage.setItem('jahntellaPendingSweetieOptIn',email.toLowerCase())}catch(e){}
 msg.textContent='Check your inbox and verify your email to join the Sweeties. ♡';form.reset()
 }catch(error){msg.textContent='Could not send verification: '+(error.message||'Please retry later.')}
 finally{button.disabled=false}});
 // If an existing Sweetie verified a link, reflect their explicit marketing consent in user metadata.
 const pending=(()=>{try{return localStorage.getItem('jahntellaPendingSweetieOptIn')}catch(e){return null}})();
 if(pending)getClient().then(async client=>{const {data:{user}}=await client.auth.getUser();if(user&&user.email?.toLowerCase()===pending){const metadata={...(user.user_metadata||{}),marketing_opt_in:true};const {error}=await client.auth.updateUser({data:metadata});if(!error){try{localStorage.removeItem('jahntellaPendingSweetieOptIn')}catch(e){}}}}).catch(()=>{});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();