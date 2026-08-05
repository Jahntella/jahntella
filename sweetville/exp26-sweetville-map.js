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
    if(pin.dataset.target){
      pin.addEventListener('click',()=>{
        const target=document.getElementById(pin.dataset.target);
        if(!target)return;
        setMode('explore');
        setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),80);
      });
    }
  });

  setMode(localStorage.getItem(KEY)||'map');
})();