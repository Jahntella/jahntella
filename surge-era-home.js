/* Inject Album V in the precise landing-page position. */
(function(){
 const init=()=>{
  const existing=document.getElementById('surgeEraAlbum');
  if(existing){
   const sweet=document.getElementById('sweetEraAlbum');
   const shine=document.getElementById('shineEraSneakPeek');
   const sparkle=document.getElementById('sparkleEraAlbum');
   const siren=document.getElementById('sirenEraAlbum');
   const community=document.getElementById('beASweetie');
   let placing=false;
   const place=()=>{
     if(placing||![sweet,shine,sparkle,siren,existing].every(el=>el?.isConnected))return;
     placing=true;
     try{
       // Use the actual Sweet album as the stable anchor, not the community footer.
       if(sweet.nextElementSibling!==shine)sweet.after(shine);
       if(shine.nextElementSibling!==sparkle)shine.after(sparkle);
       if(sparkle.nextElementSibling!==siren)sparkle.after(siren);
       if(siren.nextElementSibling!==existing)siren.after(existing);
       // Keep the featured singles, New Music, and thank-you content below all five eras.
       // Move the existing nodes rather than cloning them so audio and event handlers survive.
       const communitySection=document.getElementById('beASweetie');
       const gallery=document.getElementById('gallery');
       const featured=document.getElementById('music');
       const newMusic=document.getElementById('newMusic');
       const thankYou=document.querySelector('section.exp58-thank-you');
       let anchor=existing;
       // Explicitly move the two sections reported as interrupting the albums.
       for(const section of [communitySection,gallery,featured,newMusic,thankYou]){
         if(section?.isConnected && section.parentElement===anchor.parentElement){
           if(anchor.nextElementSibling!==section)anchor.after(section);
           anchor=section;
         }
       }
     }finally{placing=false;}
   };
   place();
   const observer=new MutationObserver(place);
   observer.observe(document.body,{childList:true,subtree:true});
   window.addEventListener('load',place,{once:true});
   [250,1200,3000,6000].forEach(ms=>setTimeout(place,ms));
   const list=existing.querySelector('.shine-era-song-grid');
   if(list&&!list.querySelector('[data-card="playlist"]')){
     const article=document.createElement('article');
     article.className='exp44-new-music-card shine-era-song-card';
     article.dataset.card='playlist';
     article.innerHTML='<button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="playlist" aria-label="Play Playlist"><img src="assets/album5/playlist-cover-thumb.webp" alt="Playlist song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 12 · BONUS TRACK</small><h3>Playlist</h3><p>One more song for the Sweeties who never hit pause.</p><button class="play-button" type="button" data-track="playlist">▶ Play Playlist</button></div>';
     list.appendChild(article);
     article.querySelectorAll('[data-track]').forEach(button=>button.addEventListener('click',()=>window.jahntellaSelectSiteTrack?.('playlist')));
   }
   return;
  }
  const siren=document.getElementById('sirenEraAlbum');
  const community=document.getElementById('beASweetie');
  if(!siren||!community){console.warn('Surge Era: insertion anchor missing');return;}
  const tpl=document.createElement('template');tpl.innerHTML='<section class="exp60-shine-sneak-peek reveal surge-era" id="surgeEraAlbum" aria-labelledby="surgeEraAlbumTitle"><div class="exp60-shine-shell"><header class="exp60-shine-heading"><p class="exp60-shine-kicker">ALBUM V ✦ THE SURGE ERA</p><h2 id="surgeEraAlbumTitle">Feel the rush of <em>The Surge Era.</em></h2><p>Electric tangerine. Neon pink. Pure energy. Twelve songs, one unstoppable new chapter. Tap a cover to play.</p></header><div class="exp60-shine-grid"><div class="exp60-shine-covers" aria-label="The Surge Era front and back covers"><button class="exp60-shine-cover-card exp60-shine-cover-front" type="button" data-lightbox="assets/album5/the-surge-era-front.webp" aria-label="Enlarge The Surge Era front cover"><span class="exp60-shine-cover-frame"><img src="assets/album5/the-surge-era-front-thumb.webp" alt="The Surge Era Album V front cover" loading="lazy"></span><span class="exp60-shine-cover-caption"><small>OFFICIAL FRONT COVER</small><strong>Tap to enlarge ↗</strong></span></button><button class="exp60-shine-cover-card exp60-shine-cover-back" type="button" data-lightbox="assets/album5/the-surge-era-back.webp" aria-label="Enlarge The Surge Era back cover"><span class="exp60-shine-cover-frame"><img src="assets/album5/the-surge-era-back-thumb.webp" alt="The Surge Era Album V back cover" loading="lazy"></span><span class="exp60-shine-cover-caption"><small>OFFICIAL BACK COVER</small><strong>Tap to enlarge ↗</strong></span></button></div><div class="exp66-shine-videos shine-era-song-grid" aria-label="The Surge Era songs in album order"><article class="exp44-new-music-card shine-era-song-card" data-card="anxiety"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="anxiety" aria-label="Play Anxiety"><img src="assets/album5/anxiety-cover-thumb.webp" alt="Anxiety song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 01</small><h3>Anxiety</h3><p>When the noise gets loud, the heart speaks louder.</p><button class="play-button" type="button" data-track="anxiety">▶ Play Anxiety</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="body-potion"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="body-potion" aria-label="Play Body Potion"><img src="assets/album5/body-potion-cover-thumb.webp" alt="Body Potion song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 02</small><h3>Body Potion</h3><p>A little magic, a little mystery, and irresistible chemistry.</p><button class="play-button" type="button" data-track="body-potion">▶ Play Body Potion</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="doll-face"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="doll-face" aria-label="Play Doll Face"><img src="assets/album5/doll-face-cover-thumb.webp" alt="Doll Face song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 03</small><h3>Doll Face</h3><p>Pretty looks, playful confidence, and a mischievous streak.</p><button class="play-button" type="button" data-track="doll-face">▶ Play Doll Face</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="electric-tangerine"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="electric-tangerine" aria-label="Play Electric Tangerine"><img src="assets/album5/electric-tangerine-cover-thumb.webp" alt="Electric Tangerine song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 04</small><h3>Electric Tangerine</h3><p>Turn up the voltage and feel the tangerine rush.</p><button class="play-button" type="button" data-track="electric-tangerine">▶ Play Electric Tangerine</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="future-ex"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="future-ex" aria-label="Play Future Ex"><img src="assets/album5/future-ex-cover-thumb.webp" alt="Future Ex song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 05</small><h3>Future Ex</h3><p>A tempting romance with an expiration date.</p><button class="play-button" type="button" data-track="future-ex">▶ Play Future Ex</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="going-down"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="going-down" aria-label="Play Going Down"><img src="assets/album5/going-down-cover-thumb.webp" alt="Going Down song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 06</small><h3>Going Down</h3><p>A daring rush that turns up the heat.</p><button class="play-button" type="button" data-track="going-down">▶ Play Going Down</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="overload"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="overload" aria-label="Play Overload"><img src="assets/album5/overload-cover-thumb.webp" alt="Overload song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 07</small><h3>Overload</h3><p>Too much energy to contain, too bright to ignore.</p><button class="play-button" type="button" data-track="overload">▶ Play Overload</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="spit"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="spit" aria-label="Play Spit"><img src="assets/album5/spit-cover-thumb.webp" alt="Spit song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 08</small><h3>Spit</h3><p>No holding back, no sugarcoating the truth.</p><button class="play-button" type="button" data-track="spit">▶ Play Spit</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="tik-tok"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="tik-tok" aria-label="Play Tik Tok"><img src="assets/album5/tik-tok-cover-thumb.webp" alt="Tik Tok song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 09</small><h3>Tik Tok</h3><p>The clock is ticking, and the chemistry is electric.</p><button class="play-button" type="button" data-track="tik-tok">▶ Play Tik Tok</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="untouchable"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="untouchable" aria-label="Play Untouchable"><img src="assets/album5/untouchable-cover-thumb.webp" alt="Untouchable song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 10</small><h3>Untouchable</h3><p>Unshakable confidence with a shine all her own.</p><button class="play-button" type="button" data-track="untouchable">▶ Play Untouchable</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="wild-card"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="wild-card" aria-label="Play Wild Card"><img src="assets/album5/wild-card-cover-thumb.webp" alt="Wild Card song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 11</small><h3>Wild Card</h3><p>Unpredictable moves and a fearless little grin.</p><button class="play-button" type="button" data-track="wild-card">▶ Play Wild Card</button></div></article><article class="exp44-new-music-card shine-era-song-card" data-card="playlist"><button class="shine-era-cover-play sparkle-cover-play" type="button" data-track="playlist" aria-label="Play Playlist"><img src="assets/album5/playlist-cover-thumb.webp" alt="Playlist song cover by Jahntella" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></button><div><small>THE SURGE ERA · 12 · BONUS TRACK</small><h3>Playlist</h3><p>One more song for the Sweeties who never hit pause.</p><button class="play-button" type="button" data-track="playlist">▶ Play Playlist</button></div></article></div></div></div></section>';
  community.parentNode.insertBefore(tpl.content,community);
  // Keep social connections directly after Album V, before the investor portal.
  const surge=document.getElementById('surgeEraAlbum');
  const connect=document.getElementById('connect');
  if(surge&&connect&&surge.parentNode===connect.parentNode){
    surge.insertAdjacentElement('afterend',connect);
  }
  const actions=document.querySelector('.hero-album-actions');
  if(actions&&!actions.querySelector('a[href="#surgeEraAlbum"]')){
   const link=document.createElement('a');link.className='secondary-button';link.href='#surgeEraAlbum';link.textContent='The Surge Era - Album V';actions.appendChild(link);
  }
  // Existing player uses delegated [data-track] controls; fallback for direct media playback.
  const audio=document.querySelector('audio');
  document.getElementById('surgeEraAlbum').querySelectorAll('[data-track]').forEach(button=>{
   button.addEventListener('click',()=>{
    const key=button.dataset.track;
    if(typeof window.jahntellaToggleTrack==='function')return;
    // Give the site's delegated handlers first opportunity to handle playback.
   });
  });
 };
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
