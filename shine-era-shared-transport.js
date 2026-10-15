(() => {
  'use strict';
  if (/\/sweetville(?:\/|$)/i.test(location.pathname)) return;
  const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/49N5q7aQ2NOM68dZwdU9jK';
  window.jahntellaPlayShineEraTrack = (key, restart=true) => window.jahntellaSelectSiteTrack?.(key,true,{fresh:restart});
  window.jahntellaStopShineEraTrack = () => {};
  // Move legacy extension state into the unified player once.
  try {
    const saved=JSON.parse(sessionStorage.getItem('jahntellaShineEraPlaybackV74')||'{}');
    sessionStorage.removeItem('jahntellaShineEraPlaybackV74');
    if(saved.track){
      window.jahntellaSelectSiteTrack?.(saved.track,false);
      const audio=Array.from(document.querySelectorAll('audio')).find(a=>(a.currentSrc||a.src||'').includes(`/album2/${saved.track}.mp3`));
      if(audio){audio.addEventListener('loadedmetadata',()=>{audio.currentTime=Number(saved.position)||0;if(saved.playing)audio.play().catch(()=>{});},{once:true});audio.load();}
    }
  } catch {}
  const addSpotifyLink=(section,label)=>{if(!section||section.querySelector('.jahntella-spotify-link'))return;const link=document.createElement('a');link.className='primary-button jahntella-spotify-link';link.href=SPOTIFY_ARTIST_URL;link.target='_blank';link.rel='noopener noreferrer';link.textContent=`🎧 ${label}`;const anchor=section.querySelector('.section-heading,.exp44-new-music-head,.exp60-shine-heading,.exp53-album-head');if(anchor)anchor.appendChild(link);else section.insertBefore(link,section.firstChild);};
  const connectSpotifyEverywhere=()=>{document.querySelectorAll('a[href="https://open.spotify.com/search/Jahntella"],a[href="https://open.spotify.com/search/Jahntella/"]').forEach(link=>{link.href=SPOTIFY_ARTIST_URL;});addSpotifyLink(document.getElementById('sweetEraAlbum'),'Listen on Spotify');addSpotifyLink(document.getElementById('music'),'Jahntella on Spotify');addSpotifyLink(document.getElementById('newMusic'),'The Sweet Era on Spotify');addSpotifyLink(document.getElementById('shineEraSneakPeek'),'The Shine Era on Spotify');};
  const spotifyStyle=document.createElement('style');spotifyStyle.textContent='.jahntella-spotify-link{display:inline-flex!important;align-items:center;justify-content:center;gap:.35rem;margin:.8rem auto 0;text-decoration:none!important}.section-heading .jahntella-spotify-link,.exp44-new-music-head .jahntella-spotify-link,.exp60-shine-heading .jahntella-spotify-link,.exp53-album-head .jahntella-spotify-link{width:auto;min-width:210px}@media(max-width:640px){.jahntella-spotify-link{width:100%!important;max-width:330px;margin:.9rem auto 0}}';document.head.appendChild(spotifyStyle);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connectSpotifyEverywhere,{once:true});else connectSpotifyEverywhere();
})();
