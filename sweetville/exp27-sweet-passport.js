(() => {
  'use strict';
  const mapView=document.getElementById('exp260MapView');
  const exploreView=document.getElementById('exp260ExploreView');
  const previewIcon=document.getElementById('exp260PreviewIcon');
  const previewTitle=document.getElementById('exp260PreviewTitle');
  const previewText=document.getElementById('exp260PreviewText');
  const pins=[...document.querySelectorAll('.exp260-pin')];
  const KEY='jahntellaExp26MapMode';

  const setMode=mode=>{
    const explore=mode==='explore';
    document.body.classList.toggle('exp260-explore-mode',explore);
    mapView?.classList.toggle('active',!explore);
    exploreView?.classList.toggle('active',explore);
    localStorage.setItem(KEY,mode);
  };

  mapView?.addEventListener('click',()=>setMode('map'));
  exploreView?.addEventListener('click',()=>setMode('explore'));

  pins.forEach(pin=>{
    const update=()=>{
      previewIcon.textContent=pin.dataset.icon||'💖';
      previewTitle.textContent=pin.dataset.name||'Sweetville';
      previewText.textContent=pin.querySelector('small')?.textContent||'Enter this destination.';
    };
    pin.addEventListener('mouseenter',update);
    pin.addEventListener('focus',update);
    
  });

  setMode(localStorage.getItem(KEY)||'map');
})();

(() => {
  'use strict';
  const DESTINATIONS=[
    ['bubblegumBay','Bubblegum Bay','💦'],
    ['gardenMarket','Garden Market','🌸'],
    ['sweetiesStage','Sweeties Stage','🎤'],
    ['livingMap','Living World','✨'],
    ['sweetvilleSphere','Sweetville Sphere','🌐'],
    ['bedroom','Sweetie Room','🛏️'],
    ['createHub','Create Hub','🎨'],
    ['passport','Passport','🛂']
  ];
  const KEY='jahntellaExp27Passport';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{visited:[]}}catch{return{visited:[]}}};
  let state=read();
  state.visited=[...new Set(state.visited||[])];

  const visitedEl=document.getElementById('exp270Visited');
  const songsEl=document.getElementById('exp270Songs');
  const packsEl=document.getElementById('exp270Packs');
  const secretsEl=document.getElementById('exp270Secrets');
  const rankEl=document.getElementById('exp270Rank');
  const modalRank=document.getElementById('exp270ModalRank');
  const progressText=document.getElementById('exp270ProgressText');
  const stamps=document.getElementById('exp270Stamps');
  const modal=document.getElementById('exp270PassportModal');

  const rank=count=>count>=8?'Founding Sweetie':count>=6?'Ambassador':count>=4?'Citizen':count>=2?'Explorer':'New Arrival';
  const render=()=>{
    const songs=Number(localStorage.getItem('jahntellaSweetEnergyV25')||0);
    const packFound=localStorage.getItem('jahntellaBubblegumBaySweetPackV254')==='yes'?1:0;
    let secrets=0;
    try{
      const legacy=JSON.parse(localStorage.getItem('jahntellaSweetvilleV4')||'{}');
      secrets=(legacy.hearts?.length||0)+(legacy.letters?.length||0)+(legacy.collectibles?.length||0);
    }catch{}
    visitedEl.textContent=state.visited.length;
    songsEl.textContent=songs;
    packsEl.textContent=packFound;
    secretsEl.textContent=secrets;
    const r=rank(state.visited.length);
    rankEl.textContent=r;modalRank.textContent=r;
    progressText.textContent=`${state.visited.length} destination${state.visited.length===1?'':'s'} visited`;
    stamps.innerHTML=DESTINATIONS.map(([id,name,icon])=>`<article class="exp270-stamp ${state.visited.includes(id)?'visited':''}"><span>${icon}</span><strong>${name}</strong><small>${state.visited.includes(id)?'STAMPED ✓':'NOT VISITED'}</small></article>`).join('');
  };

  document.querySelectorAll('.exp260-pin[data-target]').forEach(pin=>{
    pin.addEventListener('click',()=>{
      const id=pin.dataset.target;
      if(!state.visited.includes(id)){state.visited.push(id);localStorage.setItem(KEY,JSON.stringify(state));render();}
    });
  });
  document.getElementById('exp270OpenPassport')?.addEventListener('click',()=>modal?.showModal());
  document.getElementById('exp270ClosePassport')?.addEventListener('click',()=>modal?.close());
  modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});
  render();
})();
