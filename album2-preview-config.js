/* The Shine Era presentation + shared play transport */
window.JAHNTELLA_ALBUM2=Object.freeze({previewMode:false,plannedManualActivation:'2026-08-26',releaseDate:'2026-08-27',tracks:Object.freeze({
  'sweet-dreams':Object.freeze({fullAudio:'sweetville/sweet-dreams.mp3',previewAudio:'sweetville/previews/sweet-dreams-preview.mp3',fullVideo:'assets/album2/sweet-dreams-official-visualizer.mp4',previewVideo:'assets/album2/previews/sweet-dreams-preview.mp4'}),
  'we-are-1':Object.freeze({fullAudio:'sweetville/we-are-1.mp3',previewAudio:'sweetville/previews/we-are-1-preview.mp3',fullVideo:'assets/album2/we-are-1-official-visualizer.mp4',previewVideo:'assets/album2/previews/we-are-1-preview.mp4'}),
  'boots-smile-attitude':Object.freeze({fullAudio:'sweetville/boots-smile-attitude.mp3',previewAudio:'sweetville/previews/boots-smile-attitude-preview.mp3',fullVideo:'assets/album2/boots-smile-attitude-official-visualizer.mp4',previewVideo:'assets/album2/previews/boots-smile-attitude-preview.mp4'}),
  'midnight-rodeo':Object.freeze({fullAudio:'assets/album2/midnight-rodeo.mp3',fullVideo:'assets/album2/midnight-rodeo-official-visualizer.mp4?v=77.0',artwork:'assets/album2/midnight-rodeo-cover.webp?v=77.0',artworkThumb:'assets/album2/midnight-rodeo-cover-thumb.webp?v=77.0'}),
  redline:Object.freeze({fullAudio:'assets/album2/redline.mp3',fullVideo:'assets/album2/redline-official-visualizer.mp4',artwork:'assets/album2/redline-cover.webp',artworkThumb:'assets/album2/redline-cover-thumb.webp'}),
  'smoke-show':Object.freeze({fullAudio:'assets/album2/smoke-show.mp3',fullVideo:'assets/album2/smoke-show-official-visualizer.mp4',artwork:'assets/album2/smoke-show-cover.webp',artworkThumb:'assets/album2/smoke-show-cover-thumb.webp'}),
  'chasing-me':Object.freeze({fullAudio:'assets/album2/chasing-me.mp3',fullVideo:'assets/album2/chasing-me-official-visualizer.mp4',artwork:'assets/album2/chasing-me-cover.webp',artworkThumb:'assets/album2/chasing-me-cover-thumb.webp'}),
  'coming-down':Object.freeze({fullAudio:'assets/album2/coming-down.mp3',fullVideo:'assets/album2/coming-down-official-visualizer.mp4',artwork:'assets/album2/coming-down-cover.webp',artworkThumb:'assets/album2/coming-down-cover-thumb.webp'}),
  'you-and-me':Object.freeze({fullAudio:'assets/album2/you-and-me.mp3',fullVideo:'assets/album2/you-and-me-official-visualizer.mp4',artwork:'assets/album2/you-and-me-cover.webp',artworkThumb:'assets/album2/you-and-me-cover-thumb.webp'})
})});

