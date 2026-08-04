(() => {
  const KEY='jahntellaBubblegumBayPassportV253';
  const button=document.getElementById('exp253StampButton');
  const title=document.getElementById('exp253PassportTitle');
  const text=document.getElementById('exp253PassportText');
  const row=document.querySelector('.exp253-passport-row');
  if(!button||!title||!text||!row)return;
  const render=()=>{
    const stamped=localStorage.getItem(KEY)==='yes';
    row.classList.toggle('is-stamped',stamped);
    button.disabled=stamped;
    button.textContent=stamped?'Bubblegum Bay Stamped ✓':'Stamp Bubblegum Bay';
    title.textContent=stamped?'Bubblegum Bay is in your Sweetie Passport':'Bubblegum Bay stamp waiting';
    text.textContent=stamped?'Your visit to Sweetville’s newest district is saved on this device.':'Visit the new district to add this destination to your device.';
  };
  button.addEventListener('click',()=>{localStorage.setItem(KEY,'yes');render();document.getElementById('exp254BubblegumBay')?.scrollIntoView({behavior:'smooth',block:'start'});});
  render();
})();

(() => {
  const fun=document.getElementById('exp254FunAudio');
  const pink=document.getElementById('exp254PinkAudio');
  const now=document.getElementById('exp254NowPlaying');
  const resultIcon=document.getElementById('exp254ResultIcon');
  const resultKicker=document.getElementById('exp254ResultKicker');
  const resultTitle=document.getElementById('exp254ResultTitle');
  const resultText=document.getElementById('exp254ResultText');
  const secretButton=document.getElementById('exp254SecretButton');
  const secretTitle=document.getElementById('exp254SecretTitle');
  const secretText=document.getElementById('exp254SecretText');
  const secretCard=document.querySelector('.exp254-secret-card');
  const KEY='jahntellaBubblegumBaySweetPackV254';
  if(!fun||!pink||!now||!resultTitle)return;
  const stopAll=()=>{[fun,pink].forEach(a=>{a.pause();a.currentTime=0;});};
  document.querySelectorAll('[data-exp254-track]').forEach(button=>button.addEventListener('click',async()=>{
    const track=button.dataset.exp254Track;stopAll();
    if(track==='stop'){now.textContent='Park music paused';return;}
    const audio=track==='fun'?fun:pink;now.textContent=track==='fun'?'Fun Dipp':'Pink Lips Remix';
    try{await audio.play();}catch{}
  }));
  const messages={
    pool:['💖','SPARKLE POOL','Come on in—the water’s perfect.','Jahntella saved you a chair beside the pink palms.'],
    slides:['🛝','RAINBOW SLIDES','Ready, Sweetie? Race you to the bottom!','The slide lights flash in time with the music.'],
    smoothie:['🍹','CANDY SMOOTHIE BAR','Today’s mix: raspberry sparkle splash.','Cucumber water, berries, and something sweet for the ride.'],
    photo:['📸','BAY PHOTO SPOT','Smile—Bubblegum Bay looks good on you.','This memory is ready for your Sweetville story.']
  };
  document.querySelectorAll('[data-exp254-zone]').forEach(button=>button.addEventListener('click',()=>{
    const m=messages[button.dataset.exp254Zone];
    resultIcon.textContent=m[0];resultKicker.textContent=m[1];resultTitle.textContent=m[2];resultText.textContent=m[3];
    document.getElementById('exp254ResultCard')?.scrollIntoView({behavior:'smooth',block:'center'});
  }));
  const renderSecret=()=>{
    const found=localStorage.getItem(KEY)==='yes';
    secretCard?.classList.toggle('is-found',found);
    secretButton.textContent=found?'💋':'?';
    secretTitle.textContent=found?'Hidden Sweet Pack discovered!':'Somewhere in Bubblegum Bay...';
    secretText.textContent=found?'You found the first Bubblegum Bay collectible. It is saved on this device.':'Explore the park to reveal the hidden Sweet Pack.';
  };
  secretButton?.addEventListener('click',()=>{
    localStorage.setItem(KEY,'yes');renderSecret();
    resultIcon.textContent='🎁';resultKicker.textContent='SECRET COLLECTIBLE';resultTitle.textContent='Bubblegum Bay Sweet Pack';resultText.textContent='A limited park collectible has been added to your Sweetville memories.';
  });
  renderSecret();
})();