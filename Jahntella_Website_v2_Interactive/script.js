
const cfg = window.JAHNTELLA_CONFIG || {social:{},music:{}};
const socialNames = {instagram:"Instagram",tiktok:"TikTok",youtube:"YouTube",spotify:"Spotify",email:"Email"};
const musicNames = {spotify:"Spotify",apple:"Apple Music",youtube:"YouTube Music",amazon:"Amazon Music",soundcloud:"SoundCloud"};

function renderLinks(){
  document.querySelectorAll("[data-social-links]").forEach(el=>{
    el.innerHTML = Object.entries(cfg.social).map(([k,v])=>`<a href="${v}" target="_blank" rel="noopener">${socialNames[k]||k}</a>`).join("");
  });
  document.querySelectorAll("[data-social-cards]").forEach(el=>{
    el.innerHTML = Object.entries(cfg.social).map(([k,v])=>`<a class="social-card" href="${v}" target="_blank" rel="noopener"><small>FOLLOW</small><strong>${socialNames[k]||k}</strong><span>Open channel →</span></a>`).join("");
  });
  document.querySelectorAll("[data-music-links]").forEach(el=>{
    el.innerHTML = Object.entries(cfg.music).map(([k,v])=>`<a href="${v}" target="_blank" rel="noopener">${musicNames[k]||k} ↗</a>`).join("");
  });
}
renderLinks();

document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
menuBtn.addEventListener("click",()=>{nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",nav.classList.contains("open"))});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const observer = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.addEventListener("mousemove",e=>{const glow=document.querySelector(".cursor-glow");glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});

const sparkleWrap=document.querySelector(".sparkles");
for(let i=0;i<26;i++){const s=document.createElement("span");s.className="spark";s.style.left=Math.random()*100+"vw";s.style.animationDuration=(7+Math.random()*12)+"s";s.style.animationDelay=(-Math.random()*15)+"s";s.style.opacity=.25+Math.random()*.7;sparkleWrap.appendChild(s)}

const modal=document.getElementById("platformModal");
document.querySelectorAll(".platform-open").forEach(btn=>btn.addEventListener("click",()=>{document.getElementById("modalTrack").textContent=btn.dataset.track;modal.showModal()}));
document.querySelector(".modal-close").addEventListener("click",()=>modal.close());
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});

document.getElementById("sweetForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("email").value.trim();
  document.getElementById("formMessage").textContent=`Welcome to The Sweet List, ${email} ✨`;
  e.target.reset();
});

let cart=[];
const cartEl=document.getElementById("cart");
function paintCart(){
  document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><span>${x.name}</span><span>$${x.price} <button onclick="removeItem(${i})">×</button></span></div>`).join(""):"<p>Your bag is waiting for something sweet.</p>";
  document.getElementById("cartTotal").textContent="$"+cart.reduce((s,x)=>s+x.price,0);
  document.getElementById("cartCount").textContent=cart.length;
}
window.removeItem=i=>{cart.splice(i,1);paintCart()};
document.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{
  const p=btn.closest(".product");cart.push({name:p.dataset.name,price:Number(p.dataset.price)});paintCart();cartEl.classList.add("open")
}));
document.getElementById("cartFab").addEventListener("click",()=>cartEl.classList.add("open"));
document.querySelector(".cart-close").addEventListener("click",()=>cartEl.classList.remove("open"));
document.querySelector(".checkout").addEventListener("click",()=>alert("Checkout preview is working. Connect this button to Shopify, Fourthwall or Stripe when products are live."));

let audioCtx, osc, gain, playing=false;
document.getElementById("soundToggle").addEventListener("click",async e=>{
  if(!playing){
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    osc=audioCtx.createOscillator();gain=audioCtx.createGain();osc.type="sine";osc.frequency.value=440;gain.gain.value=.015;osc.connect(gain);gain.connect(audioCtx.destination);osc.start();playing=true;e.target.textContent="♫ Ambient sparkle: on";e.target.setAttribute("aria-pressed","true");
  }else{osc.stop();audioCtx.close();playing=false;e.target.textContent="♫ Ambient sparkle: off";e.target.setAttribute("aria-pressed","false")}
});
