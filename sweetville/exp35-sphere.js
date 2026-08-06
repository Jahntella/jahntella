(() => {
'use strict';
const panel=document.getElementById('spherePanel');
const slides=[...document.querySelectorAll('[data-slide]')];
const dots=[...document.querySelectorAll('[data-dot]')];
const lights=document.getElementById('sphereLights');
const crowd=document.getElementById('sphereCrowd');
const finale=document.getElementById('sphereFinale');
const confetti=document.getElementById('sphereConfetti');
let current=0, lightsOn=false, crowdOn=false, audioContext=null, source=null, gain=null, autoTimer=null, finaleTimer=null;

const show=i=>{current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===current));dots.forEach((d,n)=>d.classList.toggle('active',n===current))};
const startAuto=()=>{clearInterval(autoTimer);autoTimer=setInterval(()=>show(current+1),5000)};
const update=()=>{finale.disabled=!(lightsOn&&crowdOn);document.getElementById('lightStatus').textContent=lightsOn?'Glowing':'Ready';document.getElementById('crowdStatus').textContent=crowdOn?'Cheering':'Waiting';document.getElementById('finaleStatus').textContent=lightsOn&&crowdOn?'Ready':'Locked'};

async function startCrowd(){
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 audioContext??=new C();if(audioContext.state==='suspended')await audioContext.resume();if(source)return;
 const seconds=3,b=audioContext.createBuffer(1,audioContext.sampleRate*seconds,audioContext.sampleRate),data=b.getChannelData(0);
 for(let i=0;i<data.length;i++){const noise=Math.random()*2-1,wave=Math.sin(i/65)*.2+Math.sin(i/19)*.08;data[i]=(noise*.28+wave)*(.65+Math.sin(i/9000)*.25)}
 source=audioContext.createBufferSource();source.buffer=b;source.loop=true;
 const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1800;
 gain=audioContext.createGain();gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.13,audioContext.currentTime+.45);
 source.connect(filter).connect(gain).connect(audioContext.destination);source.start();
}
function stopCrowd(){if(!source||!audioContext)return;gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.3);setTimeout(()=>{try{source?.stop()}catch{}source=null;gain=null},350)}
function burst(n){confetti.innerHTML='';for(let i=0;i<n;i++){const p=document.createElement('i');p.style.left=`${Math.random()*100}%`;p.style.animationDelay=`${Math.random()*.65}s`;p.style.animationDuration=`${2+Math.random()*1.5}s`;p.style.setProperty('--drift',`${-90+Math.random()*180}px`);confetti.appendChild(p)}setTimeout(()=>confetti.innerHTML='',4300)}
function count(target){const el=document.getElementById('sweetiesCount'),start=Number((el.textContent||'0').replace(/,/g,''))||0,t0=performance.now();const tick=now=>{const p=Math.min(1,(now-t0)/1100);el.textContent=Math.round(start+(target-start)*p).toLocaleString();if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}

document.getElementById('spherePrev').onclick=()=>{show(current-1);startAuto()};
document.getElementById('sphereNext').onclick=()=>{show(current+1);startAuto()};
dots.forEach(d=>d.onclick=()=>{show(Number(d.dataset.dot));startAuto()});
lights.onclick=()=>{lightsOn=!lightsOn;panel.classList.toggle('lights-on',lightsOn);lights.textContent=lightsOn?'Dim the Sphere':'Light the Sphere';update()};
crowd.onclick=async()=>{crowdOn=!crowdOn;panel.classList.toggle('crowd-on',crowdOn);crowd.textContent=crowdOn?'Quiet the Sweeties':'Hear the Sweeties';if(crowdOn){await startCrowd();burst(18);count(12500+Math.floor(Math.random()*7500))}else{stopCrowd();count(0)}update()};
finale.onclick=()=>{if(!lightsOn||!crowdOn)return;clearTimeout(finaleTimer);clearInterval(autoTimer);panel.classList.add('finale-running');finale.textContent='Finale Live ✨';document.getElementById('finaleStatus').textContent='Live';count(25000+Math.floor(Math.random()*25000));burst(34);let steps=0;const cycle=setInterval(()=>{show(current+1);burst(22);steps++;if(steps>=6)clearInterval(cycle)},900);finaleTimer=setTimeout(()=>{panel.classList.remove('finale-running');document.getElementById('finaleStatus').textContent='Encore Ready';finale.textContent='Launch Finale Again';startAuto()},6500)};
show(0);startAuto();update();
})();