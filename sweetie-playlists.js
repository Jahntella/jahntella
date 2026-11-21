/* Playlists menu UI. Uses the established site player—no duplicate audio. */
(function(){
  'use strict';
  const details=document.getElementById('sweetiePlaylistsMenu');
  if(!details)return;
  const status=details.querySelector('[data-playlist-status]');
  const shareButton=details.querySelector('[data-playlist-share]');
  const records=window.JAHNTELLA_CURATED_PLAYLISTS||{};
  const labels={country:'🤠 Country Sweetheart',afterdark:'💋 After Dark',electric:'⚡ Electric Sweetie',confidence:'👑 Confidence Boost'};
  const tracks=window.JAHNTELLA_EXTRA_TRACKS||[];
  const names=Object.fromEntries(tracks.map(t=>[t.key,t.title]));
  Object.assign(names,{'boots-smile-attitude':'Boots, Smile & Attitude'});
  let selected='';
  const render=()=>{
    const active=window.jahntellaPlaylistState?.()||{};
    details.querySelectorAll('[data-playlist-id]').forEach(b=>{
      b.closest('.sweetie-playlist-item').setAttribute('aria-current',String(b.dataset.playlistId===active.id));
      b.textContent=b.dataset.playlistId===active.id?'▶ Playing':'▶ Play';
    });
    if(active.id){
      selected=active.id;
      status.textContent=records[active.id].name+' · Song '+(active.index+1)+' of '+active.total;
      shareButton.classList.add('is-visible');
    }else if(selected){
      status.textContent='Pick a playlist to play its songs in order.';
      shareButton.classList.add('is-visible');
    }else{
      status.textContent='Choose a vibe and let the music play ♡';
    }
  };
  details.querySelectorAll('[data-playlist-id]').forEach(button=>{
    button.addEventListener('click',()=>{
      const id=button.dataset.playlistId;
      if(!window.jahntellaPlayPlaylist?.(id)){
        status.textContent='Music is still loading. Please try again.';
        return;
      }
      selected=id;
      render();
      details.open=false;
      // On mobile, leave the navigation available but collapse it after choosing.
      const nav=document.getElementById('siteNav'),toggle=document.getElementById('navToggle');
      if(nav?.classList.contains('open')){nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
    });
  });
  shareButton.addEventListener('click',async()=>{
    if(!selected||!records[selected])return;
    const url=new URL(window.location.href);url.searchParams.set('playlist',selected);url.hash='sweetiePlaylistsMenu';
    const count=records[selected].songs?.length||4;
    const caption='💗 Listen to '+records[selected].name+' by Jahntella! '+count+' songs, one sweet vibe. '+url.href;
    if(navigator.share){
      try{await navigator.share({title:records[selected].name+' · Jahntella',text:caption,url:url.href});return}
      catch(e){if(e.name==='AbortError')return}
    }
    try{await navigator.clipboard.writeText(caption);status.textContent='♡ Playlist link and caption copied!'}
    catch(e){window.prompt('Copy your playlist link:',caption)}
  });
  window.addEventListener('jahntella:playlistchange',render);
  document.addEventListener('click',e=>{if(details.open&&!details.contains(e.target))details.open=false});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')details.open=false});
  // A shared link highlights its playlist, without surprising visitors with autoplay.
  const shared=new URLSearchParams(location.search).get('playlist');
  if(shared&&records[shared]){
    selected=shared;status.textContent='♡ '+records[shared].name+' shared with you! Tap Play to listen.';
    shareButton.classList.add('is-visible');
    details.open=true;
  }else render();
})();
