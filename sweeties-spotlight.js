/* Coming-soon community showcase. No fake featured creators or collection of private data. */
(function(){
  const mount=()=>{
    if(document.getElementById('sweetiesSpotlight'))return;
    const connect=document.getElementById('connect');
    if(!connect)return;
    const section=document.createElement('section');
    section.id='sweetiesSpotlight';
    section.setAttribute('aria-labelledby','spotlightHeading');
    section.innerHTML=`<div class="ss-shell">
      <p class="ss-kicker">♡ The Sweeties Sound Movement</p>
      <h2 id="spotlightHeading">Sweeties <span>Spotlight ♡</span></h2>
      <p class="ss-intro">Your vibe. Jahntella's music. Our community. 💗 A future home for the Sweeties who bring her songs to life in their own posts, dances, glow-ups and everyday adventures.</p>
      <div class="ss-gallery" aria-label="Future Sweetie feature categories">
        <div class="ss-tile"><span class="ss-icon" aria-hidden="true">💃</span><strong>Your moves</strong></div>
        <div class="ss-tile"><span class="ss-icon" aria-hidden="true">✨</span><strong>Your glow-ups</strong></div>
        <div class="ss-tile"><span class="ss-icon" aria-hidden="true">💗</span><strong>Your moments</strong></div>
      </div>
      <p class="ss-steps"><strong>Want to be considered?</strong> Use a Jahntella song from your app's music library, make a Reel, TikTok or Short, and tag <strong>@jahntella</strong> where available so she can discover it!</p>
      <div class="ss-actions"><a href="https://www.instagram.com/jahntella/" target="_blank" rel="noopener noreferrer">♡ Tag on Instagram</a><a href="https://www.tiktok.com/@jahntella" target="_blank" rel="noopener noreferrer">♫ Tag on TikTok</a></div>
      <p class="ss-note">Spotlight features are coming soon. Selected posts may be shared on Jahntella's socials or featured here with creator credit and permission. Tags do not guarantee a repost or follow. Keep your content your own!</p>
      <p class="ss-footer">We empower each other here. Progressing is a Blessing ♡</p>
    </div>`;
    connect.before(section);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();