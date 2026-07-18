
const CONFIG = window.JAHNTELLA_CONFIG || {brand:{},social:{},music:{},store:{},newsletter:{}};

const socialLabels = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  spotify: "Spotify",
  email: "Email"
};

const musicLabels = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  youtubeMusic: "YouTube Music",
  amazonMusic: "Amazon Music",
  soundcloud: "SoundCloud"
};

function renderExternalLinks() {
  document.querySelectorAll("[data-social-links]").forEach((container) => {
    container.innerHTML = Object.entries(CONFIG.social || {})
      .map(([key, url]) => `<a href="${url}" target="_blank" rel="noopener">${socialLabels[key] || key}</a>`)
      .join("");
  });

  document.querySelectorAll("[data-social-cards]").forEach((container) => {
    container.innerHTML = Object.entries(CONFIG.social || {})
      .map(([key, url]) => `
        <a class="social-card" href="${url}" target="_blank" rel="noopener">
          <small>FOLLOW</small>
          <strong>${socialLabels[key] || key}</strong>
          <span>Open channel →</span>
        </a>
      `).join("");
  });

  document.querySelectorAll("[data-music-links]").forEach((container) => {
    container.innerHTML = Object.entries(CONFIG.music || {})
      .map(([key, url]) => `<a href="${url}" target="_blank" rel="noopener">${musicLabels[key] || key} ↗</a>`)
      .join("");
  });

  document.getElementById("youtubeButton").href = CONFIG.social.youtube || "#";
  document.getElementById("footerSignoff").textContent =
    CONFIG.brand.signoff || "🍭 Stay Sweet, xo, Jahntella 💋";
}

renderExternalLinks();
document.getElementById("currentYear").textContent = new Date().getFullYear();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
  }, 1300);
});

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

document.addEventListener("mousemove", (event) => {
  const aura = document.querySelector(".cursor-aura");
  aura.style.left = `${event.clientX}px`;
  aura.style.top = `${event.clientY}px`;
});

