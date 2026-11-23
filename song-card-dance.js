/* Keep the six-era card dance in sync with actual audio playback.
   Standalone: doesn't modify the music player, its events, or card controls. */
(function(){
  'use strict';
  var className='jahntella-song-cards-playing';
  var pending=false;
  function sync(){
    pending=false;
    if(!document.body)return;
    var playing=Array.prototype.some.call(document.querySelectorAll('audio'),function(el){
      return !el.paused&&!el.ended&&el.readyState>0;
    });
    document.body.classList.toggle(className,playing&&!document.hidden);
  }
  function queue(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(sync);
  }
  ['play','playing','pause','ended','emptied','stalled'].forEach(function(eventName){
    document.addEventListener(eventName,queue,true);
  });
  document.addEventListener('visibilitychange',queue);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',queue,{once:true});
  }else{
    queue();
  }
})();
