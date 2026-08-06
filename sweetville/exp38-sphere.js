(() => {
'use strict';

const panel=document.getElementById('spherePanel');
const slides=[...document.querySelectorAll('[data-slide]')];
const dots=[...document.querySelectorAll('[data-dot]')];
const lights=document.getElementById('sphereLights');
const crowd=document.getElementById('sphereCrowd');
const finale=document.getElementById('sphereFinale');
const confetti=document.getElementById('sphereConfetti');

let current=0;
let lightsOn=false;
let crowdOn=false;
let audioContext=null;
let source=null;
let gain=null;
let autoTimer=null;
let finaleTimer=null;

const show=index=>{
  current=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
};

const startAuto=()=>{
  clearInterval(autoTimer);
  autoTimer=setInterval(()=>show(current+1),5000);
};

const update=()=>{
  finale.disabled=!(lightsOn&&crowdOn);
  document.getElementById('lightStatus').textContent=lightsOn?'Glowing':'Ready';
  document.getElementById('crowdStatus').textContent=crowdOn?'Cheering':'Waiting';
  document.getElementById('finaleStatus').textContent=lightsOn&&crowdOn?'Ready':'Locked';
};

async function startCrowd(){
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;

  audioContext??=new AudioCtx();

  if(audioContext.state==='suspended'){
    await audioContext.resume();
  }

  if(source)return;

  const seconds=3;
  const buffer=audioContext.createBuffer(
    1,
    audioContext.sampleRate*seconds,
    audioContext.sampleRate
  );

  const data=buffer.getChannelData(0);

  for(let i=0;i<data.length;i++){
    const noise=Math.random()*2-1;
    const wave=Math.sin(i/65)*.2+Math.sin(i/19)*.08;
    data[i]=(noise*.28+wave)*(.65+Math.sin(i/9000)*.25);
  }

  source=audioContext.createBufferSource();
  source.buffer=buffer;
  source.loop=true;

  const filter=audioContext.createBiquadFilter();
  filter.type='lowpass';
  filter.frequency.value=1800;

  gain=audioContext.createGain();
  gain.gain.setValueAtTime(.0001,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.13,audioContext.currentTime+.45);

  source.connect(filter).connect(gain).connect(audioContext.destination);
  source.start();
}

function stopCrowd(){
  if(!source||!audioContext)return;

  gain.gain.exponentialRampToValueAtTime(
    .0001,
    audioContext.currentTime+.3
  );

  setTimeout(()=>{
    try{source?.stop()}catch{}
    source=null;
    gain=null;
  },350);
}

function burst(amount){
  confetti.innerHTML='';

  for(let i=0;i<amount;i++){
    const piece=document.createElement('i');
    piece.style.left=`${Math.random()*100}%`;
    piece.style.animationDelay=`${Math.random()*.65}s`;
    piece.style.animationDuration=`${2+Math.random()*1.5}s`;
    piece.style.setProperty(
      '--drift',
      `${-90+Math.random()*180}px`
    );
    confetti.appendChild(piece);
  }

  setTimeout(()=>confetti.innerHTML='',4300);
}

function count(target){
  const element=document.getElementById('sweetiesCount');
  const start=Number(
    (element.textContent||'0').replace(/,/g,'')
  )||0;

  const started=performance.now();

  const tick=now=>{
    const progress=Math.min(1,(now-started)/1100);
    element.textContent=Math.round(
      start+(target-start)*progress
    ).toLocaleString();

    if(progress<1){
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

document.getElementById('spherePrev').onclick=()=>{
  show(current-1);
  startAuto();
};

document.getElementById('sphereNext').onclick=()=>{
  show(current+1);
  startAuto();
};

dots.forEach(dot=>{
  dot.onclick=()=>{
    show(Number(dot.dataset.dot));
    startAuto();
  };
});

lights.onclick=()=>{
  lightsOn=!lightsOn;
  panel.classList.toggle('lights-on',lightsOn);
  lights.textContent=lightsOn
    ?'Dim the Sphere'
    :'Light the Sphere';
  update();
};

crowd.onclick=async()=>{
  crowdOn=!crowdOn;
  panel.classList.toggle('crowd-on',crowdOn);
  crowd.textContent=crowdOn
    ?'Quiet the Sweeties'
    :'Hear the Sweeties';

  if(crowdOn){
    await startCrowd();
    burst(18);
    count(12500+Math.floor(Math.random()*7500));
  }else{
    stopCrowd();
    count(0);
  }

  update();
};

finale.onclick=()=>{
  if(!lightsOn||!crowdOn)return;

  clearTimeout(finaleTimer);
  clearInterval(autoTimer);

  panel.classList.add('finale-running');
  finale.textContent='Finale Live ✨';
  document.getElementById('finaleStatus').textContent='Live';

  count(25000+Math.floor(Math.random()*25000));
  burst(34);

  let steps=0;

  const cycle=setInterval(()=>{
    show(current+1);
    burst(22);
    steps++;

    if(steps>=6){
      clearInterval(cycle);
    }
  },900);

  finaleTimer=setTimeout(()=>{
    panel.classList.remove('finale-running');
    document.getElementById('finaleStatus').textContent='Encore Ready';
    finale.textContent='Launch Finale Again';
    startAuto();
  },6500);
};

show(0);
startAuto();
update();
})();