// Canvas sparkle background
const canvas = document.getElementById("sparkleCanvas");
const context = canvas.getContext("2d");
let sparkles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  sparkles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 13)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.2 + 0.06,
    alpha: Math.random() * 0.7 + 0.15,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawSparkles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  sparkles.forEach((sparkle) => {
    sparkle.y -= sparkle.speed;
    sparkle.pulse += 0.025;
    if (sparkle.y < -10) {
      sparkle.y = window.innerHeight + 10;
      sparkle.x = Math.random() * window.innerWidth;
    }

    const alpha = sparkle.alpha * (0.65 + Math.sin(sparkle.pulse) * 0.35);
    context.beginPath();
    context.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 220, 242, ${alpha})`;
    context.shadowBlur = 10;
    context.shadowColor = "#ff4fa3";
    context.fill();
  });

  requestAnimationFrame(drawSparkles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawSparkles();

// Release switcher
const releaseTabs = document.querySelectorAll(".release-tab");
const releasePanels = document.querySelectorAll(".release-panel");

releaseTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;

    releaseTabs.forEach((item) => item.classList.toggle("active", item === tab));
    releasePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.release === target);
    });
  });
});

// Dialogs
const platformDialog = document.getElementById("platformDialog");
document.querySelectorAll(".open-platforms").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("platformTrack").textContent = button.dataset.track;
    platformDialog.showModal();
  });
});

document.querySelectorAll("[data-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.modal);
    if (dialog) dialog.showModal();
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

// Toast
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Four-star landing-page game
let foundHearts = 0;
const discoveredStars = new Set();
const starCounter = document.getElementById("heartCounter");

document.querySelectorAll(".hidden-star").forEach((star) => {
  star.addEventListener("click", () => {
    const starId = star.dataset.starId;

    if (discoveredStars.has(starId)) return;

    discoveredStars.add(starId);
    foundHearts = discoveredStars.size;

    if (starCounter) {
      starCounter.textContent = String(foundHearts);
    }

    star.classList.add("collected");
    star.setAttribute("aria-disabled", "true");
    showToast(star.dataset.secret || `Sparkle ${foundHearts} of 4 found! ✨`);

    if (foundHearts === 4) {
      window.setTimeout(() => {
        showToast("All 4 sparkles found — you unlocked extra sweetness! 🍭💖");
      }, 650);
    }
  });
});

// Browser-generated music previews
let audioContext;
let activePreview = null;

function createPreview(kind) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (activePreview) {
    activePreview.stop();
    activePreview = null;
    return false;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const delay = audioContext.createDelay();
  const feedback = audioContext.createGain();

  oscillator.type = kind === "pink-lips" ? "triangle" : "sine";
  oscillator.frequency.value = kind === "pink-lips" ? 330 : 440;
  gain.gain.value = 0.025;
  delay.delayTime.value = 0.18;
  feedback.gain.value = 0.24;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  gain.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(audioContext.destination);

  oscillator.start();
  activePreview = oscillator;

  window.setTimeout(() => {
    if (activePreview === oscillator) {
      oscillator.stop();
      activePreview = null;
    }
  }, 4500);

  return true;
}

document.querySelectorAll(".play-preview").forEach((button) => {
  button.addEventListener("click", () => {
    const started = createPreview(button.dataset.preview);
    button.textContent = started ? "Stop preview" : "Preview vibe";
    showToast(started ? "Playing a short browser-generated vibe ✨" : "Preview stopped");
  });
});

// One-shot sparkle chimes — no continuous hum
function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playSparkleChime() {
  const ctx = ensureAudioContext();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  const delay = ctx.createDelay();
  const feedback = ctx.createGain();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.16, now + 0.025);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);

  delay.delayTime.value = 0.16;
  feedback.gain.value = 0.18;

  master.connect(ctx.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);

  const notes = [
    { frequency: 783.99, start: 0.00, duration: 0.55 },
    { frequency: 987.77, start: 0.13, duration: 0.62 },
    { frequency: 1318.51, start: 0.29, duration: 0.78 }
  ];

  notes.forEach((note, index) => {
    const oscillator = ctx.createOscillator();
    const noteGain = ctx.createGain();

    oscillator.type = index === 2 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(note.frequency, now + note.start);

    noteGain.gain.setValueAtTime(0.0001, now + note.start);
    noteGain.gain.exponentialRampToValueAtTime(
      index === 2 ? 0.055 : 0.04,
      now + note.start + 0.018
    );
    noteGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + note.start + note.duration
    );

    oscillator.connect(noteGain);
    noteGain.connect(master);

    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.05);
  });
}

const soundControl = document.getElementById("soundControl");

if (soundControl) {
  soundControl.addEventListener("click", () => {
    soundControl.classList.add("is-playing");
    soundControl.innerHTML = "<span>✦</span> Sparkle chimes playing";

    playSparkleChime();

    window.setTimeout(() => {
      soundControl.classList.remove("is-playing");
      soundControl.innerHTML = "<span>✦</span> Play sparkle chimes";
    }, 1700);
  });
}

// Merch filtering
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".product-card").forEach((product) => {
      const show = filter === "all" || product.dataset.category === filter;
      product.classList.toggle("hidden-product", !show);
    });
  });
});

// Bag
let bag = [];
const bagDrawer = document.getElementById("bagDrawer");

function renderBag() {
  const bagItems = document.getElementById("bagItems");

  if (!bag.length) {
    bagItems.innerHTML = "<p>Your bag is waiting for something sweet.</p>";
  } else {
    bagItems.innerHTML = bag.map((item, index) => `
      <div class="bag-item">
        <span>${item.name}</span>
        <span>
          $${item.price}
          <button aria-label="Remove ${item.name}" onclick="removeBagItem(${index})">×</button>
        </span>
      </div>
    `).join("");
  }

  const total = bag.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("bagTotal").textContent = `$${total}`;
  document.getElementById("bagCount").textContent = bag.length;
}

window.removeBagItem = (index) => {
  bag.splice(index, 1);
  renderBag();
};

document.querySelectorAll(".add-to-bag").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.closest(".product-card");
    bag.push({
      name: product.dataset.name,
      price: Number(product.dataset.price)
    });
    renderBag();
    bagDrawer.classList.add("open");
    showToast(`${product.dataset.name} added to your Sweet Bag 💖`);
  });
});

document.querySelectorAll(".quick-look").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.closest(".product-card");
    showToast(`${product.dataset.name} — $${product.dataset.price}`);
  });
});

document.getElementById("bagButton").addEventListener("click", () => bagDrawer.classList.add("open"));
document.getElementById("bagClose").addEventListener("click", () => bagDrawer.classList.remove("open"));

document.getElementById("checkoutButton").addEventListener("click", () => {
  const checkoutUrl = CONFIG.store && CONFIG.store.checkoutUrl;

  if (checkoutUrl) {
    window.open(checkoutUrl, "_blank", "noopener");
  } else {
    showToast("Checkout preview works. Add your Shopify, Fourthwall or Stripe URL in config.js.");
  }
});

// Newsletter
document.getElementById("sweetListForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("fanEmail").value.trim();
  const message = document.getElementById("formMessage");
  const endpoint = CONFIG.newsletter && CONFIG.newsletter.endpoint;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error("Signup failed");
      message.textContent = `Welcome to The Sweet List, ${email} ✨`;
      event.target.reset();
    } catch {
      message.textContent = "The signup service could not be reached. Check config.js.";
    }
  } else {
    localStorage.setItem("jahntellaSweetListEmail", email);
    message.textContent = `Welcome to The Sweet List, ${email} ✨`;
    event.target.reset();
  }
});


// Sprint 1: Sweetville destination postcards
const sweetvilleDialog = document.getElementById("sweetvilleDialog");
const sweetvilleDialogIcon = document.getElementById("sweetvilleDialogIcon");
const sweetvilleDialogKicker = document.getElementById("sweetvilleDialogKicker");
const sweetvilleDialogTitle = document.getElementById("sweetvilleDialogTitle");
const sweetvilleDialogNote = document.getElementById("sweetvilleDialogNote");

document.querySelectorAll("[data-sweetville-place]").forEach((place) => {
  place.addEventListener("click", (event) => {
    if (event.target.closest("#shootingStar")) return;
    const name = place.dataset.sweetvillePlace || "Sweetville";
    if (sweetvilleDialogIcon) sweetvilleDialogIcon.textContent = place.dataset.sweetvilleIcon || "🍭";
    if (sweetvilleDialogKicker) sweetvilleDialogKicker.textContent = place.dataset.sweetvilleKicker || "A POSTCARD FROM SWEETVILLE";
    if (sweetvilleDialogTitle) sweetvilleDialogTitle.innerHTML = `${name} is <em>almost open.</em>`;
    if (sweetvilleDialogNote) sweetvilleDialogNote.textContent = place.dataset.sweetvilleNote || "Something sweet is on the way.";
    if (sweetvilleDialog) sweetvilleDialog.showModal();
  });
});

// A bonus delight separate from the four-sparkle game
const shootingStar = document.getElementById("shootingStar");
let shootingStarTimer;

function launchShootingStar() {
  if (!shootingStar) return;
  shootingStar.classList.remove("is-flying");
  void shootingStar.offsetWidth;
  shootingStar.classList.add("is-flying");
  window.clearTimeout(shootingStarTimer);
  shootingStarTimer = window.setTimeout(launchShootingStar, 20000);
}

function catchShootingStar(event) {
  event.stopPropagation();
  shootingStar.classList.remove("is-flying");
  showToast("Sweet! You caught a shooting star! ✨");
  window.clearTimeout(shootingStarTimer);
  shootingStarTimer = window.setTimeout(launchShootingStar, 20000);
}

if (shootingStar) {
  shootingStar.addEventListener("click", catchShootingStar);
  shootingStar.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") catchShootingStar(event);
  });
  shootingStarTimer = window.setTimeout(launchShootingStar, 4500);
}


// Sprint 2: Sweet Surprises
const SWEET_SURPRISES = [
  {
    id: "mood-dangerous-adorable",
    category: "Tonight's Mood",
    icon: "💋",
    title: "Dangerous... but adorable.",
    message: "Walk in like the lights came on just for you. Keep the confidence high and the drama cute.",
    rarity: "Common"
  },
  {
    id: "quote-kind-confidence",
    category: "Sweet Quote",
    icon: "✨",
    title: "Kindness is part of the glow.",
    message: "Confidence gets attention. Kindness is what makes people remember how you made them feel.",
    rarity: "Common"
  },
  {
    id: "cafe-pink-order",
    category: "Pink Café Order",
    icon: "☕",
    title: "Strawberry latte, extra sparkle.",
    message: "Today's order comes with one pink donut and absolutely no permission to dim your shine.",
    rarity: "Common"
  },
  {
    id: "letter-one-more-chorus",
    category: "Letter from Jahntella",
    icon: "💌",
    title: "One more chorus.",
    message: "Hey Sweetie — sometimes the best part of the night begins right when everyone else thinks it is over.",
    rarity: "Common"
  },
  {
    id: "fun-fact-hoops",
    category: "Jahntella Lore",
    icon: "💖",
    title: "The gold hoops stay on.",
    message: "Sweetville lore says Jahntella can hear a perfect pop hook before her earrings finish their first swing.",
    rarity: "Rare"
  },
  {
    id: "lyric-velvet-rope",
    category: "Fun Dipp Lyric Drop",
    icon: "🎵",
    title: "Near the velvet rope...",
    message: "\"You caught my eye near the velvet rope.\" The moment the sweet night turns into something a little riskier.",
    rarity: "Rare"
  },
  {
    id: "neon-vip-pass",
    category: "Neon Lounge Secret",
    icon: "🌙",
    title: "The velvet rope moved for you.",
    message: "You found a pink VIP pass. Opening night is getting closer, and the bass is already shaking Sweetville.",
    rarity: "Rare"
  },
  {
    id: "pink-lips-card",
    category: "Digital Collectible",
    icon: "💄",
    title: "Pink Lips Card #002",
    message: "Collection: The Sweet Era. Trait: extra attitude. Rarity: Ultra Rare. Keep this browser collection growing.",
    rarity: "Ultra Rare"
  },
  {
    id: "fun-dipp-card",
    category: "Digital Collectible",
    icon: "🍭",
    title: "Fun Dipp Card #001",
    message: "The song that opened Sweetville after dark. Candy-coated pop, neon confidence, and one unforgettable hook.",
    rarity: "Ultra Rare"
  },
  {
    id: "sparkle-lake-wish",
    category: "Sparkle Lake Wish",
    icon: "⭐",
    title: "Your wish made the water glow.",
    message: "Something you are quietly hoping for deserves one brave step today. Sweetville believes in momentum.",
    rarity: "Common"
  },
  {
    id: "legendary-founder",
    category: "Legendary Drop",
    icon: "👑",
    title: "Original Sweetie Badge",
    message: "You were here while Sweetville was still being built. That makes you part of the beginning.",
    rarity: "Legendary"
  },
  {
    id: "secret-after-dark",
    category: "After-Dark Secret",
    icon: "🪩",
    title: "Keep it cute. Keep it bad.",
    message: "The Neon Lounge rule: flirt with the moment, own the dance floor, and leave a little mystery behind.",
    rarity: "Legendary"
  }
];

const SURPRISE_STORAGE_KEY = "jahntellaSweetSurpriseCollectionV1";
const sweetMachine = document.getElementById("sweetMachine");
const surpriseButton = document.getElementById("surpriseButton");
const surprisePreview = document.getElementById("surprisePreview");
const machineStatus = document.getElementById("machineStatus");
const machineCount = document.getElementById("machineCount");
const previewRarity = document.getElementById("previewRarity");
const previewNumber = document.getElementById("previewNumber");
const previewIcon = document.getElementById("previewIcon");
const previewCategory = document.getElementById("previewCategory");
const previewTitle = document.getElementById("previewTitle");
const previewMessage = document.getElementById("previewMessage");
const shareSurpriseButton = document.getElementById("shareSurpriseButton");
const openCollectionButton = document.getElementById("openCollectionButton");
const resetCollectionButton = document.getElementById("resetCollectionButton");
const collectionDialog = document.getElementById("collectionDialog");
const collectionGrid = document.getElementById("collectionGrid");
const collectionUnlocked = document.getElementById("collectionUnlocked");
const collectionTotal = document.getElementById("collectionTotal");
const collectionRare = document.getElementById("collectionRare");

let currentSurprise = null;
let isSurpriseSpinning = false;

function getSweetCollection() {
  try {
    const saved = JSON.parse(localStorage.getItem(SURPRISE_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => SWEET_SURPRISES.some((item) => item.id === id)) : [];
  } catch {
    return [];
  }
}

function saveSweetCollection(collection) {
  localStorage.setItem(SURPRISE_STORAGE_KEY, JSON.stringify([...new Set(collection)]));
}

function rarityClass(rarity) {
  return `rarity-${String(rarity).toLowerCase().replace(/\s+/g, "-")}`;
}

function weightedSurprise() {
  const collection = getSweetCollection();
  const locked = SWEET_SURPRISES.filter((item) => !collection.includes(item.id));
  const source = locked.length ? locked : SWEET_SURPRISES;

  const weighted = source.flatMap((item) => {
    const weight = {
      "Common": 7,
      "Rare": 4,
      "Ultra Rare": 2,
      "Legendary": 1
    }[item.rarity] || 3;
    return Array(weight).fill(item);
  });

  return weighted[Math.floor(Math.random() * weighted.length)];
}

function updateSurpriseCount() {
  const count = getSweetCollection().length;
  if (machineCount) {
    machineCount.textContent = `${count} surprise${count === 1 ? "" : "s"} collected`;
  }
}

function burstSweetConfetti() {
  const colors = ["#ff4fa3", "#ffd66b", "#b76dff", "#ffffff", "#ff89c2"];
  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement("span");
    piece.className = "surprise-confetti";
    piece.style.left = `${48 + Math.random() * 8}%`;
    piece.style.top = `${38 + Math.random() * 7}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${-130 + Math.random() * 260}px`);
    piece.style.animationDelay = `${Math.random() * 0.12}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1500);
  }
}

