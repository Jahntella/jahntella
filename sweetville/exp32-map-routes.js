(() => {
  'use strict';
  const ROUTES = {
    'Bubblegum Bay':'bubblegum-bay.html',
    'Garden Market':'garden-market.html',
    "Mochi's Area":'mochi.html',
    'Sweetville Sphere':'sphere.html',
    'Sweeties Stage':'sweeties-stage.html',
    'Sparkle Lake':'sparkle-lake.html',
    'Pink Café':'pink-cafe.html',
    'Story Book':'story.html',
    'Carnival':'carnival.html',
    'Candy Lane':'candy-lane.html',
    'Donut District':'donut-district.html',
    'Starlight Stage':'starlight-stage.html',
    'Sweet Express Station':'sweet-express.html'
  };
  const install=()=>{
    document.querySelectorAll('.exp291-hotspot[data-district]').forEach(link=>{
      const route=ROUTES[link.dataset.district];
      if(!route)return;
      link.href=route;
      link.removeAttribute('data-target');
      link.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        location.assign(route);
      },true);
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();