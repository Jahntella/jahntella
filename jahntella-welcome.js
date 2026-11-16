/* Jahntella welcome video: reveal only after the matching MP4 exists on this site.
   Does not autoplay, alter the song catalog, or restart paused music. */
(function(){
  'use strict';
  var videoUrl='videos/videos/jahntella-welcome.mp4';
  var posterUrl='videos/videos/jahntella-welcome-poster.jpg';
  var hero=document.getElementById('home');
  if(!hero||document.getElementById('meetJahntella'))return;
  function mount(){
    if(document.getElementById('meetJahntella'))return;
    var section=document.createElement('section');
    section.id='meetJahntella';
    section.setAttribute('aria-labelledby','meetJahntellaTitle');
    section.innerHTML='<div class="mj-shell"><div class="mj-visual"><video class="mj-video" controls playsinline preload="none" poster="'+posterUrl+'" aria-label="Meet Jahntella: welcome to my World of Sweet"><source src="'+videoUrl+'" type="video/mp4">Your browser does not support HTML5 video.</video></div><div class="mj-copy"><p class="mj-kicker">♡ A personal welcome from Jahntella</p><h2 id="meetJahntellaTitle">Meet Jahntella <span>♡</span></h2><p class="mj-intro">Not feeling confident? Need a little pick-me-up? Welcome to the World of Sweet, where there’s a song for your mood and a community to lift you up.</p><p class="mj-promise">Find your confidence. Discover your vibe. Become one of the Sweeties. <strong>We empower each other here.</strong></p><div class="mj-actions"><a class="mj-primary" href="#sweetieLounge">♫ Explore My Music ♡</a><button type="button" class="mj-secondary" data-sweetie-signup-open>♡ Become a Sweetie</button></div><p class="mj-small">Press play to meet Jahntella · Progressing is a Blessing ♡</p></div></div>';
    hero.insertAdjacentElement('afterend',section);
    var welcome=section.querySelector('video');
    welcome.addEventListener('play',function(){
      document.querySelectorAll('audio,video').forEach(function(other){if(other!==welcome&&!other.paused){try{other.pause()}catch(e){}}});
    });
    document.addEventListener('play',function(event){
      if(event.target!==welcome&&welcome&&!welcome.paused){welcome.pause()}
    },true);
    var signup=section.querySelector('[data-sweetie-signup-open]');
    signup.addEventListener('click',function(){
      // Let the site's existing delegated signup handler handle this click.
      // If it isn't delegated, activate an existing signup invitation instead.
      var existing=document.querySelector('.sweetie-inline-invite [data-sweetie-signup-open]');
      if(existing)existing.click();
    });
  }
  // GitHub Pages returns 404 until the optimized video is uploaded.
  // Withhold the section entirely until then: no broken video on the homepage.
  fetch(videoUrl,{method:'HEAD',cache:'no-store'}).then(function(r){if(r.ok)mount()}).catch(function(){});
})();