function revealSweetSurprise(surprise) {
  currentSurprise = surprise;
  const collection = getSweetCollection();
  const isNew = !collection.includes(surprise.id);

  if (isNew) {
    collection.push(surprise.id);
    saveSweetCollection(collection);
  }

  if (previewRarity) {
    previewRarity.textContent = surprise.rarity.toUpperCase();
    previewRarity.className = `surprise-rarity ${rarityClass(surprise.rarity)}`;
  }
  if (previewNumber) {
    previewNumber.textContent = isNew ? "NEW DROP UNLOCKED" : "ENCORE DROP";
  }
  if (previewIcon) previewIcon.textContent = surprise.icon;
  if (previewCategory) previewCategory.textContent = surprise.category.toUpperCase();
  if (previewTitle) previewTitle.textContent = surprise.title;
  if (previewMessage) previewMessage.textContent = surprise.message;
  if (machineStatus) machineStatus.textContent = isNew ? "SOMETHING NEW JUST DROPPED!" : "A SWEET FAVORITE RETURNED";
  if (shareSurpriseButton) shareSurpriseButton.disabled = false;

  if (surprisePreview) {
    surprisePreview.classList.remove("is-revealing");
    void surprisePreview.offsetWidth;
    surprisePreview.classList.add("is-revealing");
  }

  updateSurpriseCount();
  renderSweetCollection();

  if (isNew) {
    burstSweetConfetti();
    showToast(`${surprise.rarity} Sweet Surprise unlocked! ${surprise.icon}`);
  } else {
    showToast(`Encore drop: ${surprise.title} ${surprise.icon}`);
  }
}

