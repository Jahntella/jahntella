/* Three artist invitations, mounted only when their real MP4s and posters are present.
   No autoplay and no interference with song queues or the existing welcome player. */
(function(){
'use strict';
const clips=[
  {id:'find',title:'Find Your Sound',label:'01 · Discover Your Vibe',description:'Six eras. Every feeling. Find the Jahntella song that feels like yours.',file:'find-your-sound',duration:'0:10'},
  {id:'community',title:'Come Be a Sweetie',label:'02 · Find Your People',description:'You belong here. A place for music, creativity, confidence, and cheering each other on.',file:'sweetie-community',duration:'0:15'},
  {id:'spotlight',title:'Your Moment to Shine',label:'03 · Join the Movement',description:'Make the moment yours. Use Jahntella’s music, tag her, and share your creativity with the Sweeties.',file:'sweeties-spotlight-invite',duration:'0:30'}
];
const dir='videos/videos/videos/videos/';
function path(item,poster){return dir+item.file+(poster?'-poster.webp':'.mp4')}
function check(path){return fetch(path,{method:'HEAD',cache:'no-store'}).then(r=>r.ok).catch(()=>false)}
function build(){
 if(document.getElementById('wosFilmRoom'))return;
 const hero=document.getElementById('home');if(!hero)return;
 const section=document.createElement('section');section.id='wosFilmRoom';section.setAttribute('aria-labelledby','wosFilmHeading');
 const cards=clips.map((c,i)=>'<article class="wos-film-card"><div class="wos-film-visual"><img src="'+path(c,true)+'" alt="'+c.title+' — Jahntella video portrait" loading="lazy" decoding="async"><span class="wos-film-number">'+c.label+'</span><button class="wos-film-play" type="button" data-wos-play="'+i+'" aria-label="Watch '+c.title+'">▶</button><span class="wos-film-duration">'+c.duration+'</span></div><div class="wos-film-card-body"><p class="wos-film-card-label">A personal invitation ♡</p><h3>'+c.title+'</h3><p class="wos-film-card-desc">'+c.description+'</p><button type="button" class="wos-film-watch" data-wos-play="'+i+'">▶ Watch the Moment</button></div></article>').join('');
 section.innerHTML='<div class="wos-film-shell"><div class="wos-film-top"><p class="wos-film-kicker">♡ More than music · A whole world to explore</p><h2 id="wosFilmHeading">Step Into the <em>World of Sweet</em></h2><p class="wos-film-intro">A few little moments with Jahntella—made for the curious, the dreamers, and every Sweetie looking for their sound. Pick one to watch. ♡</p></div><div class="wos-film-grid">'+cards+'</div><div class="wos-film-bottom"><p>Find your sound. Share your story. Let’s make something beautiful together.</p><div class="wos-film-links"><a href="#sweetieLounge">♫ Explore the Music</a><a href="#sweetiesSpotlight">♡ Sweeties Spotlight</a></div><p class="wos-film-footer">We empower each other here · Progressing is a Blessing ♡</p></div></div>';
 hero.insertAdjacentElement('afterend',section);
 const dlg=document.createElement('dialog');dlg.className='wos-film-dialog';dlg.setAttribute('aria-label','Jahntella video viewer');
 dlg.innerHTML='<div class="wos-dialog-head"><strong class="wos-active-title">Jahntella ♡</strong><button type="button" class="wos-close">✕ Close</button></div><video controls playsinline preload="none" aria-label="Jahntella invitation video"></video><p class="wos-dialog-note">Stay sweet, stay you. ♡</p>';
 document.body.appendChild(dlg);
 const player=dlg.querySelector('video');let prior=null;
 const close=()=>{try{player.pause()}catch(e){};player.removeAttribute('src');player.load();if(dlg.open)dlg.close()};
 dlg.querySelector('.wos-close').addEventListener('click',close);
 dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
 dlg.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();prior?.focus?.();prior=null});
 section.addEventListener('click',function(e){
  const button=e.target.closest('[data-wos-play]');if(!button)return;
  const choice=clips[Number(button.dataset.wosPlay)];if(!choice)return;
  prior=button;
  dlg.querySelector('.wos-active-title').textContent=choice.title+' ♡';
  player.poster=path(choice,true);player.src=path(choice,false);
  dlg.showModal();
  document.querySelectorAll('audio,video').forEach(other=>{if(other!==player&&!other.paused){try{other.pause()}catch(e){}}});
  player.play().catch(()=>{}); // User can press Play on restricted browsers.
 });
 player.addEventListener('play',()=>{document.querySelectorAll('audio,video').forEach(other=>{if(other!==player&&!other.paused){try{other.pause()}catch(e){}}})});
 document.addEventListener('play',function(e){if(e.target!==player&&dlg.open&&!player.paused)player.pause()},true);
}
function init(){
 // Avoid broken posters, ghost video buttons or fake previews until media is uploaded.
 Promise.all(clips.flatMap(c=>[check(path(c,false)),check(path(c,true))])).then(results=>{
  if(results.every(Boolean))build();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