(()=>{
  const addScript=(src,version)=>{const s=document.createElement('script');s.src=new URL(`${src}?v=${version}`,document.baseURI).href;s.defer=true;document.head.appendChild(s);};
  const addCss=(href,version)=>{const l=document.createElement('link');l.rel='stylesheet';l.href=new URL(`${href}?v=${version}`,document.baseURI).href;document.head.appendChild(l);};

  const shineTracks=[
    {key:'sweet-dreams',title:'Sweet Dreams',tag:'DREAM POP · ALBUM II',art:'assets/album2/sweet-dreams-cover.webp',description:'A neon after-dark escape where the beat, the lights, and one unforgettable connection turn into a perfect dream.'},
    {key:'we-are-1',title:'We Are 1',tag:'UNITY POP · ALBUM II',art:'assets/album2/we-are-1-cover.webp',description:'A glowing celebration of togetherness—made for raised hands, shared hearts, and one beautiful moment in the light.'},
    {key:'boots-smile-attitude',title:'Boots, Smile & Attitude',tag:'POP COUNTRY EDM · ALBUM II',art:'assets/album2/boots-smile-attitude-cover.webp',description:'Boots on, confidence up—a sparkling country-pop dance-floor rush with a smile that owns the room.'},
    {key:'midnight-rodeo',title:'Midnight Rodeo',tag:'NEON RODEO · ALBUM II',art:'assets/album2/midnight-rodeo-cover.webp?v=77.0',description:'A wild moonlit ride where country attitude meets crystal-pop energy and the night refuses to be tamed.'},
    {key:'redline',title:'Redline',tag:'HIGH-SPEED POP · ALBUM II',art:'assets/album2/redline-cover.webp',description:'A fearless, full-throttle anthem built for open roads, racing hearts, and the thrill of going all the way.'},
    {key:'smoke-show',title:'Smoke Show',tag:'AFTER-DARK POP · ALBUM II',art:'assets/album2/smoke-show-cover.webp',description:'Sultry, self-assured, and impossible to ignore—pure heat wrapped in purple smoke and electric confidence.'},
    {key:'chasing-me',title:'Chasing Me',tag:'CLUB POP · ALBUM II',art:'assets/album2/chasing-me-cover.webp',description:'A sleek no-chaser anthem for knowing your worth, setting the pace, and letting everybody else try to keep up.'},
    {key:'coming-down',title:'Coming Down',tag:'CONCERT POP · ALBUM II',art:'assets/album2/coming-down-cover.webp',description:'The lights are high and the feeling is higher—a concert-sized rush you never want to come down from.'},
    {key:'you-and-me',title:'You and Me',tag:'GALAXY POP · ALBUM II',art:'assets/album2/you-and-me-cover.webp',description:'A cosmic final ride made for two hearts, one neon galaxy, and a love built to keep shining forever.'}
  ];

  const createShineSongCard=track=>{
    const a=document.createElement('article');
    a.className='exp44-new-music-card shine-era-song-card';
    a.dataset.card=track.key;
    a.innerHTML=`<button class="shine-era-cover-play" type="button" data-shine-track="${track.key}" aria-label="Play ${track.title}"><img src="${track.art}" alt="${track.title} song cover by Jahntella" loading="lazy" decoding="async" width="480" height="480"><span aria-hidden="true">▶</span></button><div><small>${track.tag}</small><h3>${track.title}</h3><p>${track.description}</p><button class="play-button shine-era-play-button" type="button" data-track="${track.key}" data-shine-track="${track.key}">▶ Play ${track.title}</button></div>`;
    return a;
  };

  const addHomepageSongCards=()=>{
    const g=document.querySelector('.exp66-shine-videos');
    if(!g)return;
    g.classList.add('shine-era-song-grid');
    g.setAttribute('aria-label','Play The Shine Era Album II songs in album order');
    g.replaceChildren(...shineTracks.map(createShineSongCard));
  };

  const wireShineSongCards=()=>{
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-shine-track]');
      if(!button)return;
      const key=button.dataset.shineTrack;
      if(!key)return;
      if(['midnight-rodeo','redline','smoke-show','chasing-me','coming-down','you-and-me'].includes(key)){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.jahntellaPlayShineEraTrack?.(key,true);
      }else if(button.classList.contains('shine-era-cover-play')){
        event.preventDefault();
        window.jahntellaSelectSiteTrack?.(key,true,{fresh:true});
      }
    },true);
  };

  const addShineEraThankYou=()=>{
    const shine=document.getElementById('shineEraSneakPeek');
    if(!shine)return;
    let section=document.getElementById('shineEraThankYou');
    if(!section){
      section=document.createElement('section');
      section.id='shineEraThankYou';
      section.className='exp58-thank-you reveal';
      section.setAttribute('aria-label','A Shine Era thank-you from Jahntella to her Sweeties');
      section.innerHTML='<div class="exp58-thank-you-shell"><figure class="exp58-thank-you-art"><img src="assets/album2/the-shine-era-thank-you.webp" alt="Jahntella thanks her Sweeties for believing in her and making The Shine Era shine" loading="lazy" decoding="async" width="1254" height="1254"></figure></div>';
    }
    const communityHeading=Array.from(document.querySelectorAll('h1,h2,h3,p,strong')).find(node=>/WELCOME TO THE COMMUNITY/i.test(node.textContent||''))
      || Array.from(document.querySelectorAll('h1,h2,h3')).find(node=>/Be A\s*[“\"]?SWEETIE/i.test(node.textContent||''));
    const communitySection=communityHeading?.closest('section');
    if(communitySection?.parentNode)communitySection.parentNode.insertBefore(section,communitySection);
    else shine.insertAdjacentElement('afterend',section);
  };

  const removeNonMusicGalleryPortrait=()=>{
    const g=document.querySelector('.gallery-section .gallery-grid');
    if(!g)return;
    g.querySelectorAll('.gallery-item').forEach(i=>{
      const t=`${i.dataset.lightbox||''} ${i.querySelector('img')?.getAttribute('src')||''} ${i.querySelector('img')?.getAttribute('alt')||''}`.toLowerCase();
      if(/official-v1|closeup|close-up|portrait|jahntella.*face|face.*jahntella/.test(t) && !/cover|song|music|single/.test(t))i.remove();
    });
  };

  const orderAestheticsByAlbum=()=>{
    const g=document.querySelector('.gallery-section .gallery-grid');
    if(!g)return;
    const order=[
      'fun-dipp-cover','pink-lips-remix','bite-lip-cover','gloss-cover','i-want-to-be-your-girl-cover','embrace-me-cover','we-come-together-cover','play-with-me-cover','carnival-cover','made-of-light-cover','candy-wrapper-cover','playground-cover','milk-shake-cover','tonight-cover',
      'sweet-dreams-cover','we-are-1-cover','boots-smile-attitude-cover','midnight-rodeo-cover','redline-cover','smoke-show-cover','chasing-me-cover','coming-down-cover','you-and-me-cover'
    ];
    const rank=new Map(order.map((name,index)=>[name,index]));
    Array.from(g.querySelectorAll(':scope > .gallery-item')).sort((a,b)=>{
      const file=itemFilename(a), fileB=itemFilename(b);
      const ra=rank.has(file)?rank.get(file):1000, rb=rank.has(fileB)?rank.get(fileB):1000;
      return ra-rb;
    }).forEach(item=>g.appendChild(item));
    function itemFilename(item){
      const img=item.querySelector('img');
      const path=(img?.getAttribute('src')||item.getAttribute('data-lightbox')||'').split(/[?#]/)[0];
      return decodeURIComponent(path.split('/').pop()||'').toLowerCase().replace(/\.[^.]+$/,'');
    }
  };

  const run=()=>{
    const sweetville=/\/sweetville(?:\/|$)/i.test(location.pathname);
    if(sweetville){
      if(!window.__jahntellaSweetEraExtensionsLoaded){
        window.__jahntellaSweetEraExtensionsLoaded=true;
        addScript('sweetville/shine-era-sweetville-extensions.js','20260819.3');
      }
      return;
    }
    addScript('shine-era-shared-transport.js','74.0');
    addScript('redline-site.js','20260819.8');
    addScript('midnight-rodeo-site.js','20260819.12');
    addScript('smoke-show-site.js','70.0');
    addScript('chasing-me-site.js','71.0');
    addScript('coming-down-site.js','72.0');
    addScript('you-and-me-site.js','73.0');
    addScript('world-tour-concert-experience.js','76.8');
    addCss('redline-site.css','20260819.8');
    addCss('midnight-rodeo-site.css','20260819.12');
    addCss('smoke-show-site.css','70.0');
    addCss('chasing-me-site.css','71.0');
    addCss('coming-down-site.css','72.0');
    addCss('you-and-me-site.css','73.0');
    addCss('world-tour-concert-experience.css','76.8');
    addCss('shine-era-song-cards.css','82.0');
    addHomepageSongCards();
    wireShineSongCards();
    addShineEraThankYou();
    removeNonMusicGalleryPortrait();
    orderAestheticsByAlbum();
    [250,1000,2500].forEach(delay=>window.setTimeout(()=>{removeNonMusicGalleryPortrait();orderAestheticsByAlbum();},delay));

    const c=document.getElementById('newMusicTitle');
    if(c)c.innerHTML=c.innerHTML.replace(/\b(?:15|16|17|18|19|20) new songs\b/gi,'21 new songs');

    document.querySelectorAll('strong,span,p,h2,h3').forEach(node=>{
      if(node.children.length)return;
      node.textContent=node.textContent.replace(/^(?:17|18|19|20)(?=\s*$)/,'21').replace(/\b(?:17|18|19|20) original songs\b/gi,'21 original songs');
    });

    const gallery=document.getElementById('gallery'),story=document.getElementById('about');
    if(gallery&&story&&story.parentNode&&gallery!==story.previousElementSibling)story.parentNode.insertBefore(gallery,story);

    const intro=Array.from(document.querySelectorAll('p')).find(n=>n.textContent.includes('Get your first look at')&&n.textContent.includes('The Shine Era'));
    if(intro)intro.innerHTML='Get your first look at <strong>The Shine Era</strong>—front and back—and step inside <strong>Sweet Dreams</strong>, <strong>We Are 1</strong>, <strong>Boots, Smile &amp; Attitude</strong>, <strong>Midnight Rodeo</strong>, <strong>Redline</strong>, <strong>Smoke Show</strong>, <strong>Chasing Me</strong>, <strong>Coming Down</strong>, and <strong>You and Me</strong>—nine glimpses of the sound, light, and world of Album II.';
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