function spinSweetMachine() {
  if (isSurpriseSpinning) return;
  isSurpriseSpinning = true;

  if (surpriseButton) {
    surpriseButton.disabled = true;
    surpriseButton.querySelector("span:last-child").textContent = "Mixing the sweetness...";
  }
  if (machineStatus) machineStatus.textContent = "SHAKING UP SWEETVILLE...";
  if (sweetMachine) sweetMachine.classList.add("is-spinning");

  window.setTimeout(() => {
    revealSweetSurprise(weightedSurprise());
    if (sweetMachine) sweetMachine.classList.remove("is-spinning");
    if (surpriseButton) {
      surpriseButton.disabled = false;
      surpriseButton.querySelector("span:last-child").textContent = "Push for Another Surprise";
    }
    isSurpriseSpinning = false;
  }, 720);
}

function renderSweetCollection() {
  const collection = getSweetCollection();
  const unlockedItems = SWEET_SURPRISES.filter((item) => collection.includes(item.id));
  const rareCount = unlockedItems.filter((item) => item.rarity !== "Common").length;

  if (collectionUnlocked) collectionUnlocked.textContent = String(unlockedItems.length);
  if (collectionTotal) collectionTotal.textContent = String(SWEET_SURPRISES.length);
  if (collectionRare) collectionRare.textContent = String(rareCount);

  if (!collectionGrid) return;

  collectionGrid.innerHTML = SWEET_SURPRISES.map((item) => {
    const unlocked = collection.includes(item.id);
    if (!unlocked) {
      return '<article class="collection-card locked" aria-label="Locked surprise"></article>';
    }

    return `
      <article class="collection-card">
        <div class="collection-icon">${item.icon}</div>
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <span class="surprise-rarity ${rarityClass(item.rarity)}">${item.rarity.toUpperCase()}</span>
      </article>
    `;
  }).join("");
}

