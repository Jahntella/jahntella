(() => {
  "use strict";

  const VERSION = "6.3";
  const STORAGE_KEY = "jahntella_v63_profile";
  const LEGACY_STORAGE_KEY = "jahntella_v621_profile";
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


  const cardMeta = [
    {rarity:"common",source:"Founding collection"},{rarity:"common",source:"Donut District"},
    {rarity:"rare",source:"Melody Studio"},{rarity:"ultra",source:"Neon Lounge"},
    {rarity:"common",source:"Pink Café"},{rarity:"rare",source:"Sparkle Lake"},
    {rarity:"ultra",source:"Star Catch"},{rarity:"rare",source:"Daily Sweet Drop"},
    {rarity:"ultra",source:"Founding era"},{rarity:"common",source:"Play a song"},
    {rarity:"secret",source:"Join the Sweet List"},{rarity:"rainbow",source:"Hidden secret"}
  ];
  const rarityNames={common:"Common",rare:"Rare",ultra:"Ultra Rare",secret:"Secret Rare",rainbow:"Rainbow Rare"};
  const rarityWeights={common:50,rare:28,ultra:14,secret:6,rainbow:2};

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
      npcTalked:[], castleVisited:false, questClaims:[],
      packs:1, cardCopies:{"0":1,"8":1}, packHistory:[], loginDates:[], streak:0,
      highScore:0, bestCombo:0, starPackAwards:[],
      sweetieName:"Sweetie", avatar:"🍭", favoriteSong:"fun-dipp", favoriteDistrict:"donut",
      donutHighScore:0, melodyHighRound:0, gamesPlayed:[], weatherSeen:[], chapterRewards:[]
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
  profile.cardCopies = profile.cardCopies || {};
  profile.cards.forEach(i=>{if(!profile.cardCopies[i]) profile.cardCopies[i]=1;});
  profile.loginDates = profile.loginDates || [];
  if(!profile.loginDates.includes(todayKey)){
    const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yKey=yesterday.toISOString().slice(0,10);
    profile.streak=profile.loginDates.includes(yKey)?Math.min((profile.streak||0)+1,7):1;
    profile.loginDates.push(todayKey);
    if(profile.streak===7){profile.packs=(profile.packs||0)+1;}
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
    if(profile.cards.includes(index)) return false;
    profile.cards.push(index); profile.cardCopies[index]=(profile.cardCopies[index]||0)+1; reward(15,3);
    if(announce) toast(`🎴 New Vault card: ${cards[index][1]}`);
    if(profile.cards.length>=6) unlockAchievement("collector");
    if(profile.cards.length>=12) unlockAchievement("vaultMaster");
    return true;
  }
  function addCardCopy(index){
    const isNew=!profile.cards.includes(index);
    if(isNew){profile.cards.push(index);reward(15,3);}
    profile.cardCopies[index]=(profile.cardCopies[index]||0)+1;
    if(profile.cards.length>=6) unlockAchievement("collector",false);
    if(profile.cards.length>=12) unlockAchievement("vaultMaster",false);
    return isNew;
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
    renderLoginStreak();
    const pc=$("#packCountButton"); if(pc) pc.textContent=`(${profile.packs||0})`;
    const classic=$("#classicPackCount"); if(classic) classic.textContent=`${profile.packs||0} pack${(profile.packs||0)===1?"":"s"} ready`;
    const fp=$("#floatingPackCount"); if(fp) fp.textContent=`${profile.packs||0} ready`;
    const fv=$("#floatingVaultCount"); if(fv) fv.textContent=`${profile.cards.length}/12`;
    renderStoryProgress();
  }

  function renderBinder(){
    const binder = $("#binder");
    binder.innerHTML = cards.map((card,i)=>`
      <div class="mini-card ${profile.cards.includes(i)?"":"locked"} rarity-border-${cardMeta[i].rarity}">
        <span>${profile.cards.includes(i)?card[0]:"?"}</span>
        <small>${profile.cards.includes(i)?card[1]:"LOCKED"}</small>
        ${profile.cards.includes(i)?`<em class="mini-rarity">${rarityNames[cardMeta[i].rarity]}</em>`:""}
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

  let vaultFilter="all";
  function renderVaultModal(){
    const filtered=cards.map((c,i)=>({c,i})).filter(x=>vaultFilter==="all"||cardMeta[x.i].rarity===vaultFilter);
    const totalCopies=Object.values(profile.cardCopies).reduce((a,b)=>a+Number(b||0),0);
    const duplicates=Math.max(0,totalCopies-profile.cards.length);
    const rarityRank={common:1,rare:2,ultra:3,secret:4,rainbow:5};
    const highest=profile.cards.length
      ? profile.cards.map(i=>cardMeta[i].rarity).sort((a,b)=>rarityRank[b]-rarityRank[a])[0]
      : null;
    const recent=(profile.packHistory||[]).slice(-3).reverse().flatMap(h=>h.pulls||[]).slice(0,6);
    $(".vault-shell").innerHTML = `${closeButton()}
      <p class="eyebrow">ALWAYS HERE. ALWAYS YOURS.</p><h2>My Sweet <em>Vault.</em></h2>
      <p>Your Jahntella First Edition collection is saved privately on this device.</p>
      <div class="vault-dashboard">
        <div><small>CARDS COLLECTED</small><strong>${profile.cards.length}/12</strong></div>
        <div><small>PACKS OPENED</small><strong>${(profile.packHistory||[]).length}</strong></div>
        <div><small>HIGHEST PULL</small><strong>${highest?rarityNames[highest]:"—"}</strong></div>
        <div><small>DUPLICATES</small><strong>${duplicates}</strong></div>
      </div>
      ${recent.length?`<h3>Recently Collected</h3><div class="vault-recent-strip">${recent.map(i=>`<div class="recent-vault-card"><span>${cards[i][0]}</span><strong>${cards[i][1]}</strong><small class="rarity-${cardMeta[i].rarity}">${rarityNames[cardMeta[i].rarity]}</small></div>`).join("")}</div>`:""}
      <div class="vault-controls">${["all","common","rare","ultra","secret","rainbow"].map(r=>`<button class="vault-filter ${vaultFilter===r?"active":""}" data-vault-filter="${r}">${r==="all"?"All Cards":rarityNames[r]}</button>`).join("")}</div>
      <div class="vault-book">${filtered.map(({c,i})=>`<article class="vault-card ${profile.cards.includes(i)?"":"locked"} rarity-border-${cardMeta[i].rarity}">
        ${profile.cards.includes(i)?`<span class="copy-count">×${profile.cardCopies[i]||1}</span>`:""}
        <span>${profile.cards.includes(i)?c[0]:"?"}</span>
        <strong>${profile.cards.includes(i)?c[1]:"UNDISCOVERED"}</strong>
        <small class="card-rarity rarity-${cardMeta[i].rarity}">${profile.cards.includes(i)?rarityNames[cardMeta[i].rarity]:"LOCKED"}</small>
        ${profile.cards.includes(i)?`<small>${cardMeta[i].source}</small>`:""}
      </article>`).join("")}</div>`;
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


  function renderLoginStreak(){
    const el=$("#loginStreak"); if(!el) return;
    const streak=Math.max(1,profile.streak||1);
    el.innerHTML=Array.from({length:7},(_,i)=>{
      const day=i+1, claimed=day<=streak, active=day===streak;
      return `<div class="streak-day ${claimed?"claimed":""} ${active?"active":""}"><span>${day===7?"🎁":claimed?"✓":"🍬"}</span><strong>DAY ${day}</strong><small>${day===7?"BONUS PACK":day*3+" COINS"}</small></div>`;
    }).join("");
  }

  function weightedCard(minRare=false){
    const pool=cards.map((_,i)=>i).filter(i=>!minRare||["rare","ultra","secret","rainbow"].includes(cardMeta[i].rarity));
    const total=pool.reduce((sum,i)=>sum+rarityWeights[cardMeta[i].rarity],0);
    let roll=Math.random()*total;
    for(const i of pool){roll-=rarityWeights[cardMeta[i].rarity];if(roll<=0)return i;}
    return pool[pool.length-1];
  }

  function renderPackModal(){
    const count=profile.packs||0;
    $(".pack-shell").innerHTML=`${closeButton()}<div class="pack-opening">
      <div class="pack-stage" id="packStage">
        <p class="eyebrow">WORLD OF SWEET — FIRST EDITION</p><h2>Sweet <em>Pack.</em></h2>
        ${count>0?`<button class="sweet-pack-display opening-pack" id="openPackButton" type="button"><span>J</span><b>SWEET PACK</b><small>TAP TO SHAKE & OPEN</small><i>✦</i></button><p>You have <strong>${count}</strong> pack${count===1?"":"s"}.</p>`:`<div class="sweet-pack-display opening-pack sold-out"><span>J</span><b>NO PACKS</b><small>VISIT THE PACK SHOP</small><i>✦</i></div><button class="button primary" data-open-shop-inline type="button">Buy a Pack · 35 Coins</button>`}
      </div></div>`;
    openModal("pack");
  }

  function openSweetPack(){
    if((profile.packs||0)<1)return;
    const stage=$("#packStage"); stage.classList.add("shaking");
    $("#openPackButton").disabled=true;
    setTimeout(()=>{
      profile.packs--;
      const pulls=[weightedCard(false),weightedCard(false),weightedCard(true)];
      const results=pulls.map(i=>({i,isNew:addCardCopy(i)}));
      profile.packHistory.push({date:todayKey,pulls});
      save();
      stage.classList.remove("shaking");stage.classList.add("opened");
      stage.innerHTML=`<p class="eyebrow">TAP EACH CARD TO REVEAL</p><h2>Your Sweet <em>Pulls.</em></h2>
        <div class="reveal-row">${results.map(({i,isNew})=>`<button class="reveal-card" data-reveal-card type="button"><span class="card-inner">
          <span class="card-face card-back">🍭</span><span class="card-face card-front ${cardMeta[i].rarity}">
            ${!isNew?'<b class="duplicate-badge">DUPLICATE</b>':""}<span class="card-icon">${cards[i][0]}</span><strong>${cards[i][1]}</strong><small class="rarity-${cardMeta[i].rarity}">${rarityNames[cardMeta[i].rarity]}</small>
          </span></span></button>`).join("")}</div>
        <p class="pack-result">New cards join your Vault. Duplicates increase your copy count.</p>
        <button class="button glass" data-open-another-pack type="button">${profile.packs>0?`Open Another Pack (${profile.packs})`:"Return to Sweetville"}</button>`;
    },1100);
  }

  function renderPackShop(){
    $(".packshop-shell").innerHTML=`${closeButton()}<p class="eyebrow">SWEET COIN SHOP</p><h2>Pack <em>Shop.</em></h2>
      <div class="shop-balance">Your balance: 🍬 ${profile.coins} Sweet Coins</div>
      <div class="pack-shop-card"><div class="sweet-pack-display pack-shop-mini"><span>J</span><b>SWEET PACK</b><small>3 CARDS</small><i>✦</i></div>
      <div><h3>World of Sweet Pack</h3><p>Three collectible cards with one guaranteed Rare or better.</p><button class="button primary" id="buyPack" type="button" ${profile.coins<35?"disabled":""}>Buy for 35 Coins</button></div></div>`;
    openModal("packshop");
  }

  function buyPack(){
    if(profile.coins<35){toast("You need 35 Sweet Coins.");return;}
    profile.coins-=35;profile.packs=(profile.packs||0)+1;save();renderPackShop();toast("🎁 Sweet Pack added to your collection!");
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

  let gameTimer=null, gameScore=0, gameSeconds=25, gameCombo=0, gameMultiplier=1, gameMisses=0;
  function renderGame(){
    $(".game-shell").innerHTML = `${closeButton()}<p class="eyebrow">SWEET ARCADE</p><h2>Star Catch <em>2.0.</em></h2>
      <div class="game-hud"><span>Score: <b id="gameScore">0</b></span><span class="combo">Combo: <b id="gameCombo">0</b> · ×<b id="gameMultiplier">1</b></span><span>Time: <b id="gameTime">25</b>s</span></div>
      <div class="game-summary">⭐ +1 · 🌟 Golden +5 · 💣 breaks your combo. Beat your high score of <strong>${profile.highScore||0}</strong> to earn a Sweet Pack.</div>
      <div class="game-board" id="gameBoard"></div>
      <button class="button primary" id="startGame" type="button">Start Star Catch 2.0 ✨</button>`;
    openModal("game");
  }
  function updateGameHUD(){
    $("#gameScore").textContent=gameScore;$("#gameCombo").textContent=gameCombo;$("#gameMultiplier").textContent=gameMultiplier;$("#gameTime").textContent=gameSeconds;
  }
  function spawnStar(){
    const board=$("#gameBoard"); if(!board) return;
    const roll=Math.random();
    const type=roll<.12?"bomb":roll<.28?"golden":"normal";
    const star=document.createElement("button"); star.className=`falling-star ${type}`; star.type="button"; star.textContent=type==="bomb"?"💣":type==="golden"?"🌟":"⭐";
    star.style.left=`${Math.random()*88+2}%`; star.style.animationDuration=`${1.7+Math.random()*1.4}s`;
    star.addEventListener("click",()=>{
      if(type==="bomb"){gameCombo=0;gameMultiplier=1;gameMisses++;gameScore=Math.max(0,gameScore-3);}
      else{gameCombo++;gameMultiplier=Math.min(5,1+Math.floor(gameCombo/5));gameScore+=(type==="golden"?5:1)*gameMultiplier;profile.bestCombo=Math.max(profile.bestCombo||0,gameCombo);}
      updateGameHUD();star.remove();
    });
    board.appendChild(star); setTimeout(()=>star.remove(),3300);
  }
  function startGame(){
    gameScore=0;gameSeconds=25;gameCombo=0;gameMultiplier=1;gameMisses=0;updateGameHUD();$("#gameBoard").innerHTML="";
    $("#startGame").disabled=true;spawnStar();
    gameTimer=setInterval(()=>{gameSeconds--;updateGameHUD();spawnStar();if(gameSeconds%2===0)spawnStar();if(gameSeconds<=0)finishGame();},1000);
  }
  function finishGame(){
    clearInterval(gameTimer);gameTimer=null;$("#startGame").disabled=false;$("#startGame").textContent="Play Again ✨";
    const previous=profile.highScore||0;const newBest=gameScore>previous;profile.highScore=Math.max(previous,gameScore);
    unlockAchievement("starCatch",false);unlockCard(6,false);reward(20,5);if(!profile.gamesPlayed.includes("starcatch"))profile.gamesPlayed.push("starcatch");
    if(newBest && !profile.starPackAwards.includes(gameScore)){profile.packs=(profile.packs||0)+1;profile.starPackAwards.push(gameScore);}
    save();
    $(".game-summary").innerHTML=`Final score: <strong>${gameScore}</strong> · Best combo: <strong>${profile.bestCombo||0}</strong>${newBest?" · NEW HIGH SCORE + 1 SWEET PACK!":""}`;
    toast(newBest?"🌟 New high score! Sweet Pack earned.":"⭐ Star Catch complete!");
  }


  const weatherTypes = [
    {id:"petals",icon:"🌸",label:"Petal Breeze",pieces:["🌸","·","✦"]},
    {id:"rainbow",icon:"🌈",label:"Rainbow Glow",pieces:["✦","♡","·"]},
    {id:"sparkles",icon:"✨",label:"Sparkle Shower",pieces:["✦","✧","★"]},
    {id:"sunny",icon:"☀️",label:"Sugar-Sunshine",pieces:["·","✦","·"]},
    {id:"rain",icon:"🌧️",label:"Candy Rain",pieces:["•","│","•"]}
  ];

  function dailyWeather(){
    const seed=[...todayKey].reduce((a,c)=>a+c.charCodeAt(0),0);
    return weatherTypes[seed%weatherTypes.length];
  }

  function applyWeather(){
    const w=dailyWeather(), layer=$("#weatherLayer"), map=$("#worldMap");
    if(!layer||!map)return;
    weatherTypes.forEach(x=>map.classList.remove(`weather-${x.id}`));
    map.classList.add(`weather-${w.id}`);
    $("#weatherIcon").textContent=w.icon; $("#weatherLabel").textContent=w.label;
    layer.innerHTML=Array.from({length:w.id==="sunny"?12:28},(_,i)=>{
      const piece=w.pieces[i%w.pieces.length];
      return `<i style="--x:${(i*37)%97}%;--delay:${-(i%9)*.7}s;--dur:${5+(i%6)}s">${piece}</i>`;
    }).join("");
    if(!profile.weatherSeen.includes(w.id)){profile.weatherSeen.push(w.id);localStorage.setItem(STORAGE_KEY,JSON.stringify(profile));}
  }

  const storyChapters = [
    {icon:"🍭",title:"The Gates Open",copy:"Enter Sweetville and begin your World of Sweet adventure.",done:()=>profile.visits>0},
    {icon:"🗺️",title:"Meet the Districts",copy:"Explore three Sweetville districts and collect their stamps.",done:()=>profile.zones.length>=3},
    {icon:"👋",title:"Friends of Sweetville",copy:"Meet three colorful citizens around the map.",done:()=>profile.npcTalked.length>=3},
    {icon:"🏰",title:"The Castle Awakens",copy:"Open Sweetville Castle and discover its royal rooms.",done:()=>profile.castleVisited},
    {icon:"🎮",title:"The Sweet Arcade",copy:"Play all three games and prove your arcade spirit.",done:()=>["starcatch","donutdash","melodymemory"].every(g=>profile.gamesPlayed.includes(g))},
    {icon:"🌈",title:"Rainbow Festival",copy:"Collect ten cards to light the road toward the Rainbow Festival.",done:()=>profile.cards.length>=10}
  ];

  function renderStoryProgress(){
    const track=$("#chapterTrack"); if(!track)return;
    let current=storyChapters.findIndex(c=>!c.done());
    if(current<0)current=storyChapters.length-1;
    track.innerHTML=storyChapters.map((c,i)=>`<div class="chapter-node ${c.done()?"complete":i===current?"current":"locked"}">
      <span>${c.done()?"✓":c.icon}</span><small>CHAPTER ${i+1}</small><strong>${c.title}</strong>
    </div>`).join("");
    const c=storyChapters[current];
    $("#chapterIcon").textContent=c.icon;$("#chapterLabel").textContent=`CHAPTER ${current+1}`;
    $("#chapterTitle").textContent=c.title;$("#chapterCopy").textContent=c.copy;
  }

  function collectionRank(){
    const n=profile.cards.length;
    if(n>=12)return "Rainbow";
    if(n>=10)return "Diamond";
    if(n>=7)return "Gold";
    if(n>=4)return "Silver";
    return "Bronze";
  }

  function renderProfile(){
    $(".profile-shell").innerHTML=`${closeButton()}
      <p class="eyebrow">YOUR LOCAL SWEETVILLE IDENTITY</p><h2>Sweetie <em>Profile.</em></h2>
      <div class="sweetie-profile-card">
        <div class="profile-avatar" id="profileAvatarPreview">${profile.avatar||"🍭"}</div>
        <div><small>WELCOME BACK</small><h3>${profile.sweetieName||"Sweetie"}</h3><span class="rank-pill">${collectionRank()} Collector</span></div>
      </div>
      <div class="profile-stats-grid">
        <div><strong>${profile.level}</strong><small>LEVEL</small></div>
        <div><strong>${profile.xp}</strong><small>XP</small></div>
        <div><strong>${profile.streak||1}</strong><small>DAY STREAK</small></div>
        <div><strong>${profile.cards.length}/12</strong><small>VAULT</small></div>
        <div><strong>${profile.donutHighScore||0}</strong><small>DONUT BEST</small></div>
        <div><strong>${profile.melodyHighRound||0}</strong><small>MELODY ROUND</small></div>
      </div>
      <form class="profile-form" id="profileForm">
        <label>Sweetie Name<input id="profileName" maxlength="20" value="${String(profile.sweetieName||"Sweetie").replace(/"/g,"&quot;")}"></label>
        <label>Avatar<select id="profileAvatar">${["🍭","💖","✨","🍩","🎵","💋","🌈","👑"].map(a=>`<option ${profile.avatar===a?"selected":""}>${a}</option>`).join("")}</select></label>
        <label>Favorite Song<select id="profileSong"><option value="fun-dipp" ${profile.favoriteSong==="fun-dipp"?"selected":""}>Fun Dipp</option><option value="pink-lips" ${profile.favoriteSong==="pink-lips"?"selected":""}>Pink Lips Remix</option></select></label>
        <label>Favorite District<select id="profileDistrict">${Object.entries(zones).map(([id,z])=>`<option value="${id}" ${profile.favoriteDistrict===id?"selected":""}>${z.icon} ${z.title}</option>`).join("")}</select></label>
        <button class="button primary" type="submit">Save My Profile</button>
      </form>`;
    openModal("profile");
  }

  let donutTimer=null, donutScore=0, donutSeconds=30, basketX=50;
  function renderDonutGame(){
    $(".donutgame-shell").innerHTML=`${closeButton()}
      <p class="eyebrow">SWEET ARCADE</p><h2>Donut <em>Dash.</em></h2>
      <div class="arcade-hud"><span>Score <strong id="donutScore">0</strong></span><span>Time <strong id="donutTime">30</strong></span><span>Best <strong>${profile.donutHighScore||0}</strong></span></div>
      <div class="donut-board" id="donutBoard"><div class="donut-basket" id="donutBasket">🧺</div></div>
      <p class="game-help">Move with ← → or tap the left/right side of the board. Catch 🍩 and avoid 🍋.</p>
      <button class="button primary" id="startDonutGame" type="button">Start Donut Dash 🍩</button>
      <div class="donut-summary">Collect as many donuts as you can.</div>`;
    openModal("donutgame");
  }
  function moveBasket(delta){basketX=Math.max(3,Math.min(91,basketX+delta));const b=$("#donutBasket");if(b)b.style.left=`${basketX}%`;}
  function spawnDonutItem(){
    const board=$("#donutBoard");if(!board)return;
    const lemon=Math.random()<.22,item=document.createElement("span");
    item.className=`dash-item ${lemon?"lemon":"donut"}`;item.textContent=lemon?"🍋":"🍩";
    const x=Math.random()*90+3;item.style.left=`${x}%`;item.style.animationDuration=`${2+Math.random()*1.2}s`;
    board.appendChild(item);
    const checker=setInterval(()=>{
      const ir=item.getBoundingClientRect(),br=$("#donutBasket")?.getBoundingClientRect();
      if(br&&ir.bottom>=br.top&&ir.top<br.bottom&&ir.right>br.left&&ir.left<br.right){
        donutScore+=lemon?-4:2;donutScore=Math.max(0,donutScore);
        $("#donutScore").textContent=donutScore;clearInterval(checker);item.remove();
      }
      if(!item.isConnected)clearInterval(checker);
    },45);
    setTimeout(()=>{clearInterval(checker);item.remove();},3500);
  }
  function startDonutGame(){
    donutScore=0;donutSeconds=30;basketX=50;moveBasket(0);
    $("#donutScore").textContent=0;$("#donutTime").textContent=30;$("#startDonutGame").disabled=true;
    $("#donutBoard").querySelectorAll(".dash-item").forEach(x=>x.remove());
    donutTimer=setInterval(()=>{
      donutSeconds--;$("#donutTime").textContent=donutSeconds;spawnDonutItem();
      if(donutSeconds%2===0)spawnDonutItem();
      if(donutSeconds<=0)finishDonutGame();
    },1000);spawnDonutItem();
  }
  function finishDonutGame(){
    clearInterval(donutTimer);donutTimer=null;
    const best=donutScore>(profile.donutHighScore||0);profile.donutHighScore=Math.max(profile.donutHighScore||0,donutScore);
    if(!profile.gamesPlayed.includes("donutdash"))profile.gamesPlayed.push("donutdash");
    reward(25,Math.max(3,Math.floor(donutScore/5)));
    if(best&&donutScore>=20)profile.packs=(profile.packs||0)+1;
    save();$("#startDonutGame").disabled=false;$("#startDonutGame").textContent="Play Again 🍩";
    $(".donut-summary").innerHTML=`Final score: <strong>${donutScore}</strong>${best?" · NEW BEST!":""}${best&&donutScore>=20?" · +1 Sweet Pack":""}`;
  }

  const melodyNotes=[{id:0,icon:"🍭"},{id:1,icon:"💖"},{id:2,icon:"✨"},{id:3,icon:"🎵"}];
  let melodyPattern=[],melodyInput=[],melodyRound=0,melodyLocked=true;
  function renderMelodyGame(){
    $(".melodygame-shell").innerHTML=`${closeButton()}
      <p class="eyebrow">MELODY STUDIO CHALLENGE</p><h2>Melody <em>Memory.</em></h2>
      <div class="melody-hud">Round <strong id="melodyRound">0</strong> · Best <strong>${profile.melodyHighRound||0}</strong></div>
      <div class="melody-pads">${melodyNotes.map(n=>`<button class="melody-pad note-${n.id}" data-note="${n.id}" type="button">${n.icon}</button>`).join("")}</div>
      <p class="melody-status" id="melodyStatus">Watch the pattern, then repeat it.</p>
      <button class="button primary" id="startMelodyGame" type="button">Start Melody Memory 🎵</button>`;
    openModal("melodygame");
  }
  function flashNote(id){
    const p=$(`[data-note="${id}"]`);if(!p)return;
    p.classList.add("lit");setTimeout(()=>p.classList.remove("lit"),420);
  }
  async function playMelodyPattern(){
    melodyLocked=true;$("#melodyStatus").textContent="Listen and watch...";
    await new Promise(r=>setTimeout(r,500));
    for(const id of melodyPattern){flashNote(id);await new Promise(r=>setTimeout(r,650));}
    melodyInput=[];melodyLocked=false;$("#melodyStatus").textContent="Your turn!";
  }
  function startMelodyGame(){
    melodyPattern=[];melodyRound=0;$("#startMelodyGame").disabled=true;nextMelodyRound();
  }
  function nextMelodyRound(){
    melodyRound++;$("#melodyRound").textContent=melodyRound;
    melodyPattern.push(Math.floor(Math.random()*4));playMelodyPattern();
  }
  function pressMelodyNote(id){
    if(melodyLocked)return;flashNote(id);melodyInput.push(id);
    const pos=melodyInput.length-1;
    if(melodyInput[pos]!==melodyPattern[pos])return finishMelodyGame();
    if(melodyInput.length===melodyPattern.length){melodyLocked=true;$("#melodyStatus").textContent="Perfect! Next round...";setTimeout(nextMelodyRound,850);}
  }
  function finishMelodyGame(){
    melodyLocked=true;const completed=Math.max(0,melodyRound-1),best=completed>(profile.melodyHighRound||0);
    profile.melodyHighRound=Math.max(profile.melodyHighRound||0,completed);
    if(!profile.gamesPlayed.includes("melodymemory"))profile.gamesPlayed.push("melodymemory");
    reward(20+completed*5,3+completed);
    if(best&&completed>=5)profile.packs=(profile.packs||0)+1;
    save();$("#melodyStatus").innerHTML=`Sweet run! You completed <strong>${completed}</strong> round${completed===1?"":"s"}.${best?" New best!":""}${best&&completed>=5?" +1 Sweet Pack":""}`;
    $("#startMelodyGame").disabled=false;$("#startMelodyGame").textContent="Play Again 🎵";
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
    profile.questClaims.push(todayKey); reward(75,20); profile.packs=(profile.packs||0)+1; save();
    toast("🎁 Daily Sweet Quest complete · +75 XP · +20 Coins · +1 Sweet Pack");
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
      if(id==="pack")renderPackModal();
      if(id==="packshop")renderPackShop();
      if(id==="profile")renderProfile();
      if(id==="donutgame")renderDonutGame();
      if(id==="melodygame")renderMelodyGame();
    }));
    $$("[data-npc]").forEach(b=>b.addEventListener("click",()=>showCitizen(b.dataset.npc)));
    $$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m || e.target.closest("[data-close],.modal-close")) closeModal(m);}));
    document.addEventListener("click",e=>{
      if(e.target.id==="makeWish"){unlockCard(5);toast("✨ Your wish reached Sparkle Lake.");}
      if(e.target.id==="startGame")startGame();
      if(e.target.id==="claimQuest")claimQuest();
      if(e.target.id==="openPackButton")openSweetPack();
      if(e.target.id==="buyPack")buyPack();
      if(e.target.id==="startDonutGame")startDonutGame();
      if(e.target.id==="startMelodyGame")startMelodyGame();
      const note=e.target.closest("[data-note]");if(note)pressMelodyNote(Number(note.dataset.note));
      if(e.target.closest("[data-reveal-card]"))e.target.closest("[data-reveal-card]").classList.add("flipped");
      if(e.target.closest("[data-open-shop-inline]")){closeModal($("#packModal"));renderPackShop();}
      if(e.target.closest("[data-open-another-pack]")){if(profile.packs>0)renderPackModal();else closeModal($("#packModal"));}
      const vf=e.target.closest("[data-vault-filter]");if(vf){vaultFilter=vf.dataset.vaultFilter;renderVaultModal();}
      const castleTarget=e.target.closest("[data-castle-open]");
      if(castleTarget){
        closeModal($("#castleModal"));
        if(castleTarget.dataset.castleOpen==="achievements"){renderAchievements();openModal("achievements");}
        if(castleTarget.dataset.castleOpen==="vault"){renderVaultModal();openModal("vault");}
      }
    });
    $("#claimDaily").addEventListener("click",claimDaily);
    document.addEventListener("submit",e=>{
      if(e.target.id!=="profileForm")return;
      e.preventDefault();
      profile.sweetieName=$("#profileName").value.trim()||"Sweetie";
      profile.avatar=$("#profileAvatar").value;profile.favoriteSong=$("#profileSong").value;
      profile.favoriteDistrict=$("#profileDistrict").value;save();renderProfile();toast("💖 Sweetie Profile saved!");
    });
    document.addEventListener("pointerdown",e=>{
      const board=e.target.closest("#donutBoard");if(!board||!donutTimer)return;
      const rect=board.getBoundingClientRect();moveBasket(e.clientX<rect.left+rect.width/2?-9:9);
    });
    const copyEmail=$("#copyBusinessEmail");
    if(copyEmail) copyEmail.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText("jahntella@gmail.com");toast("📧 Email address copied!");}
      catch(_){toast("Email: jahntella@gmail.com");}
    });
    const year=$("#currentYear"); if(year) year.textContent=new Date().getFullYear();

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
      if((e.key==="ArrowLeft"||e.key==="ArrowRight")&&donutTimer){e.preventDefault();moveBasket(e.key==="ArrowLeft"?-8:8);}
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
    applyDayPhase(); applyWeather(); setInterval(applyDayPhase,60000); renderLoginStreak(); renderStoryProgress();
    initEvents(); initSparkles(); syncPlayer(); renderQuest();
    setTimeout(()=>$("#loadingScreen").classList.add("hidden"),1400);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();