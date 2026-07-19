(() => {
  "use strict";

  const VERSION = "6.1";
  const STORAGE_KEY = "jahntella_v61_profile";
  const LEGACY_STORAGE_KEY = "jahntella_v60_profile";
  const todayKey = new Date().toISOString().slice(0, 10);

  const zones = {
    donut: { icon:"🍩", title:"Donut District", kicker:"SPRINKLES START HERE", copy:"Where every great day begins with sprinkles, glossy pink boxes and a reason to smile.", reward:"Donut District Stamp", card:"Sprinkle Smile" },
    melody: { icon:"🎵", title:"Melody Studio", kicker:"WHERE HOOKS COME ALIVE", copy:"Step inside the studio where bright ideas become unforgettable choruses.", reward:"Melody Studio Stamp", card:"Studio Spark" },
    neon: { icon:"💋", title:"Neon Lounge", kicker:"THE SWEET AFTER DARK", copy:"The velvet rope is up, the pink lights are glowing and the remix is turned all the way up.", reward:"Neon Lounge Stamp", card:"Pink Lips After Dark" },
    cafe: { icon:"☕", title:"Pink Café", kicker:"SIP. TALK. DREAM.", copy:"Coffee, conversations, mood cards and big dreams live inside Jahntella's favorite little café.", reward:"Pink Café Stamp", card:"Café Dreamer" },
    lake: { icon:"✨", title:"Sparkle Lake", kicker:"MAKE A LITTLE WISH", copy:"Every sparkle hides a wish. Explore the shoreline for collectible surprises.", reward:"Sparkle Lake Stamp", card:"Wish Upon Sweetville" }
  };

  const cards = [
    ["🍭","World of Sweet"],["🍩","Sprinkle Smile"],["🎵","Studio Spark"],["💋","Pink Lips After Dark"],
    ["☕","Café Dreamer"],["✨","Wish Upon Sweetville"],["⭐","Star Catcher"],["🎁","Daily Sweet Drop"],
    ["👑","Sweetville Founder"],["🎤","First Spin"],["💌","Sweet List Insider"],["🌈","Secret Rare"]
  ];

  const achievements = [
    ["firstVisit","🍭","First Steps","Enter the World of Sweet"],
    ["founder","👑","Sweetville Founder","Visit during the v6 founding era"],
    ["explorer","🗺️","Sweet Explorer","Visit one Sweetville district"],
    ["tourist","🏙️","Sweetville Tourist","Visit all five districts"],
    ["firstSpin","🎵","First Spin","Play a Jahntella song"],
    ["remix","💋","Remix After Dark","Play Pink Lips Remix"],
    ["daily","🎁","Daily Sweet","Open a Daily Sweet Drop"],
    ["starCatch","⭐","Star Catcher","Win Star Catch"],
    ["collector","🎴","Sweet Collector","Collect six cards"],
    ["vaultMaster","🏆","Vault Master","Collect all twelve cards"],
    ["sweetList","💌","Sweet List Insider","Join The Sweet List"],
    ["secret","🌈","Secret Rare","Find the hidden secret"]
  ];

  const dailyQuotes = [
    "You were never meant to blend in — you were made to sparkle.",
    "A little sweetness can change the whole day.",
    "Confidence looks good on you.",
    "Big dreams begin with one brave little step.",
    "Stay soft. Stay strong. Stay sweet.",
    "Your energy is part of the magic.",
    "Make today worthy of a chorus."
  ];

  function blankProfile(){
    return {
      version: VERSION, visits:0, lastVisit:"", xp:0, coins:0, level:1,
      zones:[], cards:[0,8], achievements:["firstVisit","founder"],
      dailyClaims:[], songs:[], secrets:[], emailJoined:false,
      npcTalked:[], castleVisited:false, questClaims:[]
    };
  }

  function loadProfile(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      const saved = JSON.parse(raw);
      return saved && typeof saved === "object" ? Object.assign(blankProfile(), saved, {version:VERSION}) : blankProfile();
    }catch(_){ return blankProfile(); }
  }

  let profile = loadProfile();
  if(profile.lastVisit !== todayKey){
    profile.visits += 1;
    profile.lastVisit = todayKey;
  }

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); updateUI(); }
  function formatTime(sec){
    if(!Number.isFinite(sec)) return "0:00";
    return `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,"0")}`;
  }
  function toast(message){
    const el = $("#toast");
    el.textContent = message; el.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove("show"),3000);
  }
  function reward(xp=25, coins=5){
    profile.xp += xp; profile.coins += coins; profile.level = Math.floor(profile.xp/150)+1;
  }
  function unlockAchievement(id, announce=true){
    if(profile.achievements.includes(id)) return;
    profile.achievements.push(id); reward();
    const item = achievements.find(a=>a[0]===id);
    if(announce && item) toast(`${item[1]} Achievement unlocked: ${item[2]} · +25 XP · +5 Coins`);
  }
  function unlockCard(index, announce=true){
    if(profile.cards.includes(index)) return;
    profile.cards.push(index); reward(15,3);
    if(announce) toast(`🎴 New Vault card: ${cards[index][1]}`);
    if(profile.cards.length>=6) unlockAchievement("collector");
    if(profile.cards.length>=12) unlockAchievement("vaultMaster");
  }

  function updateUI(){
    $("#headerCoins").textContent = profile.coins;
    $("#heroLevel").textContent = profile.level;
    $("#heroStamps").textContent = profile.zones.length;
    $("#heroCards").textContent = profile.cards.length;
    $("#vaultCount").textContent = profile.cards.length;
    $("#vaultProgress").style.width = `${profile.cards.length/cards.length*100}%`;
    renderBinder();
    renderQuest();
  }

  function renderBinder(){
    const binder = $("#binder");
    binder.innerHTML = cards.map((card,i)=>`
      <div class="mini-card ${profile.cards.includes(i)?"":"locked"}">
        <span>${profile.cards.includes(i)?card[0]:"?"}</span>
        <small>${profile.cards.includes(i)?card[1]:"LOCKED"}</small>
      </div>`).join("");
  }

  function openModal(id){
    const modal = $(`#${id}Modal`);
    if(!modal) return;
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal){
    modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  function closeButton(){ return `<button class="modal-close" type="button" aria-label="Close">×</button>`; }

  function showZone(id){
    const z=zones[id]; if(!z) return;
    if(!profile.zones.includes(id)){
      profile.zones.push(id); reward(30,8);
      unlockAchievement("explorer",false);
      unlockCard(Object.keys(zones).indexOf(id)+1,false);
      if(profile.zones.length===5) unlockAchievement("tourist",false);
      save();
      toast(`${z.icon} ${z.reward} unlocked · +30 XP · +8 Coins`); renderQuest();
    }
    $(".zone-shell").innerHTML = `${closeButton()}
      <div class="zone-hero"><span>${z.icon}</span><div><p class="eyebrow">${z.kicker}</p><h2>${z.title}</h2><p>${z.copy}</p></div></div>
      <div class="zone-actions">
        ${id==="melody"?'<button class="button primary" type="button" data-play="fun-dipp">Play Fun Dipp ▶</button>':""}
        ${id==="neon"?'<button class="button primary" type="button" data-play="pink-lips">Play Pink Lips Remix ▶</button>':""}
        ${id==="lake"?'<button class="button primary" type="button" id="makeWish">Make a Sweet Wish ✨</button>':""}
        <button class="button glass" type="button" data-close>Return to Sweetville</button>
      </div>`;
    openModal("zone");
  }

  function renderPassport(){
    $(".passport-shell").innerHTML = `${closeButton()}
      <p class="eyebrow">OFFICIAL SWEETVILLE DOCUMENT</p><h2>Sweet <em>Passport.</em></h2>
      <div class="passport-card">
        <div class="passport-photo"><span>🍭</span><strong>SWEET EXPLORER</strong></div>
        <div class="passport-meta">
          <small>EXPLORER NAME</small><h3>Sweetie #${String(1000+profile.visits*17+profile.coins).padStart(4,"0")}</h3>
          <div class="passport-numbers">
            <div><strong>${profile.level}</strong><small>LEVEL</small></div>
            <div><strong>${profile.xp}</strong><small>XP</small></div>
            <div><strong>${profile.coins}</strong><small>COINS</small></div>
          </div>
          <p>Visits: <strong>${profile.visits}</strong> · Cards: <strong>${profile.cards.length}/12</strong> · Achievements: <strong>${profile.achievements.length}/12</strong></p>
        </div>
      </div>
      <h3>Sweetville Stamps</h3>
      <div class="stamp-grid">${Object.entries(zones).map(([id,z])=>`<div class="stamp ${profile.zones.includes(id)?"earned":""}"><span>${profile.zones.includes(id)?z.icon:"?"}</span><small>${z.title}</small></div>`).join("")}</div>`;
  }

  function renderAchievements(){
    $(".achievements-shell").innerHTML = `${closeButton()}
      <p class="eyebrow">JAHNTELLA REWARDS</p><h2>Sweet <em>Achievements.</em></h2>
      <p>${profile.achievements.length}/${achievements.length} unlocked. Each new badge awards XP and Sweet Coins.</p>
      <div class="achievement-grid">${achievements.map(a=>`<article class="achievement ${profile.achievements.includes(a[0])?"":"locked"}"><span>${profile.achievements.includes(a[0])?a[1]:"?"}</span><strong>${a[2]}</strong><small>${a[3]}</small></article>`).join("")}</div>`;
  }

  function renderVaultModal(){
    $(".vault-shell").innerHTML = `${closeButton()}
      <p class="eyebrow">COLLECTION BOOK</p><h2>The Sweet <em>Vault.</em></h2>
      <p>${profile.cards.length}/12 cards collected.</p>
      <div class="vault-book">${cards.map((c,i)=>`<article class="vault-card ${profile.cards.includes(i)?"":"locked"}"><span>${profile.cards.includes(i)?c[0]:"?"}</span><strong>${profile.cards.includes(i)?c[1]:"UNDISCOVERED"}</strong></article>`).join("")}</div>`;
  }

  const tracks = {
    "fun-dipp": {audio:$("#audioFunDipp"), title:"Fun Dipp", icon:"🍭"},
    "pink-lips": {audio:$("#audioPinkLips"), title:"Pink Lips Remix", icon:"💋"}
  };
  let currentTrack = "fun-dipp";

  function selectTrack(key){
    currentTrack=key; const t=tracks[key]; if(!t) return;
    Object.entries(tracks).forEach(([k,v])=>{if(k!==key){v.audio.pause();}});
    $("#playerTrack").textContent=t.title; $("#playerArt").textContent=t.icon;
    $("#musicPlayer").classList.add("visible");
    if(!profile.songs.includes(key)){
      profile.songs.push(key); unlockAchievement("firstSpin",false);
      if(key==="pink-lips") unlockAchievement("remix",false);
      unlockCard(key==="fun-dipp"?9:3,false); save();
    }
  }
  function toggleTrack(key=currentTrack){
    selectTrack(key); const audio=tracks[key].audio;
    if(audio.paused) audio.play().catch(()=>toast("Tap play once more if your browser blocked audio."));
    else audio.pause();
    renderQuest();
  }
  function syncPlayer(){
    const t=tracks[currentTrack], audio=t.audio, playing=!audio.paused;
    $("#musicPlayer").classList.toggle("playing",playing);
    $("#playerToggle").textContent=playing?"❚❚":"▶";
    $("#playerStatus").textContent=playing?"NOW PLAYING":"PAUSED";
    $("#playerCurrent").textContent=formatTime(audio.currentTime);
    $("#playerDuration").textContent=formatTime(audio.duration);
    $("#playerRange").value=audio.duration?(audio.currentTime/audio.duration)*100:0;
    $$("[data-release-card]").forEach(c=>c.classList.toggle("playing",playing && c.dataset.releaseCard===currentTrack));
  }

  function claimDaily(){
    $("#dailyQuote").textContent = dailyQuotes[new Date().getDay()];
    if(profile.dailyClaims.includes(todayKey)){
      $("#dailyRewardText").textContent="Today's reward has already been collected. Come back tomorrow!";
      $("#claimDaily").textContent="Already Collected ✓"; $("#claimDaily").disabled=true; return;
    }
    profile.dailyClaims.push(todayKey); reward(40,10); unlockAchievement("daily",false); unlockCard(7,false); save();
    $("#dailyRewardText").textContent="You received 40 XP, 10 Sweet Coins and a Daily Sweet Drop card!";
    $("#claimDaily").textContent="Reward Collected ✓"; $("#claimDaily").disabled=true;
    toast("🎁 Daily Sweet Drop opened · +40 XP · +10 Coins"); renderQuest();
  }

  let gameTimer=null, gameScore=0, gameSeconds=20;
  function renderGame(){
    $(".game-shell").innerHTML = `${closeButton()}<p class="eyebrow">SWEET ARCADE</p><h2>Star <em>Catch.</em></h2>
      <div class="game-hud"><span>Stars: <b id="gameScore">0</b>/10</span><span>Time: <b id="gameTime">20</b>s</span></div>
      <div class="game-board" id="gameBoard"></div>
      <button class="button primary" id="startGame" type="button">Start Game ✨</button>`;
    openModal("game");
  }
  function spawnStar(){
    const board=$("#gameBoard"); if(!board) return;
    const star=document.createElement("button"); star.className="falling-star"; star.type="button"; star.textContent="⭐";
    star.style.left=`${Math.random()*88+2}%`; star.style.animationDuration=`${2.2+Math.random()*1.8}s`;
    star.addEventListener("click",()=>{gameScore++; $("#gameScore").textContent=gameScore; star.remove(); if(gameScore>=10) finishGame(true);});
    board.appendChild(star); setTimeout(()=>star.remove(),4200);
  }
  function startGame(){
    gameScore=0; gameSeconds=20; $("#gameScore").textContent=0; $("#gameTime").textContent=20; $("#gameBoard").innerHTML="";
    $("#startGame").disabled=true; spawnStar();
    gameTimer=setInterval(()=>{gameSeconds--; $("#gameTime").textContent=gameSeconds; if(gameSeconds%2===0) spawnStar(); spawnStar(); if(gameSeconds<=0) finishGame(gameScore>=10);},1000);
  }
  function finishGame(won){
    clearInterval(gameTimer); gameTimer=null; $("#startGame").disabled=false; $("#startGame").textContent="Play Again ✨";
    if(won){
      unlockAchievement("starCatch",false); unlockCard(6,false); reward(30,8); save();
      toast("⭐ Star Catch complete · reward unlocked!");
    }else toast(`You caught ${gameScore} stars. Try again for 10!`);
  }


  const citizens = {
    baker:{icon:"👩‍🍳",name:"Mimi Sprinkle",role:"DONUT DISTRICT BAKER",line:"Fresh from the oven! The secret ingredient is always one extra sprinkle.",hint:"Hint: visit every district to earn the Sweetville Tourist achievement."},
    producer:{icon:"🎧",name:"Beatzy",role:"MELODY STUDIO PRODUCER",line:"A great chorus should feel familiar the very first time you hear it.",hint:"Hint: play both songs to complete one of today's possible quests."},
    host:{icon:"🪩",name:"Velvet",role:"NEON LOUNGE HOST",line:"The lights come alive after sunset. Pink Lips sounds especially sweet at night.",hint:"Hint: Sweetville changes with your local time."},
    barista:{icon:"🧁",name:"Cupcake Claire",role:"PINK CAFÉ BARISTA",line:"Big dreams deserve a sweet little break. Take your time and enjoy the world.",hint:"Hint: today's Daily Drop can help finish your quest."},
    fairy:{icon:"🧚",name:"Twinkle",role:"SPARKLE LAKE WISH FAIRY",line:"Every visitor adds another little light to Sweetville.",hint:"Hint: type SWEET anywhere to discover a secret."}
  };

  function getDayPhase(){
    const hour = new Date().getHours();
    if(hour >= 5 && hour < 11) return {id:"morning",icon:"🌅",label:"Sweetville Morning"};
    if(hour >= 11 && hour < 17) return {id:"day",icon:"☀️",label:"Sweetville Day"};
    if(hour >= 17 && hour < 20) return {id:"sunset",icon:"🌇",label:"Sweetville Sunset"};
    return {id:"night",icon:"🌙",label:"Sweetville After Dark"};
  }

  function applyDayPhase(){
    const map=$("#worldMap"); if(!map) return;
    const phase=getDayPhase();
    map.classList.remove("time-morning","time-day","time-sunset","time-night");
    map.classList.add(`time-${phase.id}`);
    $("#timeIcon").textContent=phase.icon; $("#timeLabel").textContent=phase.label;
    document.documentElement.dataset.sweetvilleTime=phase.id;
  }

  function showCastle(){
    if(!profile.castleVisited){
      profile.castleVisited=true; reward(35,10); save();
      toast("🏰 Sweetville Castle opened · +35 XP · +10 Coins");
    }
    $(".castle-shell").innerHTML = `${closeButton()}
      <p class="eyebrow">THE HEART OF THE WORLD</p><h2>Sweetville <em>Castle.</em></h2>
      <p>The castle doors are officially open. Explore the first three rooms and watch for new wings in future builds.</p>
      <div class="castle-rooms">
        <article class="castle-room"><span>🎵</span><h3>Hall of Music</h3><p>Celebrate Jahntella's releases and hear both songs.</p><button class="button primary" type="button" data-play="fun-dipp">Play Music</button></article>
        <article class="castle-room"><span>🏆</span><h3>Trophy Room</h3><p>See every badge earned across the World of Sweet.</p><button class="button glass" type="button" data-castle-open="achievements">View Achievements</button></article>
        <article class="castle-room"><span>🎴</span><h3>Royal Gallery</h3><p>Browse the collectible cards stored in your Sweet Vault.</p><button class="button glass" type="button" data-castle-open="vault">Open Vault</button></article>
      </div>`;
    openModal("castle");
  }

  function showCitizen(id){
    const c=citizens[id]; if(!c) return;
    const first=!profile.npcTalked.includes(id);
    if(first){profile.npcTalked.push(id);reward(12,3);save();}
    $(".npc-shell").innerHTML = `${closeButton()}
      <div class="npc-dialogue">
        <div class="npc-portrait">${c.icon}</div>
        <div><p class="eyebrow">${c.role}</p><h2>${c.name}</h2>
          <div class="speech-bubble"><blockquote>“${c.line}”</blockquote><p>${c.hint}</p>
          <div class="npc-reward">${first?"First conversation reward: +12 XP · +3 Coins":"You've already collected this citizen's conversation reward."}</div></div>
        </div>
      </div>`;
    openModal("npc");
    if(first) toast(`${c.icon} New Sweetville friend · +12 XP · +3 Coins`);
  }

  function questDefinition(){
    const day=new Date().getDay();
    const zoneIds=Object.keys(zones);
    const targetZone=zoneIds[day%zoneIds.length];
    const song=day%2===0?"fun-dipp":"pink-lips";
    const tasks=[
      {id:"zone",icon:zones[targetZone].icon,title:`Visit ${zones[targetZone].title}`,done:()=>profile.zones.includes(targetZone)},
      {id:"song",icon:song==="fun-dipp"?"🍭":"💋",title:`Play ${song==="fun-dipp"?"Fun Dipp":"Pink Lips Remix"}`,done:()=>profile.songs.includes(song)},
      day%3===0
        ? {id:"npc",icon:"👋",title:"Talk to a Sweetville citizen",done:()=>profile.npcTalked.length>0}
        : {id:"daily",icon:"🎁",title:"Open today's Daily Sweet Drop",done:()=>profile.dailyClaims.includes(todayKey)}
    ];
    return {tasks,targetZone,song};
  }

  function renderQuest(){
    const list=$("#questList"); if(!list) return;
    const q=questDefinition();
    const completed=q.tasks.filter(t=>t.done()).length;
    const claimed=profile.questClaims.includes(todayKey);
    $("#questDay").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"}).toUpperCase();
    list.innerHTML=q.tasks.map(t=>`<div class="quest-item ${t.done()?"done":""}">
      <div class="quest-check">${t.done()?"✓":t.icon}</div><div><strong>${t.title}</strong><small>${t.done()?"Completed":"Adventure waiting"}</small></div>
      <div class="quest-state">${t.done()?"DONE":"OPEN"}</div></div>`).join("");
    $("#questProgress").style.width=`${completed/3*100}%`;
    $("#questStatus").textContent=`${completed} of 3 complete`;
    const btn=$("#claimQuest");
    if(claimed){btn.disabled=true;btn.textContent="Quest Reward Claimed ✓";}
    else if(completed===3){btn.disabled=false;btn.textContent="Claim 75 XP + 20 Coins 🎁";}
    else{btn.disabled=true;btn.textContent="Complete Quest First";}
  }

  function claimQuest(){
    const q=questDefinition();
    if(profile.questClaims.includes(todayKey) || !q.tasks.every(t=>t.done())) return;
    profile.questClaims.push(todayKey); reward(75,20); save();
    toast("🎁 Daily Sweet Quest complete · +75 XP · +20 Coins");
  }


  function initEvents(){
    $("#menuToggle").addEventListener("click",()=>{const n=$("#siteNav");n.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",n.classList.contains("open"));});
    $$("#siteNav a").forEach(a=>a.addEventListener("click",()=>$("#siteNav").classList.remove("open")));
    $$("[data-zone]").forEach(b=>b.addEventListener("click",()=>showZone(b.dataset.zone)));
    $$("[data-play]").forEach(b=>b.addEventListener("click",()=>toggleTrack(b.dataset.play)));
    $$("[data-open]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.dataset.open;
      if(id==="passport"){renderPassport();openModal("passport");}
      if(id==="achievements"){renderAchievements();openModal("achievements");}
      if(id==="vault"){renderVaultModal();openModal("vault");}
      if(id==="game")renderGame();
      if(id==="castle")showCastle();
    }));
    $$("[data-npc]").forEach(b=>b.addEventListener("click",()=>showCitizen(b.dataset.npc)));
    $$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m || e.target.closest("[data-close],.modal-close")) closeModal(m);}));
    document.addEventListener("click",e=>{
      if(e.target.id==="makeWish"){unlockCard(5);toast("✨ Your wish reached Sparkle Lake.");}
      if(e.target.id==="startGame")startGame();
      if(e.target.id==="claimQuest")claimQuest();
      const castleTarget=e.target.closest("[data-castle-open]");
      if(castleTarget){
        closeModal($("#castleModal"));
        if(castleTarget.dataset.castleOpen==="achievements"){renderAchievements();openModal("achievements");}
        if(castleTarget.dataset.castleOpen==="vault"){renderVaultModal();openModal("vault");}
      }
    });
    $("#claimDaily").addEventListener("click",claimDaily);
    $("#sweetListForm").addEventListener("submit",e=>{
      e.preventDefault(); profile.emailJoined=true; unlockAchievement("sweetList",false); unlockCard(10,false); reward(20,5); save();
      toast("💌 Welcome to The Sweet List! Preview signup saved on this device."); e.target.reset();
    });
    $$("[data-secret]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.dataset.secret;
      if(!profile.secrets.includes(id)){profile.secrets.push(id);reward(10,2);save();toast("✨ You found a hidden Sweetville secret!");}
    }));
    let typed="";
    document.addEventListener("keydown",e=>{
      if(e.key.length===1){typed=(typed+e.key.toLowerCase()).slice(-5);if(typed==="sweet"){unlockAchievement("secret",false);unlockCard(11,false);save();toast("🌈 Secret Rare unlocked!");}}
      if(e.key==="Escape")$$(".modal.open").forEach(closeModal);
    });
    $("#playerToggle").addEventListener("click",()=>toggleTrack());
    $("#playerPrev").addEventListener("click",()=>toggleTrack(currentTrack==="fun-dipp"?"pink-lips":"fun-dipp"));
    $("#playerNext").addEventListener("click",()=>toggleTrack(currentTrack==="fun-dipp"?"pink-lips":"fun-dipp"));
    $("#playerClose").addEventListener("click",()=>$("#musicPlayer").classList.remove("visible"));
    $("#playerRange").addEventListener("input",e=>{const a=tracks[currentTrack].audio;if(a.duration)a.currentTime=(e.target.value/100)*a.duration;});
    Object.values(tracks).forEach(t=>["play","pause","timeupdate","loadedmetadata","ended"].forEach(ev=>t.audio.addEventListener(ev,syncPlayer)));
  }

  function initSparkles(){
    const c=$("#sparkles"),ctx=c.getContext("2d");let dots=[];
    function resize(){c.width=innerWidth;c.height=innerHeight;dots=Array.from({length:Math.min(90,Math.floor(innerWidth/16))},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.8+.3,s:Math.random()*.35+.08}));}
    function draw(){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="rgba(255,198,229,.72)";dots.forEach(d=>{d.y-=d.s;if(d.y<0)d.y=c.height;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();});requestAnimationFrame(draw);}
    resize();addEventListener("resize",resize);draw();
  }

  function init(){
    save();
    $("#dailyQuote").textContent=dailyQuotes[new Date().getDay()];
    if(profile.dailyClaims.includes(todayKey)){ $("#dailyRewardText").textContent="Today's reward has already been collected. Come back tomorrow!"; $("#claimDaily").textContent="Already Collected ✓"; $("#claimDaily").disabled=true; }
    applyDayPhase(); setInterval(applyDayPhase,60000);
    initEvents(); initSparkles(); syncPlayer(); renderQuest();
    setTimeout(()=>$("#loadingScreen").classList.add("hidden"),1400);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();