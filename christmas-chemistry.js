/* Christmas Chemistry – an independent Sweeties-first gift player. */
(function(){
'use strict';
const LINK='https://jahntella.com/christmas-chemistry/';
const MESSAGE='Jahntella Frost just gave us Sweeties an early Christmas gift 🎁❤️ I’m listening to Christmas Chemistry now! jahntella.com';
const COVER='/assets/christmas-chemistry-cover.png';
const TRACK='/assets/christmas-chemistry.mp3';
function fmt(v){v=Math.floor(Math.max(0,Number(v)||0));return Math.floor(v/60)+':'+String(v%60).padStart(2,'0')}
function reveal(){
 if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelector('.cc-launch')?.remove();
 const root=document.createElement('div');root.className='cc-launch';root.setAttribute('aria-hidden','true');
 const cover=document.createElement('div');cover.className='cc-cover';
 const image=document.createElement('img');image.src=COVER;image.alt='';
 image.onerror=()=>{image.style.visibility='hidden'};
 cover.appendChild(image);root.appendChild(cover);
 [[0,-230],[145,-175],[230,0],[165,160],[0,240],[-175,165],[-230,0],[-165,-180],[95,220],[-105,225],[225,-115],[-225,-110]].forEach(([x,y],i)=>{
  const particle=document.createElement('span');particle.className='cc-particle';particle.textContent=i%3?'✦':'❄';
  particle.style.setProperty('--dx',x+'px');particle.style.setProperty('--dy',y+'px');root.appendChild(particle);
 });
 document.body.appendChild(root);setTimeout(()=>root.remove(),2600);
}
function start(){
 if(document.getElementById('christmasChemistryGift'))return;
 const section=document.createElement('section');
 section.id='christmasChemistryGift';section.setAttribute('aria-labelledby','christmasChemistryTitle');
 section.innerHTML='<div class="cc-shell">'+
 '<p class="cc-kicker">🎁 Sweeties Holiday Gift · Early Access</p>'+
 '<h2 id="christmasChemistryTitle">Christmas Chemistry</h2>'+
 '<p class="cc-subtitle">A little Christmas magic from Jahntella Frost ♡</p>'+
 '<div class="cc-panel"><div class="cc-art"><div class="cc-art-fallback" aria-hidden="true">❄</div><img loading="lazy" decoding="async" alt="Jahntella Frost — Christmas Chemistry holiday cover" src="'+COVER+'"></div>'+
 '<div class="cc-copy"><span class="cc-tag">❤️ Your first listen · Before the official release</span>'+
 '<p><strong>Merry Christmas, Sweeties!</strong> I made a little holiday surprise especially for you. You get to hear <em>Christmas Chemistry</em> before the rest of the world. Turn up the music, open the lyrics, and share your Christmas gift! 🎄</p>'+
 '<p>Love, <strong>Jahntella Frost ♡</strong></p>'+
 '<div class="cc-controls"><button class="cc-play" type="button" data-cc-play>▶ Play My Gift</button><button type="button" data-cc-lyrics>❄ Open Lyrics</button><button type="button" data-cc-share>♡ Share This Gift</button></div>'+
 '<div class="cc-progress"><span data-cc-time>0:00</span><input data-cc-seek type="range" min="0" max="1000" value="0" aria-label="Christmas Chemistry playback position"><span data-cc-duration>3:47</span></div>'+
 '<p class="cc-status" role="status" aria-live="polite" data-cc-status>Sweeties hear it first. ♡</p>'+
 '<div class="cc-share-panel" data-cc-share-panel hidden><p class="cc-share-note">Send this early Christmas gift to another Sweetie!</p><button type="button" data-cc-copy>♡ Copy gift message &amp; link</button><button type="button" data-cc-facebook>Facebook</button><button type="button" data-cc-x>Post to X</button><button type="button" data-cc-whatsapp>WhatsApp</button></div>'+
 '</div></div><p class="cc-foot">A gift for our Sweeties ahead of the official December release · Progressing is a Blessing ♡</p>'+
 '<audio preload="none" data-cc-audio src="'+TRACK+'"></audio></div>';
 const image=section.querySelector('.cc-art img');
 image.addEventListener('error',()=>{image.hidden=true});
 if(document.body.hasAttribute('data-christmas-page')) document.querySelector('main')?.appendChild(section);
 else {
  const battles=document.getElementById('sweetieSongBattles');
  const lounge=document.getElementById('sweetieLounge');
  if(battles)battles.after(section);
  else if(lounge)lounge.before(section);
  else document.querySelector('main')?.prepend(section);
 }
 const dialog=document.createElement('dialog');dialog.className='cc-lyrics-dialog';dialog.setAttribute('aria-label','Christmas Chemistry lyrics');
 dialog.innerHTML='<div class="cc-lyrics-head"><strong>❄ Jahntella Frost · Christmas Chemistry</strong><button type="button" class="cc-lyrics-close">✕ Close</button></div><div class="cc-lyrics-paper"><h2>Christmas Chemistry</h2><p class="cc-lyrics-by">The lyrics · Merry Christmas, Sweeties ♡</p><div data-cc-verses></div><p class="cc-lyrics-tail">Keep listening while you read. ❤️</p></div>';
 document.body.appendChild(dialog);
 dialog.querySelector('.cc-lyrics-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 let lyricsReady=false;
 const openLyrics=async()=>{
  if(!lyricsReady){
   const target=dialog.querySelector('[data-cc-verses]');
   target.textContent='Opening your Christmas lyrics…';
   try{
    const res=await fetch('/christmas-chemistry-lyrics.json');
    if(!res.ok)throw Error('Lyrics unavailable');
    const verses=await res.json();target.textContent='';
    verses.forEach(([label,lines])=>{
      const v=document.createElement('article');v.className='cc-verse';
      const h=document.createElement('h3');h.textContent=label;
      const p=document.createElement('p');p.textContent=lines;v.append(h,p);target.append(v);
    });
    lyricsReady=true;
   }catch(e){target.textContent='Lyrics are temporarily unavailable. Please try again shortly.'}
  }
  if(!dialog.open)dialog.showModal();
 };
 const audio=section.querySelector('[data-cc-audio]');
 const play=section.querySelector('[data-cc-play]');
 const status=section.querySelector('[data-cc-status]');
 const seek=section.querySelector('[data-cc-seek]');
 const clock=section.querySelector('[data-cc-time]');
 const duration=section.querySelector('[data-cc-duration]');
 const panel=section.querySelector('[data-cc-share-panel]');
 const sync=()=>{
  play.textContent=audio.paused?'▶ Play My Gift':'❚❚ Pause Christmas Chemistry';
  clock.textContent=fmt(audio.currentTime);
  if(Number.isFinite(audio.duration))duration.textContent=fmt(audio.duration);
  if(Number.isFinite(audio.duration)&&audio.duration>0)seek.value=String(Math.round(audio.currentTime/audio.duration*1000));
 };
 audio.addEventListener('timeupdate',sync);audio.addEventListener('loadedmetadata',sync);audio.addEventListener('pause',sync);
 audio.addEventListener('ended',()=>{status.textContent='Merry Christmas, Sweetie! Thanks for listening. ❤️';sync()});
 audio.addEventListener('play',()=>{
  document.querySelectorAll('audio').forEach(other=>{if(other!==audio&&!other.paused)other.pause()});
  status.textContent='Now playing · Christmas Chemistry ♡';sync();
 });
 document.addEventListener('play',e=>{if(e.target instanceof HTMLAudioElement&&e.target!==audio&&!audio.paused)audio.pause()},true);
 audio.addEventListener('error',()=>{status.textContent='The Christmas song file is not available on the website yet.';sync()});
 play.addEventListener('click',async()=>{
  if(!audio.paused){audio.pause();status.textContent='Paused — pick up where you left off ♡';return}
  try{await audio.play();reveal();sync()}
  catch(e){status.textContent='Christmas Chemistry audio is being prepared. Please check back soon.';sync()}
 });
 seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(seek.value)/1000*audio.duration});
 section.querySelector('[data-cc-lyrics]').addEventListener('click',openLyrics);
 const giftMessage=MESSAGE.replace('jahntella.com',LINK);
 section.querySelector('[data-cc-share]').addEventListener('click',async()=>{
  if(navigator.share){
   try{await navigator.share({title:'Jahntella Frost · Christmas Chemistry',text:MESSAGE,url:LINK});return}
   catch(e){if(e.name==='AbortError')return}
  }
  panel.hidden=!panel.hidden;
 });
 section.querySelector('[data-cc-copy]').addEventListener('click',async()=>{
  try{
   if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(giftMessage);
   else window.prompt('Copy your Christmas gift message:',giftMessage);
   status.textContent='Gift message and link copied! Share it with another Sweetie. 🎁';
  }catch(e){window.prompt('Copy this message:',giftMessage)}
 });
 section.querySelector('[data-cc-facebook]').addEventListener('click',()=>window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(LINK),'_blank','noopener,noreferrer'));
 section.querySelector('[data-cc-x]').addEventListener('click',()=>window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(MESSAGE.replace(' jahntella.com',''))+'&url='+encodeURIComponent(LINK),'_blank','noopener,noreferrer'));
 section.querySelector('[data-cc-whatsapp]').addEventListener('click',()=>window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(giftMessage),'_blank','noopener,noreferrer'));
 if(new URLSearchParams(location.search).get('lyrics')==='1')openLyrics();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();