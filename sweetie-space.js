/* My Sweetie Space — personal favorites and playlists, on this device only.
   Uses the existing Jahntella Radio playback engine. No duplicate audio player. */
(() => {
  'use strict';
  const KEY='jahntellaSweetieSpaceV1';
  const app=()=>window.jahntellaAppRadio;
  let tracks=[],trackMap=new Map(),tab='favorites',query='',available=true;
  let store={favorites:[],playlists:[]},contentEl,root,feedback;
  const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const el=(tag,classes,text)=>{const node=document.createElement(tag);if(classes)node.className=classes;if(text!==undefined)node.textContent=text;return node;};
  const makeButton=(label,action,value,extra='')=>{const b=el('button',extra,label);b.type='button';b.dataset.ssAction=action;if(value!==undefined)b.dataset.key=value;return b;};
  const valid=key=>trackMap.has(key);
  const sanitize=raw=>{
    const f=Array.isArray(raw?.favorites)?[...new Set(raw.favorites.filter(valid))]:[];
    const used=new Set();
    const p=(Array.isArray(raw?.playlists)?raw.playlists:[]).slice(0,50).map((item,i)=>{
      const id=typeof item?.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(item.id)?item.id:'list-'+i;
      return {id,name:String(item?.name||'My Playlist').trim().slice(0,50)||'My Playlist',
        keys:[...new Set((Array.isArray(item?.keys)?item.keys:[]).filter(valid))]};
    }).filter(item=>{if(used.has(item.id))return false;used.add(item.id);return true;});
    return {favorites:f,playlists:p};
  };
  const read=()=>{try{return sanitize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){available=false;return {favorites:[],playlists:[]};}};
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(store));available=true;}catch(e){available=false;}};
  const message=t=>{if(feedback)feedback.textContent=t;};
  const choose=which=>{tab=which;root.querySelectorAll('[data-ss-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.ssTab===which)));render();};
  function row(track,context='catalog'){
    const r=el('div','ss-row'),img=el('img'),info=el('div','ss-info'),actions=el('div','ss-row-actions');
    img.loading='lazy';img.src=new URL(track.artwork||'app-icons/jahntella-192.png',document.baseURI).href;img.alt=track.title+' cover';
    img.onerror=()=>{img.onerror=null;img.src='/app-icons/jahntella-192.png';};
    info.append(el('strong','',track.title),el('small','',track.era?track.era+' Era · Jahntella':'Jahntella'));
    const play=makeButton('▶ Play','play',track.key);
    const fav=makeButton(store.favorites.includes(track.key)?'♥ Saved':'♡ Save','favorite',track.key);
    fav.setAttribute('aria-pressed',String(store.favorites.includes(track.key)));
    actions.append(play,fav);
    if(store.playlists.length){
      const select=el('select');select.dataset.ssAdd=track.key;select.setAttribute('aria-label','Add '+track.title+' to a playlist');
      const prompt=el('option','', '+ Playlist');prompt.value='';select.append(prompt);
      store.playlists.forEach(p=>{const o=el('option','',p.name);o.value=p.id;select.append(o);});
      actions.append(select);
    }
    r.append(img,info,actions);return r;
  }
  const empty=text=>el('p','ss-empty',text);
  function renderFavorites(){
    const keys=store.favorites.filter(valid);
    if(!keys.length){contentEl.append(empty('No favorites yet, Sweetie. Explore All Songs and tap ♡ Save to start your collection!'));return;}
    const playAll=makeButton('▶ Play My Favorites','queue-favorites');playAll.className='ss-pill';contentEl.append(playAll);
    const list=el('div','ss-list');keys.forEach(k=>list.append(row(trackMap.get(k),'favorites')));contentEl.append(list);
  }
  function renderPlaylists(){
    const form=el('form','ss-create');form.id='ssCreatePlaylist';
    const input=el('input');input.type='text';input.name='playlist';input.maxLength=50;input.placeholder='Name a playlist (e.g. My Late Night Mix)';input.setAttribute('aria-label','New playlist name');input.required=true;
    const add=el('button','','+ Create Playlist');add.type='submit';form.append(input,add);contentEl.append(form);
    if(!store.playlists.length){contentEl.append(empty('Your first playlist is just one name away! ♡'));return;}
    for(const p of store.playlists){
      const card=el('section','ss-playlist'),top=el('div','ss-playlist-top'),title=el('strong','',p.name);
      const actions=el('div','ss-row-actions');
      actions.append(makeButton('▶ Play','play-list',p.id),makeButton('Rename','rename-list',p.id),makeButton('Delete','delete-list',p.id));
      top.append(title,actions);card.append(top,el('p','',p.keys.length+' song'+(p.keys.length===1?'':'s')));
      if(!p.keys.length)card.append(el('p','ss-empty','Choose songs from All Songs, then add them here.'));
      const list=el('div','ss-playlist-tracks');
      for(const key of p.keys){
        const item=el('div','ss-playlist-track'),label=el('span','',trackMap.get(key)?.title||key),buttons=el('div');
        const play=makeButton('▶','play',key);play.setAttribute('aria-label','Play '+label.textContent);
        const up=makeButton('↑','move-up',key);up.dataset.list=p.id;up.setAttribute('aria-label','Move '+label.textContent+' earlier');
        const down=makeButton('↓','move-down',key);down.dataset.list=p.id;down.setAttribute('aria-label','Move '+label.textContent+' later');
        const remove=makeButton('×','remove-list-song',key);remove.dataset.list=p.id;remove.setAttribute('aria-label','Remove '+label.textContent+' from '+p.name);
        buttons.append(play,up,down,remove);item.append(label,buttons);list.append(item);
      }
      card.append(list);contentEl.append(card);
    }
  }
  function renderCatalog(){
    const input=el('input','ss-search');input.type='search';input.placeholder='Search songs across all six eras';input.value=query;input.setAttribute('aria-label','Search Jahntella songs');
    input.addEventListener('input',()=>{query=input.value;renderCatalogRows();});
    contentEl.append(input,el('div','ss-list'));renderCatalogRows();
  }
  function renderCatalogRows(){
    if(tab!=='catalog')return;
    const list=contentEl.querySelector('.ss-list');if(!list)return;
    list.replaceChildren();
    const matches=tracks.filter(t=>(t.title+' '+t.era).toLowerCase().includes(query.trim().toLowerCase()));
    if(!matches.length){list.append(empty('No matching songs found.'));return;}
    matches.forEach(t=>list.append(row(t)));
  }
  function render(){
    if(!contentEl)return;
    contentEl.replaceChildren();
    if(tab==='favorites')renderFavorites();
    else if(tab==='playlists')renderPlaylists();
    else renderCatalog();
    syncCardHearts();
  }
  function syncCardHearts(){
    document.querySelectorAll('[data-ss-heart]').forEach(b=>{
      const active=store.favorites.includes(b.dataset.ssHeart);
      b.textContent=active?'♥ Saved':'♡ Save';
      b.setAttribute('aria-pressed',String(active));
      b.setAttribute('aria-label',(active?'Remove ':'Save ')+(trackMap.get(b.dataset.ssHeart)?.title||'song')+(active?' from favorites':' to favorites'));
    });
  }
  function addCardHearts(){
    document.querySelectorAll('[data-card]').forEach(card=>{
      const k=card.dataset.card;
      if(!valid(k)||card.querySelector('[data-ss-heart]'))return;
      const b=el('button','ss-card-heart');
      b.type='button';b.dataset.ssHeart=k;
      b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleFavorite(k);});
      card.append(b);
    });
    // Add the save control to the compact player's existing second line — do not alter its grid.
    const player=document.getElementById('player');
    const now=player?.querySelector('.now-playing');
    if(now && !now.querySelector('.ss-now-heart')){
      const button=el('button','ss-now-heart');
      button.type='button';
      button.addEventListener('click',event=>{
        event.stopPropagation();
        const key=app()?.getCurrentKey();
        if(key)toggleFavorite(key);
      });
      now.append(button);
    }
    updateNowHeart();syncCardHearts();
  }
  function updateNowHeart(){
    const b=document.querySelector('.ss-now-heart');if(!b)return;
    const key=app()?.getCurrentKey();b.hidden=!valid(key);
    if(!valid(key))return;
    const active=store.favorites.includes(key);
    b.textContent=active?'♥':'♡';
    b.title=active?'Remove '+trackMap.get(key).title+' from favorites':'Save '+trackMap.get(key).title+' to favorites';
    b.setAttribute('aria-pressed',String(active));
    b.setAttribute('aria-label',(active?'Remove':'Save')+' current song '+(trackMap.get(key)?.title||'')+(active?' from favorites':' to favorites'));
  }
  function toggleFavorite(key){
    if(!valid(key))return;
    if(store.favorites.includes(key)){store.favorites=store.favorites.filter(k=>k!==key);message('Removed from your favorites.');}
    else{store.favorites.push(key);message('Saved to My Sweetie Space! ♡');}
    save();render();updateNowHeart();
  }
  function openSpace(){root.scrollIntoView({behavior:'smooth',block:'start'});root.focus({preventScroll:true});}
  function nav(){
    const bar=document.getElementById('sweetieAppNav');
    if(!bar || bar.dataset.wired==='true')return;
    bar.dataset.wired='true';
    bar.querySelectorAll('[data-ss-nav]').forEach(b=>b.addEventListener('click',()=>{
      bar.querySelectorAll('button').forEach(t=>t.removeAttribute('aria-current'));
      b.setAttribute('aria-current','page');
      const key=b.dataset.ssNav;
      if(key==='space'){
        const section=document.getElementById('mySweetieSpace');
        if(section){section.scrollIntoView({behavior:'smooth',block:'start'});section.focus({preventScroll:true});}
        else message('Your music collection is loading. ♡');
        return;
      }
      const id=key==='eras'?'sweetEraAlbum':key==='lounge'?'sweetieLounge':'home';
      document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
  }
  function act(e){
    const b=e.target.closest('[data-ss-action]');if(!b)return;
    const action=b.dataset.ssAction,key=b.dataset.key;
    if(action==='play'){if(!app()?.playTrack(key))message('The music player is still loading. Try again in a moment.');return;}
    if(action==='favorite'){toggleFavorite(key);return;}
    if(action==='queue-favorites'){if(!app()?.playQueue(store.favorites,'My Favorite Sweeties'))message('Save a song first, then press Play My Favorites.');return;}
    if(action==='play-list'){
      const p=store.playlists.find(p=>p.id===key);
      if(!p?.keys.length){message('Add a song to this playlist first.');return;}
      if(!app()?.playQueue(p.keys,p.name))message('Player unavailable. Please try again.');return;
    }
    if(action==='backup'){
      const data={format:'jahntella-sweetie-space',version:1,exportedAt:new Date().toISOString(),favorites:store.favorites,playlists:store.playlists};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;link.download='jahntella-my-sweetie-space.json';
      document.body.append(link);link.click();link.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url),1000);
      message('Backup created! Keep your file somewhere safe. ♡');
      return;
    }
    if(action==='rename-list'){
      const p=store.playlists.find(p=>p.id===key);if(!p)return;
      const next=window.prompt('Rename this Sweetie playlist:',p.name);
      if(next===null)return;
      const name=next.trim().slice(0,50);
      if(!name){message('Playlist name cannot be empty.');return;}
      p.name=name;save();render();message('Playlist renamed to '+name+'. ♡');
      return;
    }
    if(action==='delete-list'){
      const p=store.playlists.find(p=>p.id===key);
      if(!p||!window.confirm('Delete your playlist "'+p.name+'"?'))return;
      store.playlists=store.playlists.filter(p=>p.id!==key);save();message('Playlist deleted from this device.');render();return;
    }
    if(['move-up','move-down','remove-list-song'].includes(action)){
      const p=store.playlists.find(p=>p.id===b.dataset.list);if(!p)return;
      const i=p.keys.indexOf(key);if(i<0)return;
      if(action==='remove-list-song')p.keys.splice(i,1);
      else {const next=i+(action==='move-up'?-1:1);if(next<0||next>=p.keys.length)return;[p.keys[i],p.keys[next]]=[p.keys[next],p.keys[i]];}
      save();render();
    }
  }
  let bootAttempts=0;
  const boot=()=>{
    // The tab bar must never depend on the music catalog being ready.
    // The original player can load later on slower mobile connections.
    nav();
    if(root)return;
    if(!app()?.getTracks){
      if(bootAttempts++<60)window.setTimeout(boot,150);
      else console.warn('Sweetie Space: radio catalog not available; refresh to retry.');
      return;
    }
    tracks=app().getTracks();trackMap=new Map(tracks.map(t=>[t.key,t]));store=read();
    const hero=document.getElementById('home');if(!hero||!hero.parentElement)return;
    root=el('section','sweetie-space');root.id='mySweetieSpace';root.tabIndex=-1;root.setAttribute('aria-labelledby','sweetieSpaceTitle');
    root.append(el('span','ss-kicker','♡ The Heart of World of Sweet'));
    const heading=el('h2','', 'My Sweetie Space ♡');heading.id='sweetieSpaceTitle';root.append(heading);
    root.append(el('p','ss-subtitle','Save what you love, create your own mix, and keep Jahntella close. Your collection stays on this device.'));
    const tabs=el('div','ss-tabs');tabs.setAttribute('role','tablist');
    [['favorites','♡ Favorites'],['playlists','♫ My Playlists'],['catalog','✦ All Songs']].forEach(([key,label])=>{
      const b=el('button','',label);b.type='button';b.dataset.ssTab=key;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(key===tab));
      b.addEventListener('click',()=>choose(key));tabs.append(b);
    });root.append(tabs);
    contentEl=el('div');contentEl.id='ssContent';root.append(contentEl);
    feedback=el('p','ss-live');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
    root.append(feedback);
    const backup=el('div','ss-backup');
    backup.append(el('strong','', 'Keep your Sweetie collection safe ♡'));
    backup.append(el('p','', 'Save a backup file to your phone before changing devices or clearing app data. You can restore it later.'));
    const exportButton=makeButton('↓ Back Up Collection','backup');
    const restoreLabel=el('label','ss-restore-label','↑ Restore Backup');
    const restoreInput=el('input');restoreInput.type='file';restoreInput.accept='.json,application/json';
    restoreInput.setAttribute('aria-label','Choose a Sweetie Space backup file');
    restoreLabel.append(restoreInput);
    backup.append(exportButton,restoreLabel);
    root.append(backup);
    root.append(el('p','ss-note','♡ Favorites and playlists are stored on this device only. Uninstalling or clearing app data may remove them; cloud sync is not enabled.'));
    hero.insertAdjacentElement('afterend',root);
    root.addEventListener('click',act);
    root.addEventListener('change',e=>{
      const select=e.target.closest('[data-ss-add]');if(!select||!select.value)return;
      const p=store.playlists.find(p=>p.id===select.value),k=select.dataset.ssAdd;
      if(p&&valid(k)){
        if(!p.keys.includes(k)){p.keys.push(k);save();message(trackMap.get(k).title+' added to '+p.name+'! ♡');}
        else message('That song is already in '+p.name+'.');
      }
      select.value='';
    });
    root.addEventListener('change',async e=>{
      const input=e.target.closest('.ss-restore-label input[type="file"]');
      if(!input || !input.files?.length)return;
      const file=input.files[0];
      input.value='';
      if(file.size>1024*1024){message('That backup file is too large.');return;}
      try{
        const imported=JSON.parse(await file.text());
        if(imported?.format!=='jahntella-sweetie-space'||imported?.version!==1)throw new Error('invalid backup');
        if(!Array.isArray(imported.favorites)||!Array.isArray(imported.playlists))throw new Error('incomplete backup');
        if(!window.confirm('Restore this backup? It will replace favorites and playlists saved on this device.'))return;
        store=sanitize(imported);save();render();
        message('Sweetie Space restored: '+store.favorites.length+' favorites and '+store.playlists.length+' playlists. ♡');
      }catch(err){message('That file is not a valid Jahntella Sweetie Space backup.');}
    });
    root.addEventListener('submit',e=>{
      if(e.target.id!=='ssCreatePlaylist')return;
      e.preventDefault();
      const input=e.target.elements.playlist,name=String(input.value||'').trim().slice(0,50);
      if(!name){message('Give your playlist a name first.');return;}
      if(store.playlists.length>=50){message('Your playlist collection is full.');return;}
      store.playlists.push({id:'p'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,keys:[]});
      save();message('Created '+name+'! Open All Songs to add tracks.');render();
    });
    addCardHearts();render();
    window.addEventListener('jahntella:trackchange',updateNowHeart);
    if(!available)message('Local storage is unavailable here; favorites may not persist.');
    if(location.hash==='#mySweetieSpace')root.scrollIntoView({block:'start'});
    // When opening a new app session, do not restore an outdated scroll
    // position from before the mood and Sweetie Space sections were inserted.
    else if(standalone() && !location.hash && 
      (performance.getEntriesByType('navigation')[0]?.type==='navigate')){
      window.requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
