(()=>{'use strict';
const mount=()=>{
 if(document.getElementById('sweetieLounge'))return;
 const featured=document.getElementById('featuredNow');if(!featured)return;
 const lounge=document.createElement('section');lounge.id='sweetieLounge';lounge.setAttribute('aria-label','Sweetie Music Lounge');
 lounge.innerHTML=`<div class="lounge-shell"><p class="lounge-kicker">🌸 THE WORLD OF SWEET · MUSIC LOUNGE</p><h2>What's your mood, Sweetie?</h2>
 <p class="lounge-desc">Put on a song, keep working, or find a new favorite. Six eras. Every mood. Your soundtrack.</p>
 <div class="lounge-moods" role="group" aria-label="Choose a Jahntella era">
 <button class="mood" data-mood="Sweet" aria-pressed="true">💗 Sweet</button><button class="mood" data-mood="Shine" aria-pressed="false">💜 Shine</button>
 <button class="mood" data-mood="Sparkle" aria-pressed="false">🩵 Sparkle</button><button class="mood" data-mood="Siren" aria-pressed="false">💚 Siren</button>
 <button class="mood" data-mood="Surge" aria-pressed="false">🧡 Surge</button><button class="mood" data-mood="Synergy" aria-pressed="false">❤️ Synergy</button></div>
 <div class="lounge-stage"><div class="lounge-art"><div class="lounge-art-label" data-lounge-era>💗 THE SWEET ERA</div><div class="lounge-bars" aria-hidden="true">${Array.from({length:24},()=>'<i></i>').join('')}</div></div>
 <div><p class="lounge-now">YOUR JAHNTELLA SOUNDTRACK</p><p class="lounge-song" data-lounge-title>Pick your mood</p><p class="lounge-track-position" data-lounge-position aria-live="off"></p><p class="lounge-subtext" data-lounge-desc>Find a song that fits how you're feeling.</p>
 <div class="lounge-actions"><button type="button" class="secondary" data-lounge-prev aria-label="Previous song in this era">⏮ Previous</button><button type="button" data-lounge-start>▶ Play this song</button><button type="button" class="secondary" data-lounge-next aria-label="Next song in this era">Next ⏭</button><button type="button" class="secondary" data-lounge-surprise>✦ Surprise Me</button><button type="button" class="secondary" data-lounge-chill>☾ Work & Chill: Off</button><button type="button" class="secondary" data-lounge-share aria-expanded="false" aria-controls="loungeShareChoices">♡ Share this song</button></div><div class="lounge-share-options" id="loungeShareChoices" hidden><p data-share-preview></p><a data-share-facebook target="_blank" rel="noopener noreferrer">Facebook</a><a data-share-x target="_blank" rel="noopener noreferrer">X / Twitter</a><button type="button" data-share-copy>Copy caption + link</button><button type="button" data-share-link>Copy song link</button><button type="button" data-share-native hidden>More apps…</button></div>
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
 const order=Array.isArray(window.JAHNTELLA_TRACK_ORDER)?window.JAHNTELLA_TRACK_ORDER:[];
 const albumSongs=(first,last)=>{const i=order.indexOf(first);if(i<0)return [];const j=last?order.indexOf(last):order.length;return order.slice(i,j>i?j:order.length);};
 const moods={
 Sweet:{color:'#f48ac3',icon:'💗',description:'Playful, flirty, feel-good pop.',songs:albumSongs('fun-dipp','sweet-dreams')},
 Shine:{color:'#b58be8',icon:'💜',description:'Confidence, attitude and dancing.',songs:albumSongs('sweet-dreams','come-here-come-close')},
 Sparkle:{color:'#6fcee2',icon:'🩵',description:'Dreamy, hypnotic and discovering yourself.',songs:albumSongs('come-here-come-close','obsessed-with-me')},
 Siren:{color:'#75d1b2',icon:'💚',description:'Emotion, romance and real connection.',songs:albumSongs('obsessed-with-me','tik-tok')},
 Surge:{color:'#f6a15a',icon:'🧡',description:'Fearless, electric and unstoppable.',songs:albumSongs('tik-tok','keep-up-with-me')},
 Synergy:{color:'#ed274e',icon:'❤️',description:'80s-inspired energy, ambition and the road to the spotlight.',songs:albumSongs('keep-up-with-me')}
 };
 const extra=Array.isArray(window.JAHNTELLA_EXTRA_TRACKS)?window.JAHNTELLA_EXTRA_TRACKS:[];
 const names=Object.fromEntries(extra.map(t=>[t.key,t.title]));
 Object.assign(names,{'fun-dipp':'Fun Dipp','pink-lips':'Fun Dipp (Pink Lips Remix)','we-come-together':'We Come Together','gloss':'Gloss','play-with-me':'Play With Me','boots-smile-attitude':'Boots, Smile & Attitude','sweet-dreams':'Sweet Dreams','we-are-1':'We Are 1'});
 const displayName=key=>names[key]||key.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
 const eraFromKey=key=>Object.entries(moods).find(([,m])=>m.songs.includes(key))?.[0]||extra.find(t=>t.key===key)?.era||'Sweet';
 const titleNode=lounge.querySelector('[data-lounge-title]'),descNode=lounge.querySelector('[data-lounge-desc]'),eraNode=lounge.querySelector('[data-lounge-era]'),statusNode=lounge.querySelector('[data-lounge-status]'),positionNode=lounge.querySelector('[data-lounge-position]');
 let mood='Sweet',chill=false,selectedIndex=0,selectedKey=moods.Sweet.songs[0]||'fun-dipp';
 const refreshMood=()=>{const data=moods[mood];lounge.style.setProperty('--lounge',data.color);lounge.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===mood)));eraNode.textContent=data.icon+' THE '+mood.toUpperCase()+' ERA';descNode.textContent=data.description;positionNode.textContent='Song '+(selectedIndex+1)+' of '+data.songs.length;};
 const setMood=name=>{mood=name;selectedIndex=0;selectedKey=moods[mood].songs[0];refreshMood();titleNode.textContent=displayName(selectedKey);statusNode.textContent='Ready to play '+displayName(selectedKey)+'.';if(!shareChoices.hidden)updateShare();};
 const playKey=key=>{if(typeof window.jahntellaSelectSiteTrack!=='function'){statusNode.textContent='Player is still loading. Please choose a song in the album section.';return;}
   const era=eraFromKey(key);if(moods[era]){mood=era;selectedIndex=Math.max(0,moods[era].songs.indexOf(key));refreshMood();}
   selectedKey=key;window.jahntellaSelectSiteTrack(key,true);titleNode.textContent=displayName(key);
   statusNode.textContent='Now playing '+displayName(key)+' in the existing music player.';if(!shareChoices.hidden)updateShare();
 };
 const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
 const moveSong=step=>{const songs=moods[mood].songs;if(!songs.length)return;selectedIndex=(selectedIndex+step+songs.length)%songs.length;playKey(songs[selectedIndex]);};
 lounge.querySelectorAll('[data-mood]').forEach(b=>b.addEventListener('click',()=>setMood(b.dataset.mood)));
 lounge.querySelector('[data-lounge-start]').addEventListener('click',()=>playKey(selectedKey));
 lounge.querySelector('[data-lounge-prev]').addEventListener('click',()=>moveSong(-1));
 lounge.querySelector('[data-lounge-next]').addEventListener('click',()=>moveSong(1));
 lounge.querySelector('[data-lounge-surprise]').addEventListener('click',()=>{const keys=Object.values(moods).flatMap(m=>m.songs);if(keys.length)playKey(pick(keys));});
 const shareButton=lounge.querySelector('[data-lounge-share]'),shareChoices=lounge.querySelector('#loungeShareChoices');
 const shareLink=()=>{if(selectedKey==='turn-around')return new URL('/songs/turn-around.html',window.location.origin).toString();const url=new URL(window.location.origin+window.location.pathname);url.searchParams.set('song',selectedKey);url.hash='sweetieLounge';return url.toString();};
 const shareLabel=()=> 'OMG 💗 My fave song right now is '+displayName(selectedKey)+' by Jahntella! 🎶 Come listen with me!';
 const shareText=()=>shareLabel()+' '+shareLink();
 const updateShare=()=>{lounge.querySelector('[data-share-preview]').textContent=shareLabel();lounge.querySelector('[data-share-facebook]').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareLink());
 lounge.querySelector('[data-share-x]').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareLabel())+'&url='+encodeURIComponent(shareLink());};
 shareButton.addEventListener('click',()=>{updateShare();shareChoices.hidden=!shareChoices.hidden;shareButton.setAttribute('aria-expanded',String(!shareChoices.hidden));});
 lounge.querySelector('[data-share-link]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(shareLink());statusNode.textContent='Direct song link copied! ♡';}catch(err){window.prompt('Copy your song link:',shareLink());}});
 lounge.querySelector('[data-share-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(shareText());statusNode.textContent='Sweetie caption and song link copied! ♡';}catch(err){window.prompt('Copy your caption and link:',shareText());}});
 if(typeof navigator.share==='function'){const more=lounge.querySelector('[data-share-native]');more.hidden=false;more.addEventListener('click',async()=>{try{await navigator.share({title:displayName(selectedKey)+' — Jahntella',text:shareLabel(),url:shareLink()});}catch(err){if(err.name!=='AbortError')statusNode.textContent='Use Copy caption + link to share your song.';}});}
 const chillButton=lounge.querySelector('[data-lounge-chill]');
 chillButton.addEventListener('click',()=>{chill=!chill;chillButton.textContent=chill?'☾ Work & Chill: On':'☾ Work & Chill: Off';lounge.classList.toggle('is-chill',chill);statusNode.textContent=chill?'Work & Chill: the player remains available; distractions stay minimal.':'Work & Chill is off.'});
 const open=()=>{signup.hidden=false;signup.querySelector('#simpleSweetieEmail').focus()};
 const close=()=>{signup.hidden=true;(document.activeElement?.matches('[data-sweetie-signup-open]')?document.activeElement:lounge.querySelector('[data-lounge-signup]')).focus()};
 document.addEventListener('click',e=>{if(e.target.closest('[data-sweetie-signup-open]'))open()});
 lounge.querySelector('[data-lounge-signup]').addEventListener('click',open);signup.querySelector('.signup-close').addEventListener('click',close);
 signup.addEventListener('click',e=>{if(e.target===signup)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!signup.hidden)close()});
 const audioNodes=()=>[...document.querySelectorAll('audio')].filter(a=>a.id!=='simpleSweetieAudio'&&(a.currentSrc||a.src||a.querySelector('source')));
 function sync(){const live=audioNodes().find(a=>!a.paused&&!a.ended);lounge.classList.toggle('is-playing',Boolean(live));const playerTitle=document.getElementById('playerTitle');if(live&&playerTitle?.textContent?.trim()){titleNode.textContent=playerTitle.textContent.trim();const matching=Object.entries(names).find(([,name])=>name.toLowerCase()===titleNode.textContent.toLowerCase());if(matching){const era=eraFromKey(matching[0]);if(moods[era]){mood=era;selectedIndex=Math.max(0,moods[era].songs.indexOf(matching[0]));selectedKey=matching[0];refreshMood();if(!shareChoices.hidden)updateShare();}}}}
 document.addEventListener('play',sync,true);document.addEventListener('pause',sync,true);document.addEventListener('ended',sync,true);
 const playerTitle=document.getElementById('playerTitle');if(playerTitle)new MutationObserver(sync).observe(playerTitle,{childList:true,subtree:true,characterData:true});
 setMood('Sweet');const requested=new URL(window.location.href).searchParams.get('song');if(requested&&order.includes(requested)){mood=eraFromKey(requested);selectedIndex=moods[mood].songs.indexOf(requested);selectedKey=requested;refreshMood();titleNode.textContent=displayName(requested);if(!shareChoices.hidden)updateShare();statusNode.textContent='Your Sweetie shared '+displayName(requested)+'! Press Play this song to listen ♡';}else sync();
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