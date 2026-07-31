
(()=>{"use strict";
const $=id=>document.getElementById(id);
const scenes=[...document.querySelectorAll(".scene")];
const toast=t=>{const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2400)};
const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)go(b.dataset.go)});
$("menuButton").onclick=()=>$("worldNav").classList.toggle("open");
$("followMochi").onclick=()=>{toast("Mochi is leading the way! 🐶");go("lagoon")};
$("mochiGuide").onclick=()=>{toast("Mochi found the Lagoon of Love!");go("lagoon")};

const observer=new IntersectionObserver(entries=>entries.forEach(x=>x.target.classList.toggle("is-visible",x.isIntersecting)),{threshold:.45});
scenes.forEach(s=>observer.observe(s));

function fx(symbol,count=20,originX=innerWidth/2,originY=innerHeight/2){
 const layer=$("fxLayer");
 for(let i=0;i<count;i++){
  const n=document.createElement("span");n.className="fx-heart";n.textContent=symbol;
  n.style.left=originX+"px";n.style.top=originY+"px";
  n.style.setProperty("--x",`${(Math.random()-.5)*innerWidth*.9}px`);
  n.style.setProperty("--y",`${-120-Math.random()*innerHeight*.85}px`);
  n.style.animationDuration=`${1.8+Math.random()*2.2}s`;
  layer.appendChild(n);setTimeout(()=>n.remove(),4300);
 }
}
document.querySelector("[data-fx='fireworks']").onclick=()=>{fx("✦",34,innerWidth*.82,innerHeight*.3);toast("Sweetville fireworks! ✨")};
$("lagoonHearts").onclick=()=>fx("💖",24,innerWidth*.65,innerHeight*.74);
$("cityConfetti").onclick=()=>fx("🎉",30,innerWidth*.55,innerHeight*.3);

function rippleAt(x,y){
 const r=document.createElement("span");r.className="ripple";r.style.left=x+"px";r.style.top=y+"px";$("lagoonWater").appendChild(r);setTimeout(()=>r.remove(),2500)
}
$("lagoonWater").addEventListener("click",e=>rippleAt(e.offsetX,e.offsetY));
$("lagoonRipple").onclick=()=>{const w=$("lagoonWater");rippleAt(w.clientWidth*.52,w.clientHeight*.45);toast("The Lagoon remembers your touch.")};
document.querySelector("[data-mochi='lagoon']").onclick=()=>{for(let i=0;i<4;i++)setTimeout(()=>$("lagoonRipple").click(),i*220);toast("Mochi splashes through the lagoon! 🐾")};

$("cityLights").onclick=()=>{document.querySelectorAll(".billboard").forEach(x=>x.classList.toggle("lit"));toast("Neon City is glowing!")};

const stageImages=["assets/v6-stage-reach.png","assets/v6-stage-salute.png","assets/v6-stage-bow.png"];
let stageIndex=0;
$("nextStageMoment").onclick=()=>{stageIndex=(stageIndex+1)%stageImages.length;$("stageImage").src=stageImages[stageIndex];toast(["Reach for the lights","One more song","Thank you, Sweeties"][stageIndex])};
$("crowdFlashes").innerHTML=Array.from({length:45},(_,i)=>`<span style="left:${Math.random()*100}%;top:${55+Math.random()*42}%;animation-delay:${Math.random()*2}s"></span>`).join("");
$("concertMode").onclick=()=>{$("stage").classList.toggle("concert-on");fx("✦",42,innerWidth*.5,innerHeight*.34);toast($("stage").classList.contains("concert-on")?"Concert Mode is LIVE! 🎤":"Concert Mode paused.")};

document.querySelectorAll(".memory-card").forEach(c=>c.onclick=()=>{$("memoryImage").src=c.dataset.memory;$("memoryTitle").textContent=c.dataset.title;$("memoryModal").showModal()});
$("memoryClose").onclick=()=>$("memoryModal").close();

