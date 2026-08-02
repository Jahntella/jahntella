
(() => {
  "use strict";

  const locations = [
    {
      slug:"neon-sweetheart", id:"SV-005", title:"Neon Sweetheart",
      image:"assets/sv-005-neon-sweetheart.webp",
      ambience:"Neon reflections • soft synth pulse • floating hearts",
      story:"At the center of Sweetville nightlife, Neon Sweetheart is where confidence meets the dancefloor.",
      quote:"Neon lights. Sweet nights. A heart that shines brightest after dark.",
      message:"I come here whenever I need to remember that being seen can be beautiful.",
      reward:"Your heart was never too much. It was always your light.",
      letterTitle:"The Night I Chose to Glow",
      letter:"Sweetie, there will be nights when hiding feels easier. But you were never made to disappear. Take up your little piece of the sky and let it shine.",
      collectible:{icon:"💄",name:"Pink Lipstick"},
      mood:{frequency:220,tempo:420}
    },
    {
      slug:"donut-district", id:"SV-006", title:"Donut District",
      image:"assets/sv-006-donut-district.webp",
      ambience:"Passing lights • candy city glow • late-night cruising",
      story:"Donut District is Sweetville's candy-colored cruising lane, where every turn feels playful.",
      quote:"Leave a trail of sprinkles and make every ride an unforgettable adventure.",
      message:"Sometimes you just need sprinkles.",
      reward:"Joy does not have to be earned.",
      letterTitle:"Permission to Choose Joy",
      letter:"Sweetie, not every happy thing needs a reason. Laugh too loudly, take the scenic road, order the extra sprinkles, and let joy be enough.",
      collectible:{icon:"🍭",name:"Fun Dipp Candy"},
      mood:{frequency:330,tempo:300}
    },
    {
      slug:"melody-studio", id:"SV-007", title:"Melody Studio",
      image:"assets/sv-007-melody-studio.webp",
      ambience:"Piano echoes • warm studio lights • drifting music notes",
      story:"This is where Jahntella turns tiny ideas into songs.",
      quote:"Every song starts with a tiny idea and a heart brave enough to sing it.",
      message:"Every song begins here as one tiny thought.",
      reward:"Your voice matters before the world applauds it.",
      letterTitle:"Before the First Chorus",
      letter:"Sweetie, every big song starts as something small and uncertain. Protect your tiny ideas. They may already know the way toward the world they are meant to become.",
      collectible:{icon:"🎵",name:"Sweetville Vinyl"},
      mood:{frequency:262,tempo:520}
    },
    {
      slug:"sparkle-lake", id:"SV-008", title:"Sparkle Lake",
      image:"assets/sv-008-sparkle-lake.webp",
      ambience:"Water ripples • fireflies • moonlit wind",
      story:"Sparkle Lake reflects more than stars.",
      quote:"The stars always seem brighter when you remember that you are your own fairytale.",
      message:"The lake never asks you to be anything except still.",
      reward:"Quiet can be part of becoming.",
      letterTitle:"A Quiet Place to Begin Again",
      letter:"Sweetie, you do not have to solve everything tonight. Let the water hold the reflection. Let tomorrow carry tomorrow. For now, breathe.",
      collectible:{icon:"🎀",name:"Moonlight Bow"},
      mood:{frequency:196,tempo:680}
    },
    {
      slug:"pink-cafe", id:"SV-009", title:"Pink Café",
      image:"assets/sv-009-pink-cafe.webp",
      ambience:"Coffee steam • flower petals • morning birds",
      story:"Pink Café is Jahntella's favorite place to slow down and begin again.",
      quote:"Slow down, make yourself a priority, and start the day with gratitude.",
      message:"I usually start my mornings here with one thing I'm grateful for.",
      reward:"You are allowed to begin again.",
      letterTitle:"Your New Morning",
      letter:"Sweetie, today does not need to carry yesterday's mistakes. Take one warm sip, name one thing you are grateful for, and begin exactly where you are.",
      collectible:{icon:"👑",name:"Café Crown"},
      mood:{frequency:294,tempo:600}
    }
  ];

  const achievements = [
    {id:"first-visit",icon:"✨",title:"First Visit",desc:"Enter one Sweetville district.",test:s=>s.visited.length>=1},
    {id:"three-districts",icon:"🗺️",title:"Sweet Explorer",desc:"Visit three open districts.",test:s=>s.visited.length>=3},
    {id:"all-districts",icon:"🌎",title:"World Traveler",desc:"Visit every open district.",test:s=>s.visited.length===5},
    {id:"first-heart",icon:"💖",title:"Heart Finder",desc:"Find one hidden heart.",test:s=>s.hearts.length>=1},
    {id:"all-hearts",icon:"✨",title:"Heart Keeper",desc:"Find all five hidden hearts.",test:s=>s.hearts.length===5},
    {id:"first-letter",icon:"💌",title:"Secret Reader",desc:"Open one hidden letter.",test:s=>s.letters.length>=1},
    {id:"all-letters",icon:"📖",title:"Pink Mailbox",desc:"Find every hidden letter.",test:s=>s.letters.length===5},
    {id:"first-collectible",icon:"🍭",title:"Sweet Collector",desc:"Find one secret collectible.",test:s=>s.collectibles.length>=1},
    {id:"all-collectibles",icon:"🧸",title:"Shelf Complete",desc:"Collect every district treasure.",test:s=>s.collectibles.length===5},
    {id:"super-sweetie",icon:"👑",title:"Super Sweetie",desc:"Complete all district discoveries.",test:s=>s.visited.length===5&&s.hearts.length===5&&s.letters.length===5&&s.collectibles.length===5}
  ];

  const ranks = [
    ["Visitor","🌱",0],["Sweetie","💖",3],["Explorer","✨",8],
    ["Citizen","🌎",14],["Ambassador","👑",22],["Founding Sweetie","⭐",30]
  ];

  const gifts = [
    ["💌","A Note from Jahntella","You only have to be brave enough to begin."],
    ["🌙","Sparkle Lake Wish","Make one quiet wish for the version of you who kept going."],
    ["☕","Pink Café Ritual","Write down one thing you are grateful for."],
    ["🎵","Melody Studio Prompt","Tiny ideas can become whole worlds."],
    ["🍩","Donut District Pass","Choose joy for no practical reason."],
    ["💖","Neon Heart Message","Being soft and being powerful were never opposites."]
  ];

  const diaries = [
    "Today I watched the lights come on across Sweetville. Thank you for returning.",
    "I spent part of today inside Melody Studio with one line repeating in my head.",
    "Sparkle Lake was quiet tonight. I hope this world can be one small place where you set something heavy down.",
    "Someone left a tiny heart near the window at Pink Café today.",
    "Every time the gates open, the whole city feels a little bigger.",
    "I walked through Donut District tonight and decided joy can be a direction.",
    "The shelf in your Sweetie Room is waiting for the treasures only you can find."
  ];

  const messages = [
    "“I hid something sweet in one of the districts.”",
    "“Your room changes every time your world gets bigger.”",
    "“Tiny ideas become whole universes when someone believes in them.”",
    "“The lights at my house will turn on one day.”",
    "“Come back tomorrow. Sweetville remembers.”"
  ];

  const el = id => document.getElementById(id);
  const E = {};
  [
    "gateScreen","openGates","skyStars","floatingWorld","ambientLife","menuButton","svNav",
    "worldTime","worldPhase","rankName","soundStatus","soundToggle","jahntellaMessage",
    "giftBox","giftStatus","giftReveal","giftIcon","giftTitle","giftText","diaryDate","diaryEntry",
    "nextDiary","letterCount","letterHint","lettersGrid","collectibleCount","collectionBar",
    "collectibleShelf","roomShelf","roomStampCount","roomAward","roomNote","achievementGrid",
    "rankTrack","visitedCount","heartCount","badgeCount","giftCount","passportBar","stampGrid",
    "locationGrid","secretEnding","locationModal","modalClose","modalImage","modalAtmosphere",
    "modalCardId","modalTitle","modalAmbience","modalStory","modalQuote","modalMessage",
    "stampButton","hiddenHeart","heartStatus","hiddenLetter","letterStatus",
    "hiddenCollectible","collectibleStatus","letterModal","letterClose","letterTitle","letterBody",
    "achievementToast","toastIcon","toastKicker","toastTitle"

  ].forEach(id => E[id] = el(id));

  /*
   * EXP 6.1.1 — SAFE LEGACY ELEMENT GUARD
   * Older Sweetville systems still reference a few sections that newer
   * layouts replaced. A missing element must never stop the entire script.
   */
  Object.keys(E).forEach(id => {
    if (E[id]) return;

    const fallback = document.createElement("div");
    fallback.dataset.sweetvilleFallback = id;
    fallback.hidden = true;
    fallback.setAttribute("aria-hidden", "true");

    // Dialog-only methods are not available on a normal div.
    fallback.showModal = () => {};
    fallback.close = () => {};

    E[id] = fallback;
  });


  const KEY = "jahntellaSweetvilleV4";
  const LEGACY_KEY = "jahntellaSweetvilleV1";
  const GIFT_KEY = "jahntellaSweetvilleDailyGifts";

  const blankState = () => ({visited:[],hearts:[],letters:[],collectibles:[],badges:[]});

  const readState = () => {
    try {
      const current = JSON.parse(localStorage.getItem(KEY));
      if (current) return {...blankState(),...current};
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
      if (legacy) return {...blankState(),visited:legacy.visited||[],hearts:legacy.hearts||[],badges:legacy.badges||[]};
    } catch {}
    return blankState();
  };

  let state = readState();
  ["visited","hearts","letters","collectibles","badges"].forEach(k => state[k] = [...new Set(state[k] || [])]);
  let activeLocation = null;
  let diaryIndex = new Date().getDate() % diaries.length;
  let toastTimer = null;
  let audioContext = null;
  let worldSoundOn = false;
  let activeOscillators = [];

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const giftLog = () => { try{return JSON.parse(localStorage.getItem(GIFT_KEY))||[]}catch{return[]} };
  const today = () => new Date().toISOString().slice(0,10);
  const score = () => state.visited.length + state.hearts.length + state.letters.length + state.collectibles.length + state.badges.length + Math.min(giftLog().length,5);
  const currentRank = () => [...ranks].reverse().find(r => score() >= r[2]) || ranks[0];

  const showToast = (icon,kicker,title) => {
    E.toastIcon.textContent = icon; E.toastKicker.textContent = kicker; E.toastTitle.textContent = title;
    E.achievementToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => E.achievementToast.classList.remove("show"), 3200);
  };

  const updateWorld = () => {
    const d = new Date(), h = d.getHours();
    let phase = "night";
    if (h >= 6 && h < 11) phase = "morning";
    else if (h >= 11 && h < 17) phase = "day";
    else if (h >= 17 && h < 21) phase = "sunset";
    document.documentElement.dataset.phase = phase;
    E.worldPhase.textContent = phase.charAt(0).toUpperCase()+phase.slice(1);
    E.worldTime.textContent = d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
    E.rankName.textContent = currentRank()[0];
  };

  const stopSound = () => {
    activeOscillators.forEach(o => { try{o.stop()}catch{} });
    activeOscillators = [];
  };

  const evaluateAchievements = (announce=true) => {
    achievements.forEach(a => {
      if (a.test(state) && !state.badges.includes(a.id)) {
        state.badges.push(a.id);
        if (announce) showToast(a.icon,"NEW ACHIEVEMENT",a.title);
      }
    });
    save();
  };

  const renderDiary = () => {
    E.diaryDate.textContent = new Date().toLocaleDateString([], {weekday:"long",month:"long",day:"numeric",year:"numeric"});
    E.diaryEntry.textContent = diaries[diaryIndex];
  };

  const renderGift = () => {
    const opened = giftLog().includes(today());
    const gift = gifts[new Date().getDate()%gifts.length];
    E.giftReveal.hidden = !opened;
    if (opened) {
      E.giftIcon.textContent=gift[0]; E.giftTitle.textContent=gift[1]; E.giftText.textContent=gift[2];
      E.giftStatus.textContent="Today's gift has been opened. Come back tomorrow.";
      E.giftBox.classList.add("opened");
    } else {
      E.giftStatus.textContent="Tap the gift to open today's surprise.";
      E.giftBox.classList.remove("opened");
    }
  };

  const renderRanks = () => {
    const current = currentRank()[0];
    E.rankTrack.innerHTML = ranks.map(r => `
      <article class="rank-step ${score()>=r[2]?"reached":""} ${current===r[0]?"current":""}">
        <span>${r[1]}</span><div><strong>${r[0]}</strong><small>${r[2]} points</small></div><b>${score()>=r[2]?"✓":""}</b>
      </article>`).join("");
  };

  const renderLetters = () => {
    E.letterCount.textContent = state.letters.length;
    E.letterHint.textContent = state.letters.length===5 ? "Every hidden letter is now inside your Pink Mailbox." : "Explore a district and look for its hidden envelope.";
    E.lettersGrid.innerHTML = locations.map(loc => {
      const found = state.letters.includes(loc.slug);
      return `<article class="letter-card ${found?"":"locked"}">
        <button data-letter="${loc.slug}" ${found?"":"disabled"}>
          <span class="envelope">${found?"💌":"✉️"}</span>
          <strong>${found?loc.letterTitle:"Hidden Letter"}</strong>
          <small>${found?loc.title:"Find this inside a district"}</small>
        </button>
      </article>`;
    }).join("");
  };

  const renderCollection = () => {
    E.collectibleCount.textContent = state.collectibles.length;
    E.collectionBar.style.width = `${state.collectibles.length/5*100}%`;
    E.collectibleShelf.innerHTML = locations.map(loc => {
      const found = state.collectibles.includes(loc.slug);
      return `<article class="collectible-slot ${found?"":"locked"}">
        <div><span class="item">${found?loc.collectible.icon:"?"}</span>
        <strong>${found?loc.collectible.name:"Mystery Treasure"}</strong>
        <small>${found?loc.title:"Still hidden"}</small></div>
      </article>`;
    }).join("");
  };

  const renderRoom = () => {
    if (E.roomStampCount) E.roomStampCount.textContent = `${state.visited.length} STAMP${state.visited.length===1?"":"S"}`;
    if (E.roomShelf) E.roomShelf.innerHTML = locations.filter(loc=>state.collectibles.includes(loc.slug)).map(loc=>`<span class="room-item" title="${loc.collectible.name}">${loc.collectible.icon}</span>`).join("");
    if (E.roomAward) E.roomAward.classList.toggle("unlocked",state.badges.includes("super-sweetie"));
    const total = state.visited.length+state.hearts.length+state.letters.length+state.collectibles.length;
    if (E.roomNote) E.roomNote.textContent = total===0 ? "Keep exploring to make this room your own." :
      total<8 ? "Your room is beginning to feel like home." :
      total<16 ? "The shelves are filling and the walls remember your journey." :
      "This room belongs to a true Sweetville explorer.";
  };

  const renderAchievements = () => {
    E.achievementGrid.innerHTML = achievements.map(a => {
      const unlocked = state.badges.includes(a.id);
      return `<article class="achievement-card ${unlocked?"unlocked":"locked"}">
        <span class="icon">${a.icon}</span><strong>${a.title}</strong><small>${unlocked?"UNLOCKED":a.desc}</small>
      </article>`;
    }).join("");
  };

  const render = () => {
    evaluateAchievements(false);

    if (E.visitedCount) E.visitedCount.textContent = state.visited.length;
    if (E.heartCount) E.heartCount.textContent = state.hearts.length;
    if (E.badgeCount) {
      E.badgeCount.textContent = state.badges.filter(id => achievements.some(a => a.id === id)).length;
    }
    if (E.giftCount) E.giftCount.textContent = giftLog().length;
    if (E.passportBar) E.passportBar.style.width = Math.min(100, score() / 30 * 100) + "%";
    if (E.rankName) E.rankName.textContent = currentRank()[0];

    if (E.stampGrid) {
      E.stampGrid.innerHTML = locations.map(loc => {
        const visited = state.visited.includes(loc.slug);
        return `<article class="stamp ${visited ? "visited" : ""}"><span class="seal">${visited ? "💖" : "♡"}</span><strong>${loc.title}</strong><small>${visited ? "PASSPORT STAMPED" : "NOT YET VISITED"}</small></article>`;
      }).join("");
    }

    if (E.locationGrid) {
      E.locationGrid.innerHTML = locations.map(loc => `
        <article class="location-card" data-location="${loc.slug}" tabindex="0" role="button">
          <img src="${loc.image}" alt="${loc.title}">
          <div><small>${loc.id}</small><strong>${loc.title}</strong><small>${state.visited.includes(loc.slug) ? "Visited ✓" : "Enter location →"}</small></div>
        </article>`).join("");
    }

    document.querySelectorAll(".world-location[data-location]").forEach(node => {
      node.classList.toggle("visited", state.visited.includes(node.dataset.location));
    });

    if (E.secretEnding) {
      E.secretEnding.hidden = !(
        state.visited.length === 5 &&
        state.hearts.length === 5 &&
        state.letters.length === 5 &&
        state.collectibles.length === 5
      );
    }

    if (E.rankTrack) renderRanks();
    if (E.giftBox && E.giftReveal) renderGift();
    if (E.lettersGrid) renderLetters();
    if (E.collectibleShelf) renderCollection();
    if (E.roomShelf) renderRoom();
    if (E.achievementGrid) renderAchievements();
    updateWorld();
  };

  const openLetter = slug => {
    const loc=locations.find(l=>l.slug===slug); if(!loc||!state.letters.includes(slug))return;
    E.letterTitle.textContent=loc.letterTitle; E.letterBody.textContent=loc.letter; E.letterModal.showModal();
  };

  const openLocation = slug => {
    activeLocation=locations.find(loc=>loc.slug===slug); if(!activeLocation)return;
    E.modalImage.src=activeLocation.image; E.modalImage.alt=activeLocation.title;
    E.modalAtmosphere.dataset.location=activeLocation.slug;
    E.modalCardId.textContent=activeLocation.id+" • LIVING LOCATION"; E.modalTitle.textContent=activeLocation.title;
    E.modalAmbience.textContent=activeLocation.ambience; E.modalStory.textContent=activeLocation.story;
    E.modalQuote.textContent=activeLocation.quote; E.modalMessage.textContent='Jahntella 💋 — “'+activeLocation.message+'”';
    E.stampButton.textContent=state.visited.includes(slug)?"Passport Stamped ✓":"Stamp My Passport";
    const foundHeart=state.hearts.includes(slug), foundLetter=state.letters.includes(slug), foundCollectible=state.collectibles.includes(slug);
    E.hiddenHeart.textContent=foundHeart?"💖":"♡"; E.heartStatus.textContent=foundHeart?activeLocation.reward:"Tap the glowing heart to collect it.";
    E.hiddenLetter.textContent=foundLetter?"💌":"✉️"; E.letterStatus.textContent=foundLetter?"Letter added to your Pink Mailbox.":"Open the envelope.";
    E.hiddenCollectible.textContent=foundCollectible?activeLocation.collectible.icon:"?"; E.collectibleStatus.textContent=foundCollectible?activeLocation.collectible.name:"Reveal the district treasure.";
    E.locationModal.showModal();
    if(worldSoundOn) playMood(activeLocation);
  };

  E.openGates.addEventListener("click",()=>{E.gateScreen.classList.add("opening");sessionStorage.setItem("sweetvilleGatesOpened","yes");setTimeout(()=>E.gateScreen.classList.add("opened"),1700)});
  if(sessionStorage.getItem("sweetvilleGatesOpened")==="yes")E.gateScreen.classList.add("opened");

  E.soundToggle.addEventListener("click", ()=>{
    document.getElementById("miniPianoModal")?.showModal();
    E.soundStatus.textContent="Mini Piano";
  });

  E.giftBox.addEventListener("click",()=>{
    const log=giftLog();if(log.includes(today()))return;log.push(today());localStorage.setItem(GIFT_KEY,JSON.stringify(log));
    const gift=gifts[new Date().getDate()%gifts.length];showToast("🎁","DAILY GIFT",gift[1]);render();
  });

  E.nextDiary.addEventListener("click",()=>{diaryIndex=(diaryIndex+1)%diaries.length;renderDiary()});

  document.addEventListener("click",event=>{
    const target=event.target.closest("[data-location]");if(target)openLocation(target.dataset.location);
    const letter=event.target.closest("[data-letter]");if(letter)openLetter(letter.dataset.letter);
  });

  document.addEventListener("keydown",event=>{
    if((event.key==="Enter"||event.key===" ")&&event.target.matches(".location-card")){event.preventDefault();openLocation(event.target.dataset.location)}
  });

  E.modalClose.addEventListener("click",()=>{stopSound();E.locationModal.close()});
  E.locationModal.addEventListener("click",event=>{if(event.target===E.locationModal){stopSound();E.locationModal.close()}});
  E.letterClose.addEventListener("click",()=>E.letterModal.close());
  E.letterModal.addEventListener("click",event=>{if(event.target===E.letterModal)E.letterModal.close()});

  E.stampButton.addEventListener("click",()=>{
    if(!activeLocation||state.visited.includes(activeLocation.slug))return;
    state.visited.push(activeLocation.slug);save();E.stampButton.textContent="Passport Stamped ✓";showToast("🛂","PASSPORT STAMPED",activeLocation.title);evaluateAchievements(true);render();
  });

  E.hiddenHeart.addEventListener("click",()=>{
    if(!activeLocation||state.hearts.includes(activeLocation.slug))return;
    state.hearts.push(activeLocation.slug);save();E.hiddenHeart.textContent="💖";E.heartStatus.textContent=activeLocation.reward;showToast("💖","HIDDEN HEART FOUND",activeLocation.title);evaluateAchievements(true);render();
  });

  E.hiddenLetter.addEventListener("click",()=>{
    if(!activeLocation)return;
    if(!state.letters.includes(activeLocation.slug)){state.letters.push(activeLocation.slug);save();showToast("💌","HIDDEN LETTER FOUND",activeLocation.letterTitle);evaluateAchievements(true);render();}
    E.hiddenLetter.textContent="💌";E.letterStatus.textContent="Letter added to your Pink Mailbox.";openLetter(activeLocation.slug);
  });

  E.hiddenCollectible.addEventListener("click",()=>{
    if(!activeLocation||state.collectibles.includes(activeLocation.slug))return;
    state.collectibles.push(activeLocation.slug);save();E.hiddenCollectible.textContent=activeLocation.collectible.icon;E.collectibleStatus.textContent=activeLocation.collectible.name;showToast(activeLocation.collectible.icon,"NEW COLLECTIBLE",activeLocation.collectible.name);evaluateAchievements(true);render();
  });
E.menuButton.addEventListener("click",()=>{const open=E.svNav.classList.toggle("open");E.menuButton.setAttribute("aria-expanded",String(open))});
  E.svNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{E.svNav.classList.remove("open");E.menuButton.setAttribute("aria-expanded","false")}));

  E.skyStars.innerHTML=Array.from({length:80},(_,i)=>`<i style="left:${i*37%100}%;top:${i*61%95}%;animation-delay:${i%9*.2}s"></i>`).join("");
  E.floatingWorld.innerHTML=Array.from({length:24},(_,i)=>`<span style="left:${i*41%100}%;animation-duration:${14+i%8*3}s;animation-delay:-${i*1.8}s">${["♡","✦","•","✧"][i%4]}</span>`).join("");
  E.ambientLife.innerHTML=Array.from({length:12},(_,i)=>`<span style="left:${-10-i*8}%;top:${15+i*6%70}%;animation-duration:${30+i*5}s;animation-delay:-${i*4}s">${["🦋","✨","🎈","✧"][i%4]}</span>`).join("");

  setInterval(updateWorld,30000);
  setInterval(()=>{
    const p=E.jahntellaMessage.querySelector("p");p.textContent=messages[Math.floor(Math.random()*messages.length)];
    E.jahntellaMessage.classList.add("pop");setTimeout(()=>E.jahntellaMessage.classList.remove("pop"),1300);
  },18000);

  renderDiary();render();
})();
