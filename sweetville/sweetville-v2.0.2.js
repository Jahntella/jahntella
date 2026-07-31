
(() => {
  "use strict";

  const locations = [
    {slug:"neon-sweetheart",id:"SV-005",title:"Neon Sweetheart",image:"assets/sv-005-neon-sweetheart.png",ambience:"Neon reflections • soft synth pulse • floating hearts",story:"At the center of Sweetville nightlife, Neon Sweetheart is where confidence meets the dancefloor.",quote:"Neon lights. Sweet nights. A heart that shines brightest after dark.",message:"I come here whenever I need to remember that being seen can be beautiful.",reward:"Your heart was never too much. It was always your light."},
    {slug:"donut-district",id:"SV-006",title:"Donut District",image:"assets/sv-006-donut-district.png",ambience:"Passing lights • candy city glow • late-night cruising",story:"Donut District is Sweetville's candy-colored cruising lane, where every turn feels playful.",quote:"Leave a trail of sprinkles and make every ride an unforgettable adventure.",message:"Sometimes you just need sprinkles.",reward:"Joy does not have to be earned."},
    {slug:"melody-studio",id:"SV-007",title:"Melody Studio",image:"assets/sv-007-melody-studio.png",ambience:"Piano echoes • warm studio lights • drifting music notes",story:"This is where Jahntella turns tiny ideas into songs.",quote:"Every song starts with a tiny idea and a heart brave enough to sing it.",message:"Every song begins here as one tiny thought.",reward:"Your voice matters before the world applauds it."},
    {slug:"sparkle-lake",id:"SV-008",title:"Sparkle Lake",image:"assets/sv-008-sparkle-lake.png",ambience:"Water ripples • fireflies • moonlit wind",story:"Sparkle Lake reflects more than stars.",quote:"The stars always seem brighter when you remember that you are your own fairytale.",message:"The lake never asks you to be anything except still.",reward:"Quiet can be part of becoming."},
    {slug:"pink-cafe",id:"SV-009",title:"Pink Café",image:"assets/sv-009-pink-cafe.png",ambience:"Coffee steam • flower petals • morning birds",story:"Pink Café is Jahntella's favorite place to slow down and begin again.",quote:"Slow down, make yourself a priority, and start the day with gratitude.",message:"I usually start my mornings here with one thing I'm grateful for.",reward:"You are allowed to begin again."}
  ];

  const badges = [
    ["first-step","👣","First Step",s=>s.visited.length>=1],
    ["sweet-explorer","🗺️","Sweet Explorer",s=>s.visited.length>=3],
    ["world-traveler","🌎","World Traveler",s=>s.visited.length===5],
    ["heart-finder","💖","Heart Finder",s=>s.hearts.length>=1],
    ["heart-hunter","✨","Heart Hunter",s=>s.hearts.length>=3],
    ["super-sweetie","👑","Super Sweetie",s=>s.hearts.length===5&&s.visited.length===5]
  ];

  const ranks = [
    ["Visitor","🌱",0],["Sweetie","💖",2],["Explorer","✨",5],
    ["Citizen","🌎",9],["Ambassador","👑",14],["Founding Sweetie","⭐",20]
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
    "Every time the gates open, the whole city feels a little bigger."
  ];

  const el = id => document.getElementById(id);
  const requiredIds = [
    "gateScreen","openGates","skyStars","floatingWorld","menuButton","svNav",
    "worldTime","worldPhase","rankName","giftBox","giftStatus","giftReveal",
    "giftIcon","giftTitle","giftText","diaryDate","diaryEntry","nextDiary",
    "rankTrack","visitedCount","heartCount","badgeCount","giftCount","passportBar",
    "stampGrid","locationGrid","secretEnding","locationModal","modalClose",
    "modalImage","modalCardId","modalTitle","modalAmbience","modalStory",
    "modalQuote","modalMessage","stampButton","hiddenHeart","heartStatus",
    "achievementToast","toastIcon","toastKicker","toastTitle"
  ];

  const E = {};
  for (const id of requiredIds) {
    E[id] = el(id);
  }

  const missing = requiredIds.filter(id => !E[id]);
  if (missing.length) {
    console.error("Sweetville v2.0.2 missing elements:", missing);
    return;
  }

  const KEY = "jahntellaSweetvilleV1";
  const GIFT_KEY = "jahntellaSweetvilleDailyGifts";

  const readState = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {visited:[],hearts:[],badges:[]};
    } catch {
      return {visited:[],hearts:[],badges:[]};
    }
  };

  let state = readState();
  state.visited = [...new Set(state.visited || [])];
  state.hearts = [...new Set(state.hearts || [])];
  state.badges = [...new Set(state.badges || [])];

  let activeLocation = null;
  let diaryIndex = new Date().getDate() % diaries.length;
  let toastTimer = null;

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  const giftLog = () => {
    try { return JSON.parse(localStorage.getItem(GIFT_KEY)) || []; }
    catch { return []; }
  };

  const today = () => new Date().toISOString().slice(0,10);
  const score = () => state.visited.length + state.hearts.length + state.badges.length + Math.min(giftLog().length,4);
  const currentRank = () => [...ranks].reverse().find(r => score() >= r[2]) || ranks[0];

  const showToast = (icon,kicker,title) => {
    E.toastIcon.textContent = icon;
    E.toastKicker.textContent = kicker;
    E.toastTitle.textContent = title;
    E.achievementToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => E.achievementToast.classList.remove("show"), 3000);
  };

  const updateWorld = () => {
    const d = new Date();
    const h = d.getHours();
    let phase = "night";
    if (h >= 6 && h < 11) phase = "morning";
    else if (h >= 11 && h < 17) phase = "day";
    else if (h >= 17 && h < 21) phase = "sunset";

    document.documentElement.dataset.phase = phase;
    E.worldPhase.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
    E.worldTime.textContent = d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
    E.rankName.textContent = currentRank()[0];
  };

  const evaluateBadges = (announce = true) => {
    badges.forEach(badge => {
      if (badge[3](state) && !state.badges.includes(badge[0])) {
        state.badges.push(badge[0]);
        if (announce) showToast(badge[1], "NEW BADGE", badge[2]);
      }
    });
    save();
  };

  const renderDiary = () => {
    E.diaryDate.textContent = new Date().toLocaleDateString([], {
      weekday:"long", month:"long", day:"numeric", year:"numeric"
    });
    E.diaryEntry.textContent = diaries[diaryIndex];
  };

  const renderGift = () => {
    const opened = giftLog().includes(today());
    const gift = gifts[new Date().getDate() % gifts.length];

    E.giftReveal.hidden = !opened;
    if (opened) {
      E.giftIcon.textContent = gift[0];
      E.giftTitle.textContent = gift[1];
      E.giftText.textContent = gift[2];
      E.giftStatus.textContent = "Today's gift has been opened. Come back tomorrow.";
      E.giftBox.classList.add("opened");
    } else {
      E.giftStatus.textContent = "Tap the gift to open today's surprise.";
      E.giftBox.classList.remove("opened");
    }
  };

  const renderRanks = () => {
    const current = currentRank()[0];
    E.rankTrack.innerHTML = ranks.map(r => `
      <article class="rank-step ${score() >= r[2] ? "reached" : ""} ${current === r[0] ? "current" : ""}">
        <span>${r[1]}</span>
        <div><strong>${r[0]}</strong><small>${r[2]} points</small></div>
      </article>
    `).join("");
  };

  const render = () => {
    evaluateBadges(false);

    E.visitedCount.textContent = state.visited.length;
    E.heartCount.textContent = state.hearts.length;
    E.badgeCount.textContent = state.badges.length;
    E.giftCount.textContent = giftLog().length;
    E.passportBar.style.width = Math.min(100, score()/20*100) + "%";
    E.rankName.textContent = currentRank()[0];

    E.stampGrid.innerHTML = locations.map(loc => {
      const visited = state.visited.includes(loc.slug);
      return `<article class="stamp ${visited ? "visited" : ""}">
        <span class="seal">${visited ? "💖" : "♡"}</span>
        <strong>${loc.title}</strong>
        <small>${visited ? "PASSPORT STAMPED" : "NOT YET VISITED"}</small>
      </article>`;
    }).join("");

    E.locationGrid.innerHTML = locations.map(loc => `
      <article class="location-card" data-location="${loc.slug}" tabindex="0" role="button">
        <img src="${loc.image}" alt="${loc.title}">
        <div><small>${loc.id}</small><strong>${loc.title}</strong>
        <small>${state.visited.includes(loc.slug) ? "Visited ✓" : "Enter location →"}</small></div>
      </article>
    `).join("");

    document.querySelectorAll(".world-location[data-location]").forEach(node => {
      node.classList.toggle("visited", state.visited.includes(node.dataset.location));
    });

    E.secretEnding.hidden = !(state.visited.length === 5 && state.hearts.length === 5);
    renderRanks();
    renderGift();
    updateWorld();
  };

  const openLocation = slug => {
    activeLocation = locations.find(loc => loc.slug === slug);
    if (!activeLocation) return;

    E.modalImage.src = activeLocation.image;
    E.modalImage.alt = activeLocation.title;
    E.modalCardId.textContent = activeLocation.id + " • LIVING LOCATION";
    E.modalTitle.textContent = activeLocation.title;
    E.modalAmbience.textContent = activeLocation.ambience;
    E.modalStory.textContent = activeLocation.story;
    E.modalQuote.textContent = activeLocation.quote;
    E.modalMessage.textContent = 'Jahntella 💋 — “' + activeLocation.message + '”';
    E.stampButton.textContent = state.visited.includes(slug) ? "Passport Stamped ✓" : "Stamp My Passport";

    const found = state.hearts.includes(slug);
    E.hiddenHeart.textContent = found ? "💖" : "♡";
    E.hiddenHeart.classList.toggle("found", found);
    E.heartStatus.textContent = found ? activeLocation.reward : "Tap the glowing heart to collect it.";

    E.locationModal.showModal();
  };

  E.openGates.addEventListener("click", () => {
    E.gateScreen.classList.add("opening");
    sessionStorage.setItem("sweetvilleGatesOpened", "yes");
    setTimeout(() => E.gateScreen.classList.add("opened"), 1700);
  });

  if (sessionStorage.getItem("sweetvilleGatesOpened") === "yes") {
    E.gateScreen.classList.add("opened");
  }

  E.giftBox.addEventListener("click", () => {
    const log = giftLog();
    if (log.includes(today())) return;

    log.push(today());
    localStorage.setItem(GIFT_KEY, JSON.stringify(log));
    const gift = gifts[new Date().getDate() % gifts.length];
    showToast("🎁", "DAILY GIFT", gift[1]);
    render();
  });

  E.nextDiary.addEventListener("click", () => {
    diaryIndex = (diaryIndex + 1) % diaries.length;
    renderDiary();
  });

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-location]");
    if (target) openLocation(target.dataset.location);
  });

  document.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".location-card")) {
      event.preventDefault();
      openLocation(event.target.dataset.location);
    }
  });

  E.modalClose.addEventListener("click", () => E.locationModal.close());

  E.locationModal.addEventListener("click", event => {
    if (event.target === E.locationModal) E.locationModal.close();
  });

  E.stampButton.addEventListener("click", () => {
    if (!activeLocation || state.visited.includes(activeLocation.slug)) return;
    state.visited.push(activeLocation.slug);
    save();
    E.stampButton.textContent = "Passport Stamped ✓";
    showToast("🛂", "PASSPORT STAMPED", activeLocation.title);
    evaluateBadges(true);
    render();
  });

  E.hiddenHeart.addEventListener("click", () => {
    if (!activeLocation || state.hearts.includes(activeLocation.slug)) return;
    state.hearts.push(activeLocation.slug);
    save();
    E.hiddenHeart.textContent = "💖";
    E.hiddenHeart.classList.add("found");
    E.heartStatus.textContent = activeLocation.reward;
    showToast("💖", "HIDDEN HEART FOUND", activeLocation.title);
    evaluateBadges(true);
    render();
  });

  E.menuButton.addEventListener("click", () => {
    const open = E.svNav.classList.toggle("open");
    E.menuButton.setAttribute("aria-expanded", String(open));
  });

  E.svNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      E.svNav.classList.remove("open");
      E.menuButton.setAttribute("aria-expanded", "false");
    });
  });

  E.skyStars.innerHTML = Array.from({length:70}, (_,i) =>
    `<i style="left:${i*37%100}%;top:${i*61%95}%;animation-delay:${i%9*.2}s"></i>`
  ).join("");

  E.floatingWorld.innerHTML = Array.from({length:20}, (_,i) =>
    `<span style="left:${i*41%100}%;animation-duration:${14+i%8*3}s;animation-delay:-${i*1.8}s">${["♡","✦","•","✧"][i%4]}</span>`
  ).join("");

  renderDiary();
  render();
  setInterval(updateWorld, 30000);

  console.info("Sweetville v2.0.2 interactions loaded successfully.");
})();
