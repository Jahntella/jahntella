/* Focused three-video Jahntella experience. The originals are never re-encoded. */
(() => {
  'use strict';
  const root=document.getElementById('home');
  if(!root || document.getElementById('jahntellaVideoHub'))return;
  const sets=[
    {id:'welcome',heading:'Welcome to Jahntella’s World',kicker:'♡ MEET JAHNTELLA',intro:'Five albums. Five eras. More than 50 songs. Come say hello, discover the music, and make this world your own.',videos:[
      {name:'A Little Hello from Jahntella',label:'START HERE · 30 SECONDS',text:'Jahntella personally invites Sweeties around the world into her five eras and all-immersive world of music.',src:'videos/jahntella-global-welcome-30s.mp4',poster:'c6670e60-a503-48df-981b-536c21542b00.png'},
      {name:'Share Your Moment to Reels',label:'CREATE · SHARE · SHINE',text:'Make a Reel with Jahntella’s music, share your creativity, and invite other Sweeties into the fun.',src:'videos/videos/videos/videos/sweeties-spotlight-invite.mp4',poster:'98aacb45-e77c-45c2-a3e7-c8d2bfb25c93.png'}
    ]},
    {id:'fans',heading:'Your Fan Experience',kicker:'♡ YOU BELONG HERE',intro:'A personal message about confidence, kindness, and knowing you belong in the World of Sweet.',videos:[
      {name:'You Are Beautiful Just as You Are',label:'A MESSAGE FROM JAHNTELLA',text:'For the days you don’t feel beautiful, handsome, or confident: a little encouragement from Jahntella, just for you.',src:'videos/videos/jahntella-welcome.mp4',poster:'0396f96b-d115-4227-81bd-135fc937305c.png'},
    ]}
  ];
  const section=document.createElement('section');
  section.id='jahntellaVideoHub';
  section.className='jvh-wrap';
  section.setAttribute('aria-label','Jahntella welcome and fan experience films');
  const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  section.innerHTML='<div class="jvh-inner">'+sets.map(group=>'<div class="jvh-group jvh-group-'+group.id+'" id="jahntellaVideos-'+group.id+'"><header class="jvh-head"><p>'+escape(group.kicker)+'</p><h2>'+escape(group.heading)+'</h2><span>'+escape(group.intro)+'</span></header><div class="jvh-grid">'+group.videos.map((v,index)=>'<article class="jvh-card" data-video-path="'+escape(v.src)+'" hidden><div class="jvh-media"><video controls playsinline preload="metadata"'+(v.poster?' poster="'+escape(v.poster)+'"':'')+' aria-label="'+escape(v.name)+'"><source data-src="'+escape(v.src)+'" type="video/mp4">Your browser does not support HTML5 video.</video></div><div class="jvh-copy"><small>'+escape(v.label)+'</small><h3>'+escape(v.name)+'</h3><p>'+escape(v.text)+'</p><a class="jvh-open-file" href="'+escape(v.src)+'" target="_blank" rel="noopener">Open video directly ↗</a></div></article>').join('')+'</div></div>').join('')+'</div>';
  root.insertAdjacentElement('afterend',section);
  const allVideos=[...section.querySelectorAll('video')];
  allVideos.forEach(video=>{
    video.addEventListener('play',()=>{
      document.querySelectorAll('audio,video').forEach(other=>{
        if(other!==video && !other.paused){try{other.pause()}catch(e){}}
      });
    });
  });
  // Retain each clip only if its actual MP4 is present; never show ghost players.
  const cards=[...section.querySelectorAll('.jvh-card')];
  Promise.all(cards.map(card=>{
    const path=card.dataset.videoPath;
    return fetch(path,{method:'HEAD'}).then(r=>{
      if(!r.ok)return;
      const video=card.querySelector('video');
      const source=video.querySelector('source');
      source.src=new URL(source.dataset.src,document.baseURI).href;
      // A <source> added after DOM insertion is not reliably picked up
      // on mobile Safari / Chromium until the media element is reloaded.
      video.load();
      card.hidden=false;
      return true;
    }).catch(()=>false);
  })).then(()=>{
    section.querySelectorAll('.jvh-group').forEach(group=>{
      if(!group.querySelector('.jvh-card:not([hidden])'))group.hidden=true;
    });
    if(!section.querySelector('.jvh-card:not([hidden])'))section.hidden=true;
  });
})();
