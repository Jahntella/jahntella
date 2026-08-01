
(() => {
  'use strict';
  const MASTER='jahntellaSweetvilleV4', META='sweetvillePassportMetaV701', LEGACY='sweetvilleExp60Passport';
  const districts=[
    ['pink-cafe','Pink Café','☕'],['melody-studio','Melody Studio','🎵'],
    ['donut-district','Donut District','🍩'],['sparkle-lake','Sparkle Lake','✨'],
    ['neon-sweetheart','Neon Sweetheart','💖']
  ];
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
  const uniq=v=>[...new Set(Array.isArray(v)?v:[])];
  const master=()=>{const s={visited:[],hearts:[],letters:[],collectibles:[],badges:[],...read(MASTER,{})};Object.keys(s).forEach(k=>{if(Array.isArray(s[k]))s[k]=uniq(s[k])});return s};
  const fresh=()=>({passportNumber:String(Math.floor(100000+Math.random()*900000)),firstVisit:new Date().toISOString(),lastVisit:new Date().toISOString(),totalTrips:1,history:[]});
  let meta=read(META,null);
  if(!meta){const old=read(LEGACY,null);meta=old?{...fresh(),passportNumber:old.passportNumber||fresh().passportNumber,firstVisit:old.firstVisit||new Date().toISOString(),totalTrips:Number(old.totalVisits||1),history:Array.isArray(old.history)?old.history:[]}:fresh()}
  const saveMeta=()=>localStorage.setItem(META,JSON.stringify(meta));
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  const date=(v,t=false)=>{const d=new Date(v);return Number.isNaN(d.getTime())?'Today':d.toLocaleString(undefined,t?{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}:{month:'short',day:'numeric',year:'numeric'})};
  const rank=n=>n>=5?'Sweetville Explorer':n>=4?'World Wanderer':n>=2?'Sweetie Traveler':n>=1?'New Explorer':'New Arrival';
  const render=()=>{
    const s=master(), count=districts.filter(d=>s.visited.includes(d[0])).length, pct=Math.round(count/5*100);
    set('exp60PassportNumber',meta.passportNumber);set('exp60ExplorerRank',rank(count));set('exp60FirstVisit',date(meta.firstVisit));
    set('exp60TotalVisits',String(meta.totalTrips||1));set('exp60DistrictCount',`${count} / 5`);set('exp60Exploration',`${pct}%`);set('exp60ProgressLabel',`${pct}%`);
    const bar=document.getElementById('exp60ProgressBar');if(bar)bar.style.width=`${pct}%`;
    const stamps=document.getElementById('exp60StampGrid');
    if(stamps)stamps.innerHTML=districts.map((d,i)=>{const u=s.visited.includes(d[0]);return `<article class="exp60-stamp ${u?'unlocked exp701-stamp-new':''}" style="--stamp-rotation:${i%2?3:-3}deg"><span>${u?d[2]:'♡'}</span><strong>${d[1]}</strong><small>${u?'STAMPED':'NOT VISITED'}</small></article>`}).join('');
    let story=false;try{const x=JSON.parse(localStorage.getItem('sweetvilleExp50Story'))||{};story=Array.isArray(x.completed)&&x.completed.length>=5}catch{}
    const stickerData=[['👣','First Step',s.visited.length>=1],['🗺️','World Wanderer',s.visited.length>=3],['🏆','Sweetville Explorer',s.visited.length>=5],['📖','Story Keeper',story],['💌','Returning Sweetie',(meta.totalTrips||1)>=2]];
    const stickers=document.getElementById('exp60StickerGrid');
    if(stickers)stickers.innerHTML=stickerData.map(x=>`<article class="exp60-sticker ${x[2]?'':'locked'}"><span>${x[2]?x[0]:'🔒'}</span><strong>${x[2]?x[1]:'Locked Sticker'}</strong><small>${x[2]?'UNLOCKED':'KEEP EXPLORING'}</small></article>`).join('');
    const hist=document.getElementById('exp60HistoryList');
    if(hist)hist.innerHTML=meta.history.length?meta.history.slice(0,8).map(x=>`<article class="exp60-history-item"><span>${x.icon||'♡'}</span><div><strong>${x.name}</strong><small>District visit recorded</small></div><time>${date(x.visitedAt,true)}</time></article>`).join(''):'<div class="exp60-empty-history">Visit a district to begin your passport history.</div>';
  };
  const toast=d=>{let e=document.getElementById('exp701PassportToast');if(!e){e=document.createElement('div');e.id='exp701PassportToast';e.className='exp701-passport-toast';document.body.appendChild(e)}e.textContent=`${d[2]} ${d[1]} passport stamp added!`;e.classList.remove('show');void e.offsetWidth;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600)};
  const visit=slug=>{
    const d=districts.find(x=>x[0]===slug);if(!d)return;
    const s=master(), freshStamp=!s.visited.includes(slug);if(freshStamp)s.visited.push(slug);
    localStorage.setItem(MASTER,JSON.stringify(s));
    const last=meta.history[0], recent=last&&last.slug===slug&&(Date.now()-new Date(last.visitedAt).getTime()<30000);
    if(!recent){meta.history.unshift({slug,name:d[1],icon:d[2],visitedAt:new Date().toISOString()});meta.history=meta.history.slice(0,12);meta.lastVisit=new Date().toISOString();saveMeta()}
    render();if(freshStamp)toast(d);
  };
  const bind=()=>document.querySelectorAll('[data-location]').forEach(e=>{if(e.dataset.passport701Ready)return;const slug=e.dataset.location;if(!districts.some(d=>d[0]===slug))return;e.dataset.passport701Ready='1';e.addEventListener('click',()=>visit(slug))});
  const init=()=>{
    if(!sessionStorage.getItem('sweetvillePassportSessionV701')){sessionStorage.setItem('sweetvillePassportSessionV701','1');if(localStorage.getItem(META))meta.totalTrips=(meta.totalTrips||1)+1;meta.lastVisit=new Date().toISOString();saveMeta()}
    bind();render();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
    document.getElementById('exp60ResetPassport')?.addEventListener('click',()=>{if(!confirm('Reset Sweetville Passport history and stamps?'))return;const s=master();s.visited=[];localStorage.setItem(MASTER,JSON.stringify(s));meta=fresh();saveMeta();render()});
    addEventListener('storage',render);addEventListener('sweetville:progress-changed',render);setInterval(() => { if (document.visibilityState === 'visible') render(); },5000);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
