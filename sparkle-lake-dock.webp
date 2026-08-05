(() => {
  'use strict';

  const rideButton=document.getElementById('sparkleRideButton');
  const rideText=document.getElementById('sparkleRideText');
  const wishButton=document.getElementById('sparkleWishButton');
  const wishText=document.getElementById('sparkleWishText');
  const wishCount=document.getElementById('sparkleWishCount');

  let wishes=Number(localStorage.getItem('jahntellaSparkleLakeWishes')||0);
  if(wishCount)wishCount.textContent=String(wishes);

  const burst=(count=14)=>{
    for(let i=0;i<count;i++){
      const dot=document.createElement('i');
      dot.className='sparkle-firefly';
      dot.style.left=`${45+Math.random()*10}%`;
      dot.style.top=`${50+Math.random()*8}%`;
      dot.style.setProperty('--x',`${(Math.random()-.5)*260}px`);
      dot.style.setProperty('--y',`${-80-Math.random()*220}px`);
      document.body.appendChild(dot);
      setTimeout(()=>dot.remove(),2000);
    }
  };

  rideButton?.addEventListener('click',()=>{
    rideButton.disabled=true;
    rideButton.textContent='🛶 Gliding Across the Lake...';
    rideText.textContent='The paddle boat rocks gently as pink reflections move across the water.';
    burst(20);

    setTimeout(()=>{
      rideText.textContent='Fireworks begin above the castle as the boat reaches the center of Sparkle Lake.';
      rideButton.textContent='🎆 Fireworks Over the Lake';
      rideButton.disabled=false;
      document.body.animate(
        [{filter:'brightness(1)'},{filter:'brightness(1.18)'},{filter:'brightness(1)'}],
        {duration:1100}
      );
    },1800);
  });

  wishButton?.addEventListener('click',()=>{
    wishes+=1;
    localStorage.setItem('jahntellaSparkleLakeWishes',String(wishes));
    wishCount.textContent=String(wishes);
    wishText.textContent='Your heart-shaped wish is floating across Sparkle Lake.';
    wishButton.textContent='💖 Wish Made';
    burst(12);
  });
})();