/* World of Sweet personal dashboard. No accounts, servers or tracking pixels.
   Only saves up to 20 recent confirmed song starts on this device. */
(() => {
 'use strict';
 const HISTORY_KEY='jahntellaRecentlyPlayedV1';
 const FAVORITES_KEY='jahntellaSweetieSpaceV1';
 const MAX_HISTORY=20;
 const eras=['Sweet','Shine','Sparkle','Siren','Surge','Synergy'];
 const sweetKeys=['fun-dipp','pink-lips','bite-lip','gloss','your-girl','embrace-me','we-come-together','play-with-me','carnival','made-of-light','candy-wrapper','playground','milk-shake','tonight'];
 const shineKeys=['sweet-dreams','we-are-1','boots-smile-attitude','midnight-rodeo','redline','smoke-show','chasing-me','coming-down','you-and-me'];
 const fallbackEra=k=>sweetKeys.includes(k)?'Sweet':shineKeys.includes(k)?'Shine':'';
 const readJson=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}catch{return fallback;}};
 const getHistory=()=>{const raw=readJson(HISTORY_KEY,[]);return Array.isArray(raw)?raw.filter(x=>typeof x==='string').slice(0,MAX_HISTORY):[]};
 const favoriteKeys=()=>{const raw=readJson(FAVORITES_KEY,{});return Array.isArray(raw.favorites)?raw.favorites.filter(x=>typeof x==='string'):[]};
 const node=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const playing=key=>{const audio=window.jahntellaAppRadio;return !!audio?.playTrack?.(key)};
 let history=getHistory(),tracks=[],byKey=new Map(),root,recentBox,eraBox,recommendBox,note;
 const trackEra=t=>eras.includes(t.era)?t.era:fallbackEra(t.key);
 const trackButton=(song,withSave=false)=>{
   const card=node('div','sw-track');
   const img=node('img');img.loading='lazy';img.alt=song.title+' artwork';
   img.src=new URL(song.artwork||'app-icons/jahntella-192.png',document.baseURI).href;
   img.onerror=()=>{img.onerror=null;img.src='/app-icons/jahntella-192.png';};
   const info=node('div','sw-track-info');
   info.append(node('strong','',song.title),node('small','',trackEra(song)?trackEra(song)+' Era':'Jahntella'));
   const actions=node('div','sw-track-actions');
   const play=node('button','sw-play','▶');play.type='button';play.title='Play '+song.title;play.setAttribute('aria-label','Play '+song.title);
   play.addEventListener('click',()=>{if(!playing(song.key))note.textContent='Radio is still getting ready. Try again in a moment.';});
   actions.append(play);
   if(withSave){
     const saved=favoriteKeys().includes(song.key);
     const save=node('button','sw-save',saved?'♥':'♡');
     save.type='button';save.setAttribute('aria-pressed',String(saved));save.title=saved?'Already saved in My Sweetie Space':'Open My Sweetie Space to save';
     save.setAttribute('aria-label','Open My Sweetie Space to save '+song.title);
     save.addEventListener('click',()=>{
       document.getElementById('mySweetieSpace')?.scrollIntoView({behavior:'smooth',block:'start'});
       document.querySelector('[data-ss-tab="catalog"]')?.click();
       const search=document.querySelector('#mySweetieSpace .ss-search');
       if(search){search.value=song.title;search.dispatchEvent(new Event('input',{bubbles:true}));}
     });
     actions.append(save);
   }
   card.append(img,info,actions);return card;
 };
 const render=()=>{
   if(!root)return;
   const favorites=favoriteKeys().filter(k=>byKey.has(k));
   const recent=[...new Set(history)].filter(k=>byKey.has(k)).slice(0,5);
   recentBox.replaceChildren();
   if(!recent.length)recentBox.append(node('p','sw-empty','Your journey begins with one song. Play anything on Jahntella Radio and it will appear here. ♡'));
   else recent.forEach(k=>recentBox.append(trackButton(byKey.get(k))));
   const erase=root.querySelector('#swClearHistory');
   if(erase)erase.hidden=!history.length;
   const scores=Object.fromEntries(eras.map(e=>[e,0]));
   favorites.forEach(k=>{const era=trackEra(byKey.get(k));if(era)scores[era]+=3;});
   history.slice(0,12).forEach(k=>{const t=byKey.get(k);if(t){const era=trackEra(t);if(era)scores[era]+=1;}});
   eraBox.replaceChildren();
   eras.forEach(era=>{
     const count=favorites.filter(k=>trackEra(byKey.get(k))===era).length;
     const tile=node('div','sw-era');
     const heading=node('strong','',era+' Era'),meta=node('small','',count+' saved '+(count===1?'song':'songs'));
     tile.append(heading,meta);
     if(scores[era]>0){const label=node('span','sw-era-badge','♡ In your mix');tile.append(label);}
     eraBox.append(tile);
   });
   recommendBox.replaceChildren();
   const qualified=tracks.filter(t=>trackEra(t)&&!favorites.includes(t.key)&&!history.slice(0,5).includes(t.key));
   const ranked=qualified.map(t=>({t,score:scores[trackEra(t)]||0})).sort((a,b)=>b.score-a.score||tracks.indexOf(a.t)-tracks.indexOf(b.t));
   let picks=ranked.slice(0,4).map(x=>x.t);
   const personalized=ranked.length>0&&ranked[0].score>0;
   const subtitle=root.querySelector('#swRecommendationsDescription');
   if(subtitle)subtitle.textContent=personalized?'Based on the eras you have saved and recently played. Try something new! ♡':'A little taste of Jahntella while your Sweetie collection grows. ♡';
   if(!picks.length)recommendBox.append(node('p','sw-empty','You have discovered every song available in your current collection!'));
   else picks.forEach(t=>recommendBox.append(trackButton(t,true)));
   const totals=root.querySelector('#swDashboardStats');
   if(totals)totals.textContent=favorites.length+' saved ♡  ·  '+history.length+' recent plays on this device';
 };
 const boot=()=>{
   if(root || !window.jahntellaAppRadio?.getTracks)return;
   const hero=document.getElementById('home');if(!hero)return;
   tracks=window.jahntellaAppRadio.getTracks();
   byKey=new Map(tracks.map(t=>[t.key,t]));
   root=node('section','sweetie-dashboard');
   root.id='sweetieDashboard';root.setAttribute('aria-labelledby','swDashboardTitle');
   const top=node('div','sw-dashboard-head');
   const eyebrow=node('span','sw-eyebrow','♡ Welcome Home, Sweetie');
   const h=node('h2','', 'Your World of Sweet');h.id='swDashboardTitle';
   const description=node('p','', 'Your music, your moods, your little corner of Jahntella’s world.');
   const go=node('a','sw-dashboard-link','♥ Open My Sweetie Space');go.href='#mySweetieSpace';
   top.append(eyebrow,h,description,go);
   const stats=node('p','sw-stats');stats.id='swDashboardStats';top.append(stats);
   root.append(top);
   const grid=node('div','sw-dashboard-grid');
   const recentSection=node('section','sw-panel');
   const recentHead=node('div','sw-section-head');
   const recentTitle=node('h3','', 'Recently Played');
   const clear=node('button','sw-clear','Clear history');clear.id='swClearHistory';clear.type='button';
   clear.addEventListener('click',()=>{
     if(!history.length)return;
     if(!window.confirm('Clear your recently played songs on this device? Your favorites and playlists will stay saved.'))return;
     history=[];try{localStorage.removeItem(HISTORY_KEY);}catch{}
     render();note.textContent='Listening history cleared. Your favorites and playlists are untouched. ♡';
   });
   recentHead.append(recentTitle,clear);recentSection.append(recentHead);recentBox=node('div','sw-track-list');recentSection.append(recentBox);
   const recSection=node('section','sw-panel');recSection.append(node('h3','', 'A Little Something for You'));
   const desc=node('p','sw-supporting');desc.id='swRecommendationsDescription';recSection.append(desc);
   recommendBox=node('div','sw-track-list');recSection.append(recommendBox);
   grid.append(recentSection,recSection);root.append(grid);
   const eraSection=node('section','sw-panel sw-era-panel');
   eraSection.append(node('h3','', 'Your Six Eras'));
   eraSection.append(node('p','sw-supporting','See where your saved music lives. Your favorites shape your recommendations.'));
   eraBox=node('div','sw-eras');eraSection.append(eraBox);root.append(eraSection);
   note=node('p','sw-dashboard-note');note.setAttribute('role','status');note.setAttribute('aria-live','polite');root.append(note);
   root.append(node('p','sw-privacy','Only this device stores recent listening, favorites, and recommendations. No account or listening history is sent to Jahntella.'));
   const sweetie=document.getElementById('mySweetieSpace');
   if(sweetie)sweetie.insertAdjacentElement('beforebegin',root);
   else hero.insertAdjacentElement('afterend',root);
   render();
   window.addEventListener('jahntella:trackstarted',event=>{
     const key=event.detail?.key;
     if(!byKey.has(key))return;
     history=[key,...history.filter(k=>k!==key)].slice(0,MAX_HISTORY);
     try{localStorage.setItem(HISTORY_KEY,JSON.stringify(history));}catch{}
     render();
   });
   window.addEventListener('jahntella:sweetiechange',render);
   window.addEventListener('storage',event=>{if(event.key===FAVORITES_KEY){render()}});
   document.getElementById('sweetieAppNav')?.querySelector('[data-ss-nav="space"]')?.addEventListener('click',()=>{
     // Dashboard is placed immediately above the Sweetie Space collection.
     // Keep original nav behavior to My Sweetie Space itself.
   });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();
