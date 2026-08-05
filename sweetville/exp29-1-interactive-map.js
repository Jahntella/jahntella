(() => {
  'use strict';
  const hotspots=[...document.querySelectorAll('.exp291-hotspot')];
  const title=document.getElementById('exp291PreviewTitle');
  const kicker=document.getElementById('exp291PreviewKicker');
  const text=document.getElementById('exp291PreviewText');
  const countEl=document.getElementById('exp291VisitedCount');
  const KEY='jahntellaExp291DistrictVisits';

  const descriptions={
    'Bubblegum Bay':'Waterpark adventures, music, and hidden surprises.',
    'Garden Market':'Flowers, friendship, and slow Sweetville mornings.',
    "Mochi's Area":'A playful home for Sweetville’s favorite companion.',
    'Sweetville Sphere':'Music, lights, technology, and immersive spectacle.',
    'Sweeties Stage':'Community performances and voices singing together.',
    'Sparkle Lake':'A glowing waterfront filled with memories and secrets.',
    'Pink Café':'Coffee, conversation, treats, and cozy city moments.',
    'Story Book':'The dedicated story experience behind the World of Sweet.',
    'Carnival':'Rides, games, lights, and celebration.',
    'Candy Lane':'Colorful sweets, shops, and playful discoveries.',
    'Donut District':'Fresh treats and cheerful neighborhood energy.',
    'Starlight Stage':'Big performances beneath the Sweetville skyline.',
    'Sweet Express Station':'The music-powered connection into the world.'
  };

  let visited=[];
  try{visited=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{}
  visited=[...new Set(visited)];

  const render=()=>{if(countEl)countEl.textContent=String(visited.length)};
  const update=hotspot=>{
    const district=hotspot.dataset.district||'Sweetville District';
    kicker.textContent='SELECTED DISTRICT';
    title.textContent=district;
    text.textContent=descriptions[district]||'Enter this Sweetville destination.';
  };

  hotspots.forEach(hotspot=>{
    hotspot.addEventListener('mouseenter',()=>update(hotspot));
    hotspot.addEventListener('focus',()=>update(hotspot));
    hotspot.addEventListener('click',()=>{
      const district=hotspot.dataset.district;
      if(district&&!visited.includes(district)){
        visited.push(district);
        localStorage.setItem(KEY,JSON.stringify(visited));
        render();
      }
    });
  });
  render();
})();