async function shareCurrentSurprise() {
  if (!currentSurprise) return;

  const shareText = `I unlocked "${currentSurprise.title}" in Jahntella's Sweet Surprises 🍭✨`;
  const shareData = {
    title: "Jahntella Sweet Surprise",
    text: shareText,
    url: window.location.href.split("#")[0] + "#surprises"
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareData.url}`);
      showToast("Sweet Surprise copied — ready to share! 💖");
    } else {
      showToast(shareText);
    }
  } catch (error) {
    if (error && error.name !== "AbortError") {
      showToast("Sharing paused — your surprise is still saved.");
    }
  }
}

if (surpriseButton) {
  surpriseButton.addEventListener("click", spinSweetMachine);
}

if (openCollectionButton && collectionDialog) {
  openCollectionButton.addEventListener("click", () => {
    renderSweetCollection();
    collectionDialog.showModal();
  });
}

if (shareSurpriseButton) {
  shareSurpriseButton.addEventListener("click", shareCurrentSurprise);
}

if (resetCollectionButton) {
  resetCollectionButton.addEventListener("click", () => {
    const shouldReset = window.confirm("Reset all Sweet Surprise discoveries saved in this browser?");
    if (!shouldReset) return;

    localStorage.removeItem(SURPRISE_STORAGE_KEY);
    currentSurprise = null;
    updateSurpriseCount();
    renderSweetCollection();

    if (previewRarity) {
      previewRarity.textContent = "READY";
      previewRarity.className = "surprise-rarity rarity-common";
    }
    if (previewNumber) previewNumber.textContent = "SWEET DROP";
    if (previewIcon) previewIcon.textContent = "🎁";
    if (previewCategory) previewCategory.textContent = "YOUR NEXT LITTLE DELIGHT";
    if (previewTitle) previewTitle.textContent = "What will you unlock?";
    if (previewMessage) previewMessage.textContent = "Push the glowing button and let Sweetville choose something for you.";
    if (machineStatus) machineStatus.textContent = "READY FOR SOMETHING SWEET?";
    if (shareSurpriseButton) shareSurpriseButton.disabled = true;
    if (surpriseButton) surpriseButton.querySelector("span:last-child").textContent = "Push for a Surprise";

    showToast("Sweet Surprise collection reset.");
  });
}

updateSurpriseCount();
renderSweetCollection();
