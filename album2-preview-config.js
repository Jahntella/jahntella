/* The Shine Era presentation + shared play transport */
window.JAHNTELLA_ALBUM2=Object.freeze({previewMode:false,plannedManualActivation:'2026-08-26',releaseDate:'2026-08-27',tracks:Object.freeze({
  'sweet-dreams':Object.freeze({fullAudio:'sweetville/sweet-dreams.mp3',previewAudio:'sweetville/previews/sweet-dreams-preview.mp3',fullVideo:'assets/album2/sweet-dreams-official-visualizer.mp4',previewVideo:'assets/album2/previews/sweet-dreams-preview.mp4'}),
  'we-are-1':Object.freeze({fullAudio:'sweetville/we-are-1.mp3',previewAudio:'sweetville/previews/we-are-1-preview.mp3',fullVideo:'assets/album2/we-are-1-official-visualizer.mp4',previewVideo:'assets/album2/previews/we-are-1-preview.mp4'}),
  'boots-smile-attitude':Object.freeze({fullAudio:'sweetville/boots-smile-attitude.mp3',previewAudio:'sweetville/previews/boots-smile-attitude-preview.mp3',fullVideo:'assets/album2/boots-smile-attitude-official-visualizer.mp4',previewVideo:'assets/album2/previews/boots-smile-attitude-preview.mp4'}),
  'midnight-rodeo':Object.freeze({fullAudio:'assets/album2/midnight-rodeo.mp3',fullVideo:'assets/album2/midnight-rodeo-official-visualizer.mp4',artwork:'assets/album2/midnight-rodeo-cover.webp',artworkThumb:'assets/album2/midnight-rodeo-cover-thumb.webp'}),
  redline:Object.freeze({fullAudio:'assets/album2/redline.mp3',fullVideo:'assets/album2/redline-official-visualizer.mp4',artwork:'assets/album2/redline-cover.webp',artworkThumb:'assets/album2/redline-cover-thumb.webp'})
})});

(()=>{
  const addScript=(src,version)=>{const s=document.createElement('script');s.src=new URL(`${src}?v=${version}`,document.baseURI).href;s.defer=true;document.head.appendChild(s);};
  const addCss=(href,version)=>{const l=document.createElement('link');l.rel='stylesheet';l.href=new URL(`${href}?v=${version}`,document.baseURI).href;document.head.appendChild(l);};

  const createVisualizerCard=({id,title,video,poster})=>{
    const a=document.createElement('article');
    a.id=id;
    a.className='exp60-shine-video-card';
    a.innerHTML=`<div class="exp60-shine-video-heading"><span>NEW ERA <i aria-hidden="true"></i> OFFICIAL VISUALIZER</span><h3>${title}</h3></div><div class="exp60-shine-video-frame"><video controls playsinline preload="none" poster="${poster}" aria-label="Play the ${title} official visualizer"><source src="${video}" type="video/mp4"></video></div><div class="exp60-shine-video-note"><span aria-hidden="true">◇</span><p><strong>${title}.</strong> Full song + visualizer from The Shine Era.</p></div>`;
    return a;
  };

  const wireExclusiveVisualizers=root=>root.querySelectorAll('.exp60-shine-video-frame video').forEach(v=>{
    if(v.dataset.exclusiveShineEra==='true')return;
    v.dataset.exclusiveShineEra='true';
    v.addEventListener('play',()=>{
      root.querySelectorAll('.exp60-shine-video-frame video').forEach(o=>{if(o!==v&&!o.paused)o.pause();});
      document.querySelectorAll('audio').forEach(a=>{if(!a.paused)a.pause();});
    });
  });

  const addHomepageVisualizers=()=>{
    const g=document.querySelector('.exp66-shine-videos');
    if(!g)return;
    g.querySelectorAll(':scope > article').forEach(card=>{
      const title=card.querySelector('h3')?.textContent?.trim();
      if(title==='Midnight Rodeo'||title==='Redline')card.remove();
    });
    const ref=Array.from(g.children).find(card=>card.querySelector('h3')?.textContent?.trim()==='Boots, Smile & Attitude') || g.lastElementChild;
    const midnight=createVisualizerCard({id:'midnightRodeoShineEraVisualizer',title:'Midnight Rodeo',video:'assets/album2/midnight-rodeo-official-visualizer.mp4',poster:'assets/album2/midnight-rodeo-cover.webp'});
    const redline=createVisualizerCard({id:'redlineShineEraVisualizer',title:'Redline',video:'assets/album2/redline-official-visualizer.mp4',poster:'assets/album2/redline-cover.webp'});
    if(ref?.parentNode){ref.parentNode.insertBefore(midnight,ref.nextSibling);ref.parentNode.insertBefore(redline,midnight.nextSibling);}else{g.append(midnight,redline);}
    wireExclusiveVisualizers(g);
  };

  const removeNonMusicGalleryPortrait=()=>{
    const g=document.querySelector('.gallery-section .gallery-grid');
    if(!g)return;
    g.querySelectorAll('.gallery-item').forEach(i=>{
      const t=`${i.dataset.lightbox||''} ${i.querySelector('img')?.getAttribute('src')||''} ${i.querySelector('img')?.getAttribute('alt')||''}`.toLowerCase();
      if(/official-v1|closeup|close-up|portrait|jahntella.*face|face.*jahntella/.test(t) && !/cover|song|music|single/.test(t))i.remove();
    });
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
    addScript('shine-era-shared-transport.js','20260819.3');
    addScript('redline-site.js','20260819.8');
    addScript('midnight-rodeo-site.js','20260819.12');
    addCss('redline-site.css','20260819.8');
    addCss('midnight-rodeo-site.css','20260819.12');
    addHomepageVisualizers();
    removeNonMusicGalleryPortrait();
    window.setTimeout(removeNonMusicGalleryPortrait,250);

    const c=document.getElementById('newMusicTitle');
    if(c)c.innerHTML=c.innerHTML.replace(/\b(?:15|16) new songs\b/gi,'17 new songs');

    const gallery=document.getElementById('gallery'),story=document.getElementById('about');
    if(gallery&&story&&story.parentNode&&gallery!==story.previousElementSibling)story.parentNode.insertBefore(gallery,story);

    const intro=Array.from(document.querySelectorAll('p')).find(n=>n.textContent.includes('Get your first look at')&&n.textContent.includes('The Shine Era'));
    if(intro)intro.innerHTML='Get your first look at <strong>The Shine Era</strong>—front and back—and step inside <strong>Sweet Dreams</strong>, <strong>We Are 1</strong>, <strong>Boots, Smile &amp; Attitude</strong>, <strong>Redline</strong>, and <strong>Midnight Rodeo</strong>—five glimpses of the sound, light, and world of Album II.';
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
