/* Sweetie Song Battles: optional song discovery, no impact on existing player or card layout. */
(() => {
  'use strict';
  const mount = () => {
    const lounge = document.getElementById('sweetieLounge');
    if (!lounge || document.getElementById('sweetieSongBattles')) return;
    const records = new Map();
    const order = window.JAHNTELLA_TRACK_ORDER || [];
    (window.JAHNTELLA_EXTRA_TRACKS || []).forEach(t => records.set(t.key, {key:t.key,title:t.title,art:t.artwork,era:t.era}));
    document.querySelectorAll('[data-card]').forEach(card => {
      const key = card.getAttribute('data-card');
      const title = card.querySelector('h3')?.textContent?.trim();
      const art = card.querySelector('img')?.getAttribute('src');
      if (!key || !title || !art) return;
      const prev = records.get(key) || {};
      records.set(key, {...prev,key,title:prev.title || title,art:prev.art || art});
    });
    const starts = [{era:'Sweet',from:'fun-dipp',to:'sweet-dreams'},{era:'Shine',from:'sweet-dreams',to:'come-here-come-close'},{era:'Sparkle',from:'come-here-come-close',to:'obsessed-with-me'},{era:'Siren',from:'obsessed-with-me',to:'tik-tok'},{era:'Surge',from:'tik-tok',to:'keep-up-with-me'},{era:'Synergy',from:'keep-up-with-me',to:null}];
    starts.forEach(({era,from,to}) => {
      const a=order.indexOf(from), b=to?order.indexOf(to):order.length;
      if(a<0)return;
      order.slice(a,b>a?b:order.length).forEach(key => {const track=records.get(key);if(track)track.era=era;});
    });
    const songs = [...records.values()].filter(s => s.key && s.title && s.art && s.era && order.includes(s.key));
    if (songs.length<2)return;
    const style=document.createElement('style');
    style.textContent=`
      #featuredNow{display:none!important}\n      #sweetieSongBattles{padding:clamp(26px,5vw,55px) 16px;background:linear-gradient(145deg,#180e22,#361b39 58%,#12192e);color:#fff;text-align:center}
      #sweetieSongBattles *{box-sizing:border-box}
      #sweetieSongBattles .battle-inner{max-width:960px;margin:auto}
      #sweetieSongBattles .battle-kicker{font-size:.76rem;letter-spacing:.13em;color:#f2bbda;font-weight:800}
      #sweetieSongBattles h2{font:700 clamp(1.7rem,4vw,2.65rem) Georgia,serif;margin:7px 0;color:white}
      #sweetieSongBattles .battle-intro{color:#e6d4e3;font-size:.95rem;max-width:650px;margin:0 auto 20px}
      #sweetieSongBattles .battle-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:clamp(8px,2vw,24px);align-items:center}
      #sweetieSongBattles .battle-card{border:1px solid #ffffff4b;border-radius:19px;background:#ffffff0d;padding:clamp(12px,2.5vw,24px);min-width:0}
      #sweetieSongBattles .battle-card img{width:min(100%,260px);aspect-ratio:1;object-fit:contain;border-radius:12px;display:block;margin:0 auto 12px}
      #sweetieSongBattles .battle-card h3{font:700 clamp(1.1rem,2.3vw,1.5rem) Georgia,serif;margin:6px 0 5px;color:white;overflow-wrap:anywhere}
      #sweetieSongBattles .battle-era{color:#eec2db;text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;font-weight:800}
      #sweetieSongBattles button{font:700 .9rem Arial,sans-serif;border-radius:99px;padding:10px 17px;min-height:43px;cursor:pointer;border:1px solid #efc0d9}
      #sweetieSongBattles .battle-listen{background:transparent;color:white;margin:8px 4px}
      #sweetieSongBattles .battle-vote{background:#efb5d5;color:#391b31;margin:8px 4px}
      #sweetieSongBattles .battle-vs{font:900 clamp(1.1rem,3vw,2rem) Georgia,serif;color:#ffd3ea}
      #sweetieSongBattles .battle-outcome{min-height:1.5em;margin:20px 0 12px;color:#ffdfef;font-weight:700}
      #sweetieSongBattles .battle-footer{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
      #sweetieSongBattles .battle-footer button{background:#ffffff15;color:white}
      #sweetieSongBattles .battle-footer button:disabled{opacity:.45;cursor:not-allowed}
      #sweetieSongBattles button:focus-visible{outline:3px solid #ffe4f1;outline-offset:3px}
      @media(max-width:560px){#sweetieSongBattles .battle-grid{grid-template-columns:1fr 1fr;gap:9px}#sweetieSongBattles .battle-vs{grid-column:1/-1;grid-row:1}#sweetieSongBattles .battle-card{grid-row:2;padding:10px}#sweetieSongBattles button{padding:9px 11px}#sweetieSongBattles .battle-card img{width:100%}}
    `;
    document.head.appendChild(style);
    const wrap=document.createElement('section');
    wrap.id='sweetieSongBattles';wrap.setAttribute('aria-labelledby','sweetieBattlesTitle');
    wrap.innerHTML=`<div class="battle-inner"><p class="battle-kicker">💗 SWEETIE SONG BATTLES</p><h2 id="sweetieBattlesTitle">Which one is your vibe?</h2><p class="battle-intro">Two songs. Two feelings. Listen to both, pick your fave, and share it with your Sweeties!</p><div class="battle-grid"><article class="battle-card" data-battle-card="0"><img alt="" loading="lazy"><div class="battle-era"></div><h3></h3><button class="battle-listen" type="button">▶ Listen</button><button class="battle-vote" type="button">♡ Pick Winner</button></article><span class="battle-vs" aria-hidden="true">VS</span><article class="battle-card" data-battle-card="1"><img alt="" loading="lazy"><div class="battle-era"></div><h3></h3><button class="battle-listen" type="button">▶ Listen</button><button class="battle-vote" type="button">♡ Pick Winner</button></article></div><p class="battle-outcome" role="status" aria-live="polite">Which song wins your heart?</p><div class="battle-footer"><button data-battle-share type="button" disabled>♡ Share my pick</button><button data-battle-next type="button">↻ New matchup</button></div><p class="battle-intro" style="font-size:.76rem;margin-top:16px">Just for fun! Your pick is yours; this is not a public vote tally.</p></div>`;
    // Feature the VS battle near the top instead of duplicating the featured-song picker.
    const featured = document.getElementById('featuredNow');
    if (featured) featured.before(wrap); else lounge.after(wrap);
    const cards=[...wrap.querySelectorAll('[data-battle-card]')],outcome=wrap.querySelector('.battle-outcome');
    const share=wrap.querySelector('[data-battle-share]');
    let pair=[],winner=null,previous='';
    const random=n=>Math.floor(Math.random()*n);
    const choose=()=>{
      let first,second,tries=0;
      do {first=songs[random(songs.length)];second=songs[random(songs.length)];tries++}
      while(tries<60&&(first.key===second.key||first.era===second.era||[first.key,second.key].sort().join('/')===previous));
      if(first.key===second.key)return;
      pair=[first,second];previous=[first.key,second.key].sort().join('/');winner=null;share.disabled=true;
      cards.forEach((card,i)=>{const t=pair[i];card.querySelector('img').src=t.art;card.querySelector('img').alt=t.title+' cover';card.querySelector('.battle-era').textContent=t.era+' Era';card.querySelector('h3').textContent=t.title;card.querySelector('.battle-vote').setAttribute('aria-label','Pick '+t.title+' as your favorite');});
      outcome.textContent='Which song wins your heart?';
    };
    // Battle interactions use a unique overlay instead of the standard song-start reveal.
    const showdown=i=>{
      if(!pair[i]||!pair[1-i])return;
      window.__jahntellaBattleSuppressUntil=Date.now()+4500;
      window.dispatchEvent(new CustomEvent('jahntella:battle-showdown',{detail:{
        pair:pair.map(t=>({key:t.key,title:t.title,art:t.art,era:t.era})),
        winnerIndex:i
      }}));
    };
    const listen=i=>{
      const t=pair[i];
      if(typeof window.jahntellaSelectSiteTrack==='function'){
        window.__jahntellaBattleSuppressKey=t.key;
        showdown(i);
        window.jahntellaSelectSiteTrack(t.key,true);
        outcome.textContent='Now playing '+t.title+'. Pick your fave when you’re ready!';
      }else outcome.textContent='Player is still loading. Try again in a moment.';
    };
    const vote=i=>{
      winner=pair[i];share.disabled=false;
      listen(i);
      outcome.textContent='♡ '+winner.title+' wins your heart! Enjoy the victory, then tap Share my pick!';
    };
    const shareWinner=async()=>{
      if(!winner)return;
      const url=winner.key==='turn-around'?new URL('/songs/turn-around.html',location.origin):new URL(location.origin+location.pathname);if(winner.key!=='turn-around'){url.searchParams.set('song',winner.key);url.hash='sweetieLounge';}
      const caption='OMG 💗 I picked '+winner.title+' by Jahntella in a Sweetie Song Battle! 🎶 What’s YOUR fave?';
      const text=caption+' '+url.toString();
      if(navigator.share){try{await navigator.share({title:'Sweetie Song Battle — '+winner.title,text:caption,url:url.toString()});outcome.textContent='♡ '+winner.title+' is your Sweetie Song Battle pick!';return;}catch(e){if(e.name==='AbortError'){outcome.textContent='♡ '+winner.title+' is your pick. Tap Share my pick whenever you’re ready.';return;}}}
      try{await navigator.clipboard.writeText(text);outcome.textContent='♡ Your winning song and share message were copied! Paste them in any app to share.';}
      catch(e){window.prompt('Copy your Sweetie Song Battle message:',text);outcome.textContent='♡ Your pick is ready to share!';}
    };
    cards.forEach((card,i)=>{
      const cover=card.querySelector('img');
      cover.setAttribute('role','button');
      cover.tabIndex=0;
      cover.title='Listen and start the VS showdown';
      cover.setAttribute('aria-label','Listen to this song and start the VS showdown');
      cover.style.cursor='pointer';
      cover.addEventListener('click',()=>listen(i));
      cover.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();listen(i);}});
      card.querySelector('.battle-listen').addEventListener('click',()=>listen(i));
      card.querySelector('.battle-vote').addEventListener('click',()=>vote(i));
    });
    wrap.querySelector('[data-battle-next]').addEventListener('click',choose);
    share.addEventListener('click',shareWinner);
    choose();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
