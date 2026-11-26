/* World of Sweet standalone app home. Reuses real authored playlists; no duplicate audio logic. */
(() => {
 'use strict';
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const launch=()=>{
   if(!standalone()||document.querySelector('.jahntella-app-welcome'))return;
   const hero=document.getElementById('home');
   if(!hero||!hero.parentElement)return;
   const section=document.createElement('section');
   section.className='jahntella-app-welcome';
   section.setAttribute('aria-label','Listen With Jahntella');
   section.innerHTML=`
     <span class="app-eyebrow">♡ Your World of Sweet</span>
     <h2>What are we feeling today, Sweetie?</h2>
     <p>Pick a mood and I'll keep you company. Six eras, endless melodies, and a little something for every kind of day. ♡</p>
     <div class="jahntella-app-moods" role="group" aria-label="Pick a music mood">
       <button type="button" data-app-mood="afterdark"><span class="mood-icon" aria-hidden="true">💋</span><strong>Feeling Romantic</strong></button>
       <button type="button" data-app-mood="electric"><span class="mood-icon" aria-hidden="true">⚡</span><strong>Let's Dance</strong></button>
       <button type="button" data-app-mood="confidence"><span class="mood-icon" aria-hidden="true">👑</span><strong>Need Confidence</strong></button>
       <button type="button" data-app-mood="country"><span class="mood-icon" aria-hidden="true">🤠</span><strong>Country Mood</strong></button>
     </div>
     <p class="jahntella-app-feedback" role="status" aria-live="polite">Select a mood to start a real Jahntella playlist.</p>
     <div class="app-shortcuts"><a href="#sweetEraAlbum">♫ Explore Six Eras</a><a href="#sweetieLounge">♡ Music Lounge</a><a href="#sweetieSongBattles">⚡ Song Battles</a></div>`;
   hero.insertAdjacentElement('afterend',section);
   section.querySelectorAll('[data-app-mood]').forEach(button=>button.addEventListener('click',()=>{
     const id=button.getAttribute('data-app-mood');
     const existing=document.querySelector('[data-playlist-id="'+id+'"]');
     const feedback=section.querySelector('.jahntella-app-feedback');
     if(!existing){feedback.textContent='Music is still loading. Try the Playlists menu in a moment. ♡';return;}
     feedback.textContent='Your '+button.innerText.trim()+' playlist is starting. ♡';
     existing.click();
   }));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',launch,{once:true});else launch();
})();