const keys=[
 {note:"C4",freq:261.63,type:"white",key:"a"},{note:"C#4",freq:277.18,type:"black",key:"w",left:9.1},
 {note:"D4",freq:293.66,type:"white",key:"s"},{note:"D#4",freq:311.13,type:"black",key:"e",left:21.6},
 {note:"E4",freq:329.63,type:"white",key:"d"},{note:"F4",freq:349.23,type:"white",key:"f"},
 {note:"F#4",freq:369.99,type:"black",key:"t",left:46.6},{note:"G4",freq:392,type:"white",key:"g"},
 {note:"G#4",freq:415.3,type:"black",key:"y",left:59.1},{note:"A4",freq:440,type:"white",key:"h"},
 {note:"A#4",freq:466.16,type:"black",key:"u",left:71.6},{note:"B4",freq:493.88,type:"white",key:"j"},
 {note:"C5",freq:523.25,type:"white",key:"k"}
];
let audio=null,sustain=false;const voices=new Map(),down=new Set();
const ensure=async()=>{audio ||= new (window.AudioContext||window.webkitAudioContext)();if(audio.state==="suspended")await audio.resume()};
const stop=(note,fast=false)=>{const v=voices.get(note);if(!v||sustain&&!fast)return;const n=audio.currentTime;v.g.gain.cancelScheduledValues(n);v.g.gain.setValueAtTime(Math.max(v.g.gain.value,.0001),n);v.g.gain.exponentialRampToValueAtTime(.0001,n+(fast?.03:.55));setTimeout(()=>{try{v.o.stop()}catch{}},fast?60:650);voices.delete(note);document.querySelector(`[data-note="${note}"]`)?.classList.remove("active")};
const play=async k=>{await ensure();stop(k.note,true);const o=audio.createOscillator(),g=audio.createGain();o.type="triangle";o.frequency.value=k.freq;g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.22,audio.currentTime+.025);g.gain.exponentialRampToValueAtTime(.1,audio.currentTime+.35);o.connect(g).connect(audio.destination);o.start();voices.set(k.note,{o,g});document.querySelector(`[data-note="${k.note}"]`)?.classList.add("active");$("nowPlaying").textContent=`Playing ${k.note}`};
$("pianoKeys").innerHTML=keys.map(k=>`<button class="piano-key ${k.type}" data-note="${k.note}" style="${k.type==="black"?`left:${k.left}%`:""}"><span>${k.key.toUpperCase()}</span></button>`).join("");
document.querySelectorAll(".piano-key").forEach(b=>{const k=keys.find(x=>x.note===b.dataset.note);b.onpointerdown=e=>{e.preventDefault();play(k)};b.onpointerup=()=>stop(k.note);b.onpointerleave=()=>stop(k.note)});
addEventListener("keydown",e=>{if(e.repeat||["INPUT","TEXTAREA"].includes(document.activeElement.tagName))return;const k=keys.find(x=>x.key===e.key.toLowerCase());if(k&&!down.has(k.key)){down.add(k.key);play(k)}});
addEventListener("keyup",e=>{const k=keys.find(x=>x.key===e.key.toLowerCase());if(k){down.delete(k.key);stop(k.note)}});
$("pianoSustain").onclick=e=>{sustain=!sustain;e.currentTarget.textContent=`Sustain: ${sustain?"On":"Off"}`;if(!sustain)[...voices.keys()].forEach(n=>stop(n))};
$("pianoDemo").onclick=async()=>{const melody=["C4","E4","G4","C5","G4","E4","D4","F4","A4","G4","E4","C4"];for(const note of melody){const k=keys.find(x=>x.note===note);await play(k);await new Promise(r=>setTimeout(r,280));stop(note)}$("nowPlaying").textContent="Sweetville Theme complete ♡";toast("Mochi loved your song! 🐶")};
document.querySelector("[data-mochi='piano']").onclick=()=>{toast("Mochi sits beside the piano and listens.");$("pianoDemo").click()};
})();
