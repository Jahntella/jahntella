/* Era-styled lyrical sheets for the five Jahntella music eras.
   Never modifies the existing track audio or playlist queue. */
(function(){
'use strict';
const COLORS=['sweet','shine','sparkle','siren','surge'];
const SECTION_ERA={
 sweetEraAlbum:'sweet',shineEraSneakPeek:'shine',sparkleEraAlbum:'sparkle',
 sirenEraAlbum:'siren',surgeEraAlbum:'surge'
};
const FALLBACK='assets/fun-dipp-cover.webp';
let book=null,lyricsPromise=null,returnFocus=null,scanTimer=null;
function lookupEra(key,card){
 const track=(window.JAHNTELLA_EXTRA_TRACKS||[]).find(t=>t.key===key);
 const tEra=String(track?.era||'').toLowerCase();
 if(COLORS.includes(tEra))return tEra;
 const section=card.closest('#sweetEraAlbum,#shineEraSneakPeek,#sparkleEraAlbum,#sirenEraAlbum,#surgeEraAlbum');
 if(section&&SECTION_ERA[section.id])return SECTION_ERA[section.id];
 // Older Shine entries are not included in the shared extra-track catalog.
 if(['sweet-dreams','we-are-1','boots-smile-attitude','midnight-rodeo','redline','smoke-show','chasing-me','coming-down','you-and-me'].includes(key))return 'shine';
 if(card.classList.contains('siren-era-song-card'))return 'siren';
 if(card.classList.contains('surge-era-song-card'))return 'surge';
 return 'sweet';
}
function details(card){
 const key=card.getAttribute('data-card');
 if(!key)return null;
 const track=(window.JAHNTELLA_EXTRA_TRACKS||[]).find(t=>t.key===key);
 const title=card.querySelector('h3')?.textContent?.trim()||track?.title||key;
 const image=card.querySelector('img:not(.mini-badge)')?.getAttribute('src')||track?.artwork||FALLBACK;
 return {key,title,image,era:lookupEra(key,card)};
}
function sheet(){
 if(book)return book;
 book=document.createElement('dialog');book.className='era-lyrics-dialog';book.dataset.era='sweet';
 book.setAttribute('aria-label','Jahntella lyrics sheet');
 book.innerHTML='<div class="eld-head"><strong>♡ World of Sweet · Song Lyrics</strong><button class="eld-close" type="button">✕ Close</button></div>'+
 '<div class="eld-hero"><img class="eld-art" alt=""><div class="eld-meta"><p class="eld-era"></p><h2></h2><p class="eld-desc">Your own little lyrical escape ♡</p></div></div>'+
 '<div class="eld-scroll"><div class="eld-verses"></div></div>'+
 '<p class="eld-foot">♡ Keep listening while you read · Progressing is a Blessing ♡</p>';
 document.body.appendChild(book);
 book.querySelector('.eld-close').addEventListener('click',()=>book.close());
 book.addEventListener('click',e=>{if(e.target===book)book.close()});
 book.addEventListener('close',()=>{returnFocus?.focus?.();returnFocus=null});
 return book;
}
function lyricLibrary(){
 if(!lyricsPromise){
  lyricsPromise=fetch('/song-lyrics.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).catch(()=>({}));
 }
 return lyricsPromise;
}
async function open(card,trigger){
 const info=details(card);if(!info)return;
 const dialog=sheet();
 returnFocus=trigger;
 dialog.dataset.era=info.era;
 dialog.querySelector('.eld-era').textContent=info.era+' Era · Jahntella ♡';
 dialog.querySelector('h2').textContent=info.title;
 const art=dialog.querySelector('.eld-art');
 art.src=new URL(info.image,location.href).href;
 art.alt=info.title+' cover artwork';
 art.onerror=()=>{if(art.dataset.fallback)return;art.dataset.fallback='1';art.src=FALLBACK};
 art.dataset.fallback='';
 const target=dialog.querySelector('.eld-verses');
 target.textContent='Opening your lyric sheet…';
 if(!dialog.open)dialog.showModal();
 const current=info.key;
 dialog.dataset.song=current;
 const library=await lyricLibrary();
 if(dialog.dataset.song!==current)return;
 target.replaceChildren();
 const parts=library[current];
 if(!Array.isArray(parts)||!parts.length){
  const message=document.createElement('p');message.className='eld-coming';
  message.textContent='♡ This '+info.era+' Era lyric sheet is dressed and ready! The original lyrics for '+info.title+' are being added. You can keep enjoying the song while we prepare the words.';
  target.appendChild(message);
  return;
 }
 parts.forEach(([heading,lines])=>{
  const group=document.createElement('section');group.className='eld-verse';
  const h=document.createElement('h3');h.textContent=heading;
  const p=document.createElement('p');p.textContent=lines;
  group.append(h,p);target.appendChild(group);
 });
}
function addToCard(card){
 if(card.querySelector('.era-lyric-button'))return;
 const info=details(card);if(!info)return;
 const button=document.createElement('button');button.type='button';
 button.className='era-lyric-button';button.dataset.era=info.era;
 button.textContent='♡ Lyrics';
 button.setAttribute('aria-label','Open '+info.title+' lyric sheet');
 button.addEventListener('click',()=>open(card,button));
 const host=card.querySelector('.release-copy')||
  card.querySelector('.exp60-shine-video-note')||
  card.querySelector('.exp44-new-music-info')||
  card.querySelector('.shine-era-song-info')||
  card.querySelector('.song-card-copy')||card;
 const playButton=host.querySelector('[data-track],.play-button,.sparkle-cover-play');
 if(playButton&&playButton.parentNode===host)playButton.insertAdjacentElement('afterend',button);
 else host.appendChild(button);
}
function scan(){
 document.querySelectorAll('#sweetEraAlbum [data-card],#shineEraSneakPeek [data-card],#sparkleEraAlbum [data-card],#sirenEraAlbum [data-card],#surgeEraAlbum [data-card]').forEach(addToCard);
}
function init(){
 scan();
 // Era albums may populate cards after initial page load.
 const main=document.querySelector('main');if(!main)return;
 const observer=new MutationObserver(mutations=>{
  if(!mutations.some(m=>Array.from(m.addedNodes).some(n=>n.nodeType===1&&
     (n.matches?.('[data-card]')||n.querySelector?.('[data-card]')))))return;
  clearTimeout(scanTimer);scanTimer=setTimeout(scan,90);
 });
 observer.observe(main,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
