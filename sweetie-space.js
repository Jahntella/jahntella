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
    if(context==='favorites')actions.append(makeButton('Remove','favorite',track.key));
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
      actions.append(makeButton('▶ Play','play-list',p.id),makeButton('Delete','delete-list',p.id));
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
    // Keep the proven radio control grid untouched; cards and Sweetie Space own the save UI.
    syncCardHearts();
  }
  function updateNowHeart(){
    const b=document.querySelector('.ss-now-heart');if(!b)return;
    const key=app()?.getCurrentKey();b.hidden=!valid(key);
    if(!valid(key))return;
    const active=store.favorites.includes(key);
    b.textContent=active?'♥ Saved':'♡ Save';
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
    if(!standalone())return;
    const bar=el('nav','sweetie-bottom-nav');bar.setAttribute('aria-label','World of Sweet app navigation');
    const tabs=[['radio','♫','Radio'],['eras','✦','Six Eras'],['space','♥','My Sweeties'],['lounge','♬','Lounge']];
    for(const [key,icon,label] of tabs){
      const b=el('button');b.type='button';b.dataset.ssNav=key;
      b.append(el('span','ss-nav-icon',icon),el('span','',label));
      b.addEventListener('click',()=>{
        bar.querySelectorAll('button').forEach(t=>t.removeAttribute('aria-current'));b.setAttribute('aria-current','page');
        if(key==='space'){openSpace();return;}
        const target=document.getElementById(key==='eras'?'sweetEraAlbum':key==='lounge'?'sweetieLounge':'home');
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      });
      bar.append(b);
    }
    bar.querySelector('button').setAttribute('aria-current','page');
    document.body.append(bar);
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
  const boot=()=>{
    if(!app()?.getTracks)return;
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
    root.append(el('p','ss-note','♡ Saved locally on this device. Clearing browser/app data or uninstalling may remove favorites and playlists; cloud sync is not enabled.'));
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
    root.addEventListener('submit',e=>{
      if(e.target.id!=='ssCreatePlaylist')return;
      e.preventDefault();
      const input=e.target.elements.playlist,name=String(input.value||'').trim().slice(0,50);
      if(!name){message('Give your playlist a name first.');return;}
      if(store.playlists.length>=50){message('Your playlist collection is full.');return;}
      store.playlists.push({id:'p'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,keys:[]});
      save();message('Created '+name+'! Open All Songs to add tracks.');render();
    });
    addCardHearts();render();nav();
    window.addEventListener('jahntella:trackchange',updateNowHeart);
    if(!available)message('Local storage is unavailable here; favorites may not persist.');
    if(location.hash==='#mySweetieSpace')root.scrollIntoView({block:'start'});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
