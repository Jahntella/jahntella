window.JAHNTELLA_BUILD = "5.0.4-PRODUCTION-READY";

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
async function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio is not supported.");

  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  return audioContext;
}

async function playSparkleChime() {
  const ctx = await ensureAudioContext();
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
  soundControl.addEventListener("click", async () => {
    soundControl.disabled = true;
    soundControl.classList.add("is-playing");
    soundControl.innerHTML = "<span>✦</span> Sparkle chimes playing";

    try {
      await playSparkleChime();
      showToast("Sparkle chimes! ✨");
    } catch (error) {
      console.error(error);
      showToast("Your browser blocked the chimes. Tap once more to play.");
    }

    window.setTimeout(() => {
      soundControl.disabled = false;
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



// BUILD 5.0.3A: Sweet Vault Series 1 — real collectible card art
// Each collectible now uses its own approved pose, outfit, setting, and finished card design.
const SWEET_SURPRISES = [
  {id:"sv-001-bubblegum-queen",number:"001",title:"Bubblegum Queen",subtitle:"Rule the Sweet Era",category:"Signature Card",icon:"👑",rarity:"Legendary",photo:"cards/sv-001-bubblegum-queen.png",theme:"official-card",a:"#ff49a4",b:"#7a2cff",trait:"Royal Sweetness",lore:"The queen of confidence, sparkle, and the sweetest kind of main-character energy.",quote:"Own your sparkle. Rule your story."},
  {id:"sv-002-fun-dipp",number:"002",title:"Fun Dipp",subtitle:"Dip Into the Sweet",category:"Music Era",icon:"🍭",rarity:"Ultra Rare",photo:"cards/sv-002-fun-dipp.png",theme:"official-card",a:"#ff2995",b:"#7138d8",trait:"Candy-Coated Confidence",lore:"A neon sugar rush inspired by the song that opened the doors to Sweetville.",quote:"Dip in, glow up, stay sweet."},
  {id:"sv-003-pink-lips",number:"003",title:"Pink Lips",subtitle:"The Kiss of the Era",category:"Music Era",icon:"💋",rarity:"Ultra Rare",photo:"cards/sv-003-pink-lips.png",theme:"official-card",a:"#ff4c9e",b:"#a51467",trait:"Gloss and Confidence",lore:"Bold, bright, and impossible to ignore—the signature kiss of the Sweet Era.",quote:"Say it sweet. Mean it boldly."},
  {id:"sv-004-candy-rebel",number:"004",title:"Candy Rebel",subtitle:"Sweet With an Edge",category:"Sweetville Stories",icon:"🐶",rarity:"Epic",photo:"cards/sv-004-candy-rebel.png",theme:"official-card",a:"#ff579f",b:"#52228f",trait:"Playful Rebellion",lore:"Jahntella and her loyal little sidekick prove that sweetness and attitude belong together.",quote:"Break the rules. Keep the heart."},
  {id:"sv-005-neon-sweetheart",number:"005",title:"Neon Sweetheart",subtitle:"Light Up the Night",category:"Neon Lounge",icon:"💖",rarity:"Epic",photo:"cards/sv-005-neon-sweetheart.png",theme:"official-card",a:"#ff2f9d",b:"#4d1bd5",trait:"Electric Charm",lore:"When the lights go pink and the music gets loud, the Neon Sweetheart owns the room.",quote:"Glow like the night was made for you."},
  {id:"sv-006-donut-district",number:"006",title:"Donut District",subtitle:"Cruise the Sweet Side",category:"Sweetville Landmark",icon:"🍩",rarity:"Rare",photo:"cards/sv-006-donut-district.png",theme:"official-card",a:"#ff7fbf",b:"#4e45c7",trait:"Sugar-Rush Adventure",lore:"A moonlit drive through Sweetville where the wheels are glazed and every road leads somewhere delicious.",quote:"Take the sweetest route."},
  {id:"sv-007-melody-studio",number:"007",title:"Melody Studio",subtitle:"Where the Magic Starts",category:"Behind the Music",icon:"🎙️",rarity:"Rare",photo:"cards/sv-007-melody-studio.png",theme:"official-card",a:"#ff5fb4",b:"#4527a0",trait:"Creative Focus",lore:"Headphones on, microphone ready—this is where a feeling becomes a melody.",quote:"Turn the feeling into a song."},
  {id:"sv-008-sparkle-lake",number:"008",title:"Sparkle Lake",subtitle:"Make a Wish",category:"Sweetville Landmark",icon:"🌙",rarity:"Rare",photo:"cards/sv-008-sparkle-lake.png",theme:"official-card",a:"#f05fac",b:"#3657c8",trait:"Moonlit Courage",lore:"A shimmering place for wishes, brave choices, and the quiet moment before the next adventure.",quote:"Carry your own light."},
  {id:"sv-009-pink-cafe",number:"009",title:"Pink Café",subtitle:"Start the Day Sweet",category:"Sweetville Landmark",icon:"☕",rarity:"Rare",photo:"cards/sv-009-pink-cafe.png",theme:"official-card",a:"#ff8fc8",b:"#9e3c81",trait:"Cozy Inspiration",lore:"Coffee, flowers, soft mornings, and a fresh page waiting for a new idea.",quote:"Begin softly. Dream boldly."},
  {id:"sv-010-cotton-candy-clouds",number:"010",title:"Cotton Candy Clouds",subtitle:"Dream in Pink",category:"Sweet Dreams",icon:"☁️",rarity:"Rare",photo:"cards/sv-010-cotton-candy-clouds.png",theme:"official-card",a:"#ff9bd2",b:"#7661d9",trait:"Dreamy Escape",lore:"A soft pink dreamland where the clouds feel like candy and tomorrow can wait.",quote:"Rest is part of the magic."},
  {id:"sv-011-stay-sweet",number:"011",title:"Stay Sweet",subtitle:"A Lesson Worth Sharing",category:"Sweet Lessons",icon:"🍎",rarity:"Rare",photo:"cards/sv-011-stay-sweet.png",theme:"official-card",a:"#ff73b8",b:"#7746b8",trait:"Kind Confidence",lore:"The most important lesson in Sweetville: kindness can be powerful, confident, and unforgettable.",quote:"Stay sweet. Stand strong."},
  {id:"sv-012-xo-sweetie-secret",number:"012",title:"XO Sweetie",subtitle:"The Hidden Kiss",category:"Secret Card",icon:"🌈",rarity:"Secret Rare",photo:"cards/sv-012-xo-sweetie-secret.png",theme:"official-card",a:"#ff3f9b",b:"#6537e7",trait:"Secret Sweetness",lore:"The rarest kiss in the vault—a shimmering secret for the Sweeties who keep believing.",quote:"XO, Sweetie. You found the secret."}
];

const SURPRISE_STORAGE_KEY = "jahntellaSweetVaultCollectionV501";
const FAVORITES_STORAGE_KEY = "jahntellaSweetVaultFavoritesV501";
const UNLOCK_DATES_KEY = "jahntellaSweetVaultUnlockDatesV501";
const VAULT_STATS_KEY = "jahntellaSweetVaultStatsV502";

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
const vaultProgressFill = document.getElementById("vaultProgressFill");
const vaultProgressPercent = document.getElementById("vaultProgressPercent");
const vaultRecentRow = document.getElementById("vaultRecentRow");
const vaultResetButton = document.getElementById("vaultResetButton");
const floatingVaultButton = document.getElementById("floatingVaultButton");
const floatingVaultCount = document.getElementById("floatingVaultCount");
const vaultPacksOpened = document.getElementById("vaultPacksOpened");
const vaultHighestPull = document.getElementById("vaultHighestPull");
const vaultDuplicateCount = document.getElementById("vaultDuplicateCount");
const vaultSecretStatus = document.getElementById("vaultSecretStatus");

const packRevealOverlay = document.getElementById("packRevealOverlay");
const vaultCelebration = document.getElementById("vaultCelebration");
const vaultCelebrationParticles = document.getElementById("vaultCelebrationParticles");
const celebrationKicker = document.getElementById("celebrationKicker");
const celebrationTitle = document.getElementById("celebrationTitle");
const celebrationSubtitle = document.getElementById("celebrationSubtitle");
const revealMessage = document.getElementById("revealMessage");
const packStage = document.getElementById("packStage");
const packAnimationStatus = document.getElementById("packAnimationStatus");
const sweetPack = document.getElementById("sweetPack");
const packCloseButton = document.getElementById("packCloseButton");
const cardRevealPanel = document.getElementById("cardRevealPanel");
const revealKicker = document.getElementById("revealKicker");
const revealRarity = document.getElementById("revealRarity");
const sweetCardScene = document.getElementById("sweetCardScene");
const featuredSweetCard = document.getElementById("featuredSweetCard");
const featuredCardFront = document.getElementById("featuredCardFront");
const featuredCardBack = document.getElementById("featuredCardBack");
const downloadCardButton = document.getElementById("downloadCardButton");
const favoriteCardButton = document.getElementById("favoriteCardButton");
const shareCardButton = document.getElementById("shareCardButton");
const revealVaultButton = document.getElementById("revealVaultButton");

let currentSurprise = null;
let isSurpriseSpinning = false;
let revealIsNew = false;
let packAnimationTimers = [];
let packAnimationRunning = false;

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function readStoredObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
function getSweetCollection() {
  return readStoredArray(SURPRISE_STORAGE_KEY).filter((id) => SWEET_SURPRISES.some((card) => card.id === id));
}
function saveSweetCollection(ids) {
  localStorage.setItem(SURPRISE_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}
function getFavorites() {
  return readStoredArray(FAVORITES_STORAGE_KEY).filter((id) => SWEET_SURPRISES.some((card) => card.id === id));
}
function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}
function getUnlockDates() {
  return readStoredObject(UNLOCK_DATES_KEY);
}
function saveUnlockDates(dates) {
  localStorage.setItem(UNLOCK_DATES_KEY, JSON.stringify(dates));
}

const RARITY_RANK = {
  "Rare": 1,
  "Epic": 2,
  "Ultra Rare": 3,
  "Legendary": 4,
  "Secret Rare": 5
};

function getVaultStats() {
  const stored = readStoredObject(VAULT_STATS_KEY);
  return {
    packsOpened: Number.isFinite(stored.packsOpened) ? stored.packsOpened : 0,
    duplicates: Number.isFinite(stored.duplicates) ? stored.duplicates : 0,
    highestPull: typeof stored.highestPull === "string" ? stored.highestPull : "",
    secretRare: Boolean(stored.secretRare),
    lastPull: typeof stored.lastPull === "string" ? stored.lastPull : ""
  };
}

function saveVaultStats(stats) {
  localStorage.setItem(VAULT_STATS_KEY, JSON.stringify(stats));
}

function recordVaultPull(card, isNew) {
  const stats = getVaultStats();
  stats.packsOpened += 1;
  if (!isNew) stats.duplicates += 1;
  if (!stats.highestPull || (RARITY_RANK[card.rarity] || 0) > (RARITY_RANK[stats.highestPull] || 0)) {
    stats.highestPull = card.rarity;
  }
  if (card.rarity === "Secret Rare") stats.secretRare = true;
  stats.lastPull = card.id;
  saveVaultStats(stats);
  return stats;
}

function renderVaultStats() {
  const stats = getVaultStats();
  const collectedCards = getSweetCollection()
    .map((id) => SWEET_SURPRISES.find((card) => card.id === id))
    .filter(Boolean);

  const collectionHighest = collectedCards.reduce((highest, card) => {
    if (!highest || (RARITY_RANK[card.rarity] || 0) > (RARITY_RANK[highest] || 0)) {
      return card.rarity;
    }
    return highest;
  }, "");

  // Migration for visitors who collected cards before v5.0.2 existed.
  // Each unique saved card required at least one pack opening.
  if (stats.packsOpened < collectedCards.length) {
    stats.packsOpened = collectedCards.length;
  }

  if (collectionHighest &&
      (!stats.highestPull ||
       (RARITY_RANK[collectionHighest] || 0) > (RARITY_RANK[stats.highestPull] || 0))) {
    stats.highestPull = collectionHighest;
  }

  if (collectedCards.some((card) => card.rarity === "Secret Rare")) {
    stats.secretRare = true;
  }

  saveVaultStats(stats);

  if (vaultPacksOpened) vaultPacksOpened.textContent = String(stats.packsOpened);
  if (vaultHighestPull) vaultHighestPull.textContent = stats.highestPull || "—";
  if (vaultDuplicateCount) vaultDuplicateCount.textContent = String(stats.duplicates);
  if (vaultSecretStatus) {
    vaultSecretStatus.textContent = stats.secretRare ? "Discovered ✨" : "Not Found";
    vaultSecretStatus.classList.toggle("is-found", stats.secretRare);
  }
}
function rarityClass(rarity) {
  return String(rarity).toLowerCase().replace(/\s+/g, "-");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}
function weightedSurprise() {
  const collected = getSweetCollection();
  const locked = SWEET_SURPRISES.filter((card) => !collected.includes(card.id));
  const source = locked.length ? locked : SWEET_SURPRISES;
  const weights = {"Rare":48,"Epic":26,"Ultra Rare":15,"Legendary":8,"Secret Rare":3};
  const pool = source.flatMap((card) => Array(weights[card.rarity] || 3).fill(card));
  return pool[Math.floor(Math.random() * pool.length)];
}
function updateSurpriseCount() {
  const count = getSweetCollection().length;
  if (machineCount) machineCount.textContent = `${count} card${count === 1 ? "" : "s"} collected`;
  if (floatingVaultCount) floatingVaultCount.textContent = `${count}/12`;
}
function cardFrontMarkup(card) {
  return `
    <span class="official-card-art">
      <img src="${escapeHtml(card.photo)}" alt="${escapeHtml(card.title)} — Jahntella First Edition card">
      <span class="official-card-shine" aria-hidden="true"></span>
    </span>
  `;
}
function cardBackMarkup(card) {
  return `
    <span class="official-card-back-art">
      <img src="cards/sweet-vault-card-back.png" alt="Sweet Vault collectible card back">
      <span class="official-card-shine" aria-hidden="true"></span>
    </span>`;
}
function clearPackAnimationTimers() {
  packAnimationTimers.forEach((timer) => window.clearTimeout(timer));
  packAnimationTimers = [];
}

function schedulePackStep(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  packAnimationTimers.push(timer);
  return timer;
}

function resetPackAnimationClasses() {
  packStage?.classList.remove("phase-charge", "phase-burst", "phase-card-rise", "phase-card-flip", "phase-foil-sweep", "phase-complete", "rarity-rare", "rarity-epic", "rarity-ultra-rare", "rarity-legendary", "rarity-secret-rare");
  sweetPack?.classList.remove("is-charging", "is-opening");
  cardRevealPanel?.classList.remove("is-entering", "is-revealed");
  featuredSweetCard?.classList.remove("reveal-pop", "is-floating");
  featuredSweetCard?.style.removeProperty("--tilt-x");
  featuredSweetCard?.style.removeProperty("--tilt-y");
  if (revealRarity) { revealRarity.textContent = ""; revealRarity.className = "reveal-rarity"; }
  if (revealMessage) revealMessage.textContent = "";
  hideVaultCelebration();
}

function prepareFeaturedCard(card, isNew) {
  currentSurprise = card;
  revealIsNew = isNew;

  // Begin on the official Sweet Vault card back.
  featuredSweetCard.classList.add("is-flipped");
  featuredCardFront.className = `sweet-card-face sweet-card-front ${rarityClass(card.rarity)}`;
  featuredCardFront.style.setProperty("--card-a", card.a);
  featuredCardFront.style.setProperty("--card-b", card.b);
  featuredCardFront.innerHTML = cardFrontMarkup(card);
  featuredCardBack.innerHTML = cardBackMarkup(card);

  const finalMessage = isNew ? "✨ NEW DISCOVERY!" : "💖 DUPLICATE";
  if (revealMessage) revealMessage.textContent = isNew
    ? `${card.title} has been added to your Sweet Vault.`
    : `${card.title} is already in your Sweet Vault — still sweet!`;
  if (revealRarity) {
    revealRarity.textContent = card.rarity.toUpperCase();
    revealRarity.className = `reveal-rarity ${rarityClass(card.rarity)}`;
  }
  revealKicker.dataset.finalText = finalMessage;
  revealKicker.textContent = "YOUR SWEET VAULT CARD IS READY";
  updateFavoriteButton();
}

function openPackReveal(card, isNew) {
  clearPackAnimationTimers();
  resetPackAnimationClasses();
  packAnimationRunning = false;
  prepareFeaturedCard(card, isNew);

  cardRevealPanel.hidden = true;
  sweetPack.hidden = false;
  const tapLabel = sweetPack.querySelector(".foil-pack-tap");
  if (tapLabel) tapLabel.textContent = "TAP TO OPEN";
  if (packAnimationStatus) packAnimationStatus.textContent = "Your Sweet Pack is ready.";

  packRevealOverlay.hidden = false;
  packRevealOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => sweetPack.focus(), 80);
}

function closePackReveal() {
  clearPackAnimationTimers();
  packAnimationRunning = false;
  resetPackAnimationClasses();
  packRevealOverlay.hidden = true;
  packRevealOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  featuredSweetCard.classList.remove("is-flipped");
  hideVaultCelebration();
}
function hideVaultCelebration() {
  if (!vaultCelebration) return;
  vaultCelebration.hidden = true;
  vaultCelebration.setAttribute("aria-hidden", "true");
  vaultCelebration.className = "vault-celebration";
  if (vaultCelebrationParticles) vaultCelebrationParticles.innerHTML = "";
}

function showVaultCelebration(card) {
  if (!vaultCelebration || !card) return;
  const rarity = rarityClass(card.rarity);
  if (rarity !== "legendary" && rarity !== "secret-rare") return;

  vaultCelebration.hidden = false;
  vaultCelebration.setAttribute("aria-hidden", "false");
  vaultCelebration.className = `vault-celebration celebration-${rarity}`;
  celebrationKicker.textContent = rarity === "secret-rare" ? "THE RAREST SWEET VAULT MOMENT" : "A LEGENDARY SWEET VAULT PULL";
  celebrationTitle.textContent = rarity === "secret-rare" ? "✨ SECRET RARE FOUND! ✨" : "👑 LEGENDARY CARD! 👑";
  celebrationSubtitle.textContent = `${card.title} has joined your Sweet Vault.`;

  if (vaultCelebrationParticles) {
    const symbols = rarity === "secret-rare" ? ["💖","✨","♡","★","✦"] : ["★","✦","◆","✨"];
    const count = rarity === "secret-rare" ? 55 : 34;
    vaultCelebrationParticles.innerHTML = "";
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("i");
      particle.textContent = symbols[i % symbols.length];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--delay", `${Math.random() * .8}s`);
      particle.style.setProperty("--duration", `${2.2 + Math.random() * 1.8}s`);
      particle.style.setProperty("--sway", `${-80 + Math.random() * 160}px`);
      vaultCelebrationParticles.appendChild(particle);
    }
  }
  window.setTimeout(hideVaultCelebration, rarity === "secret-rare" ? 5200 : 3400);
}

function burstSweetConfetti() {
  const colors = ["#ff4fa3","#ffd66b","#9c6dff","#ffffff","#53d9ff"];
  for (let index = 0; index < 38; index += 1) {
    const piece = document.createElement("span");
    piece.className = "surprise-confetti";
    piece.style.left = `${45 + Math.random() * 10}%`;
    piece.style.top = `${30 + Math.random() * 9}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${-180 + Math.random() * 360}px`);
    piece.style.animationDelay = `${Math.random() * .14}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1600);
  }
}
function openPack() {
  if (packAnimationRunning || !currentSurprise) return;
  packAnimationRunning = true;
  clearPackAnimationTimers();
  resetPackAnimationClasses();

  const tapLabel = sweetPack.querySelector(".foil-pack-tap");
  if (tapLabel) tapLabel.textContent = "OPENING…";
  if (packAnimationStatus) packAnimationStatus.textContent = "The Sweet Pack is charging with sparkle.";

  packStage.classList.add("phase-charge");
  sweetPack.classList.add("is-charging");

  schedulePackStep(() => {
    packStage.classList.remove("phase-charge");
    packStage.classList.add("phase-burst", `rarity-${rarityClass(currentSurprise.rarity)}`);
    sweetPack.classList.remove("is-charging");
    sweetPack.classList.add("is-opening");
    if (packAnimationStatus) packAnimationStatus.textContent = "The Sweet Pack is opening.";
  }, 650);

  schedulePackStep(() => {
    sweetPack.hidden = true;
    cardRevealPanel.hidden = false;
    cardRevealPanel.classList.add("is-entering");
    packStage.classList.remove("phase-burst");
    packStage.classList.add("phase-card-rise");
    revealKicker.textContent = "A CARD EMERGES FROM THE VAULT…";
    if (packAnimationStatus) packAnimationStatus.textContent = "The official card back is emerging.";
  }, 1500);

  schedulePackStep(() => {
    cardRevealPanel.classList.remove("is-entering");
    packStage.classList.remove("phase-card-rise");
    packStage.classList.add("phase-card-flip");
    revealKicker.textContent = "GET READY FOR THE REVEAL…";
    if (packAnimationStatus) packAnimationStatus.textContent = "The card is turning over.";
  }, 2450);

  schedulePackStep(() => {
    packStage.classList.add("phase-foil-sweep");
    featuredSweetCard.classList.remove("is-flipped");
    featuredSweetCard.classList.add("reveal-pop");
  }, 2725);

  schedulePackStep(() => {
    packStage.classList.remove("phase-card-flip", "phase-foil-sweep");
    packStage.classList.add("phase-complete");
    cardRevealPanel.classList.add("is-revealed");
    revealKicker.textContent = revealKicker.dataset.finalText || "CARD REVEALED!";
    burstSweetConfetti();
    showVaultCelebration(currentSurprise);
    showToast(`${currentSurprise.rarity} card revealed! ${currentSurprise.icon}`);
    if (packAnimationStatus) packAnimationStatus.textContent = `${currentSurprise.title}, ${currentSurprise.rarity}, revealed.`;
    featuredSweetCard.classList.add("is-floating");
    featuredSweetCard.focus();
    packAnimationRunning = false;
  }, 3650);
}
function revealSweetSurprise(card) {
  const collection = getSweetCollection();
  const isNew = !collection.includes(card.id);
  recordVaultPull(card, isNew);
  if (isNew) {
    collection.push(card.id);
    saveSweetCollection(collection);
    const dates = getUnlockDates();
    dates[card.id] = new Date().toLocaleDateString(undefined, {year:"numeric",month:"short",day:"numeric"});
    saveUnlockDates(dates);
  }
  if (previewRarity) {
    previewRarity.textContent = card.rarity.toUpperCase();
    previewRarity.className = `surprise-rarity rarity-${rarityClass(card.rarity)}`;
  }
  if (previewNumber) previewNumber.textContent = isNew ? `NEW • CARD #${card.number}` : `DUPLICATE • CARD #${card.number}`;
  if (previewIcon) previewIcon.textContent = card.icon;
  if (previewCategory) previewCategory.textContent = card.category.toUpperCase();
  if (previewTitle) previewTitle.textContent = card.title;
  if (previewMessage) previewMessage.textContent = card.lore;
  if (machineStatus) machineStatus.textContent = isNew ? "✨ NEW CARD DISCOVERED!" : "💖 DUPLICATE PULL — STILL SWEET!";
  if (shareSurpriseButton) shareSurpriseButton.disabled = false;
  if (surprisePreview) {
    surprisePreview.classList.remove("is-revealing");
    void surprisePreview.offsetWidth;
    surprisePreview.classList.add("is-revealing");
  }
  updateSurpriseCount();
  renderSweetCollection();
  openPackReveal(card, isNew);
}
function spinSweetMachine() {
  if (isSurpriseSpinning) return;
  isSurpriseSpinning = true;
  if (surpriseButton) {
    surpriseButton.disabled = true;
    surpriseButton.querySelector("span:last-child").textContent = "Dispensing your Sweet Pack...";
  }
  if (machineStatus) machineStatus.textContent = "MIXING THE FIRST EDITION...";
  if (sweetMachine) sweetMachine.classList.add("is-spinning");
  window.setTimeout(() => {
    revealSweetSurprise(weightedSurprise());
    if (sweetMachine) sweetMachine.classList.remove("is-spinning");
    if (surpriseButton) {
      surpriseButton.disabled = false;
      surpriseButton.querySelector("span:last-child").textContent = "Open Another Sweet Pack";
    }
    isSurpriseSpinning = false;
  }, 760);
}
function openCardFromVault(id) {
  const card = SWEET_SURPRISES.find((item) => item.id === id);
  if (!card || !getSweetCollection().includes(id)) return;
  if (collectionDialog?.open) collectionDialog.close();
  prepareFeaturedCard(card, false);
  sweetPack.hidden = true;
  cardRevealPanel.hidden = false;
  packRevealOverlay.hidden = false;
  packRevealOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => featuredSweetCard.focus(), 60);
}
function renderSweetCollection() {
  const collection = getSweetCollection();
  const favorites = getFavorites();
  const unlockedCards = collection.map((id) => SWEET_SURPRISES.find((card) => card.id === id)).filter(Boolean);
  const rareCount = unlockedCards.length;
  const percentage = Math.round((unlockedCards.length / SWEET_SURPRISES.length) * 100);
  if (collectionUnlocked) collectionUnlocked.textContent = String(unlockedCards.length);
  if (collectionTotal) collectionTotal.textContent = String(SWEET_SURPRISES.length);
  if (collectionRare) collectionRare.textContent = String(rareCount);
  if (vaultProgressFill) vaultProgressFill.style.width = `${percentage}%`;
  if (vaultProgressPercent) vaultProgressPercent.textContent = `${percentage}% complete`;
  if (collectionGrid) {
    collectionGrid.innerHTML = SWEET_SURPRISES.map((card) => {
      if (!collection.includes(card.id)) {
        return `<div class="vault-card-slot locked" data-number="#${card.number}" aria-label="Locked card number ${card.number}"><img src="cards/sweet-vault-card-back.png" alt="Locked Sweet Vault card"></div>`;
      }
      const favorite = favorites.includes(card.id);
      return `
        <button class="vault-card-slot" type="button" data-card-id="${card.id}" aria-label="View ${escapeHtml(card.title)}">
          <span class="vault-card-preview official-vault-card">
            ${favorite ? '<span class="vault-favorite-mark">★</span>' : ""}
            <img src="${escapeHtml(card.photo)}" alt="${escapeHtml(card.title)}">
          </span>
        </button>`;
    }).join("");
    collectionGrid.querySelectorAll("[data-card-id]").forEach((button) => {
      button.addEventListener("click", () => openCardFromVault(button.dataset.cardId));
    });
  }
  if (vaultRecentRow) {
    const recent = [...unlockedCards].reverse().slice(0, 4);
    vaultRecentRow.innerHTML = recent.length ? recent.map((card) => `
      <button class="vault-mini-card" type="button" data-recent-card="${card.id}" style="--card-a:${card.a};--card-b:${card.b}">
        <span class="recent-photo official-recent-card"><img src="${escapeHtml(card.photo)}" alt="${escapeHtml(card.title)}"></span>
        <strong>${escapeHtml(card.title)}</strong>
        <small>#${card.number} • ${escapeHtml(card.rarity)}</small>
      </button>`).join("") : '<div class="vault-recent-empty">Your newest cards will appear here after you open a Sweet Pack.</div>';
    vaultRecentRow.querySelectorAll("[data-recent-card]").forEach((button) => {
      button.addEventListener("click", () => openCardFromVault(button.dataset.recentCard));
    });
  }
  updateSurpriseCount();
  renderVaultStats();
}
function openVault() {
  renderSweetCollection();
  if (collectionDialog && !collectionDialog.open) collectionDialog.showModal();
}
function updateFavoriteButton() {
  if (!currentSurprise || !favoriteCardButton) return;
  const favorite = getFavorites().includes(currentSurprise.id);
  favoriteCardButton.textContent = favorite ? "★ Favorited" : "☆ Favorite";
  favoriteCardButton.setAttribute("aria-pressed", String(favorite));
}
function toggleFavorite() {
  if (!currentSurprise) return;
  const favorites = getFavorites();
  const index = favorites.indexOf(currentSurprise.id);
  if (index >= 0) favorites.splice(index, 1);
  else favorites.push(currentSurprise.id);
  saveFavorites(favorites);
  updateFavoriteButton();
  renderSweetCollection();
  showToast(index >= 0 ? "Removed from favorites." : "Added to favorites! ★");
}
async function copyShareText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, field.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    field.remove();
  }
  return copied;
}

function getLatestUnlockedCard() {
  const collection = getSweetCollection();
  const latestId = collection[collection.length - 1];
  return SWEET_SURPRISES.find((card) => card.id === latestId) || null;
}

function openReliableSharePanel(card) {
  const text = `I unlocked Jahntella's ${card.title} #${card.number} — ${card.rarity} 🎴🍭`;
  const url = window.location.href.split("#")[0] + "#surprises";
  const shareText = `${text} ${url}`;

  let panel = document.getElementById("reliableSharePanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "reliableSharePanel";
    panel.className = "reliable-share-panel";
    panel.innerHTML = `
      <div class="reliable-share-card" role="dialog" aria-modal="true" aria-labelledby="sharePanelTitle">
        <button class="reliable-share-close" type="button" aria-label="Close share options">×</button>
        <small>SHARE YOUR SWEET DROP</small>
        <h3 id="sharePanelTitle">Choose how to share</h3>
        <p id="sharePanelMessage"></p>
        <div class="reliable-share-actions">
          <button type="button" data-share-action="copy">Copy message</button>
          <a data-share-action="email" href="#">Email</a>
          <a data-share-action="facebook" href="#" target="_blank" rel="noopener">Facebook</a>
          <a data-share-action="x" href="#" target="_blank" rel="noopener">X / Twitter</a>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.addEventListener("click", (event) => {
      if (event.target === panel || event.target.closest(".reliable-share-close")) {
        panel.classList.remove("visible");
      }
    });

    panel.querySelector('[data-share-action="copy"]').addEventListener("click", async () => {
      const value = panel.dataset.shareText || "";
      try {
        const copied = await copyShareText(value);
        showToast(copied ? "Share message copied! 💖" : "Select and copy the message.");
      } catch (error) {
        window.prompt("Copy and share this message:", value);
      }
    });
  }

  panel.dataset.shareText = shareText;
  panel.querySelector("#sharePanelMessage").textContent = text;
  panel.querySelector('[data-share-action="email"]').href =
    `mailto:?subject=${encodeURIComponent("My Jahntella Sweet Drop")}&body=${encodeURIComponent(shareText)}`;
  panel.querySelector('[data-share-action="facebook"]').href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
  panel.querySelector('[data-share-action="x"]').href =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  panel.classList.add("visible");
}

async function shareCurrentCard() {
  const card = currentSurprise || getLatestUnlockedCard();

  if (!card) {
    showToast("Open a Sweet Pack first, then share your drop! 🎁");
    surpriseButton?.focus();
    return;
  }

  currentSurprise = card;
  openReliableSharePanel(card);
}
function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}
async function downloadCurrentCard() {
  if (!currentSurprise) return;
  try {
    const response = await fetch(currentSurprise.photo);
    if (!response.ok) throw new Error("Artwork could not be loaded.");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.download = `Jahntella_${currentSurprise.number}_${currentSurprise.title.replace(/\s+/g, "_")}.png`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1200);
    showToast("Official Jahntella card downloaded! ⬇");
  } catch (error) {
    console.error(error);
    showToast("The card could not be downloaded. Please try again.");
  }
}
function resetSweetCollection() {
  const shouldReset = window.confirm("Reset all cards, favorites, pack statistics, and unlock dates saved in this browser?");
  if (!shouldReset) return;
  localStorage.removeItem(SURPRISE_STORAGE_KEY);
  localStorage.removeItem(FAVORITES_STORAGE_KEY);
  localStorage.removeItem(UNLOCK_DATES_KEY);
  localStorage.removeItem(VAULT_STATS_KEY);
  currentSurprise = null;
  renderSweetCollection();
  if (previewRarity) {previewRarity.textContent="READY";previewRarity.className="surprise-rarity rarity-rare";}
  if (previewNumber) previewNumber.textContent="SWEET DROP";
  if (previewIcon) previewIcon.textContent="🎁";
  if (previewCategory) previewCategory.textContent="YOUR NEXT LITTLE DELIGHT";
  if (previewTitle) previewTitle.textContent="What will you unlock?";
  if (previewMessage) previewMessage.textContent="Push the glowing button and let Sweetville choose a collectible card for you.";
  if (machineStatus) machineStatus.textContent="READY FOR A SWEET PACK?";
  if (shareSurpriseButton) shareSurpriseButton.disabled=false;
  if (surpriseButton) surpriseButton.querySelector("span:last-child").textContent="Open a Sweet Pack";
  showToast("Sweet Vault reset.");
}

function updateCardTilt(event) {
  if (!featuredSweetCard?.classList.contains("is-floating") || featuredSweetCard.classList.contains("is-flipped")) return;
  const rect = featuredSweetCard.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  featuredSweetCard.style.setProperty("--tilt-y", `${(x - .5) * 12}deg`);
  featuredSweetCard.style.setProperty("--tilt-x", `${(.5 - y) * 10}deg`);
}
function resetCardTilt() {
  featuredSweetCard?.style.setProperty("--tilt-x", "0deg");
  featuredSweetCard?.style.setProperty("--tilt-y", "0deg");
}

surpriseButton?.addEventListener("click", spinSweetMachine);
openCollectionButton?.addEventListener("click", openVault);
floatingVaultButton?.addEventListener("click", openVault);
shareSurpriseButton?.addEventListener("click", shareCurrentCard);
resetCollectionButton?.addEventListener("click", resetSweetCollection);
vaultResetButton?.addEventListener("click", resetSweetCollection);
sweetPack?.addEventListener("click", openPack);
sweetPack?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {event.preventDefault();openPack();}
});
featuredSweetCard?.addEventListener("click", () => featuredSweetCard.classList.toggle("is-flipped"));
sweetCardScene?.addEventListener("pointermove", updateCardTilt);
sweetCardScene?.addEventListener("pointerleave", resetCardTilt);
packCloseButton?.addEventListener("click", closePackReveal);
downloadCardButton?.addEventListener("click", downloadCurrentCard);
favoriteCardButton?.addEventListener("click", toggleFavorite);
shareCardButton?.addEventListener("click", shareCurrentCard);
revealVaultButton?.addEventListener("click", () => {closePackReveal();openVault();});
packRevealOverlay?.addEventListener("click", (event) => {if (event.target === packRevealOverlay) closePackReveal();});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && packRevealOverlay && !packRevealOverlay.hidden) closePackReveal();
});

updateSurpriseCount();
renderSweetCollection();


// Build 4.2: Fun Dipp candy-stick interaction.
document.querySelectorAll(".fun-dipp-stick").forEach((stick) => {
  stick.addEventListener("click", () => {
    const spotlight = stick.closest(".fun-dipp-spotlight");
    if (!spotlight) return;
    spotlight.classList.remove("dipping");
    void spotlight.offsetWidth;
    spotlight.classList.add("dipping");
    window.setTimeout(() => spotlight.classList.remove("dipping"), 850);
  });
});


// =========================================================
// BUILD 4.3 — EMBEDDED JAHNTELLA MUSIC PLAYER
// =========================================================
(() => {
  const tracks = {
    "fun-dipp": {
      title: "Fun Dipp",
      audio: document.getElementById("audioFunDipp"),
      icon: "🍭"
    },
    "pink-lips": {
      title: "Fun Dipp (Pink Lips Remix)",
      audio: document.getElementById("audioPinkLips"),
      icon: "💋"
    }
  };

  const player = document.getElementById("jahntellaPlayer");
  const toggle = document.getElementById("playerToggle");
  const close = document.getElementById("playerClose");
  const previous = document.getElementById("playerPrevious");
  const next = document.getElementById("playerNext");
  const trackName = document.getElementById("playerTrack");
  const status = document.getElementById("playerStatus");
  const progress = document.getElementById("playerProgress");
  const current = document.getElementById("playerCurrent");
  const duration = document.getElementById("playerDuration");
  const art = player?.querySelector(".player-art");

  const trackOrder = ["fun-dipp", "pink-lips"];
  let activeKey = "fun-dipp";
  let activeAudio = tracks[activeKey].audio;
  let fadeTimer = null;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const fadeAudio = (audio, targetVolume, duration = 420, onComplete) => {
    if (!audio) return;
    window.clearInterval(fadeTimer);
    const startVolume = Number.isFinite(audio.volume) ? audio.volume : 1;
    const steps = 14;
    let step = 0;
    fadeTimer = window.setInterval(() => {
      step += 1;
      const progress = step / steps;
      audio.volume = Math.max(0, Math.min(1, startVolume + ((targetVolume - startVolume) * progress)));
      if (step >= steps) {
        window.clearInterval(fadeTimer);
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, duration / steps);
  };

  const setActiveTrack = (key) => {
    if (!tracks[key]) return;
    const incomingAudio = tracks[key].audio;

    if (activeAudio && activeAudio !== incomingAudio) {
      const outgoingAudio = activeAudio;
      fadeAudio(outgoingAudio, 0, 360, () => {
        outgoingAudio.pause();
        outgoingAudio.currentTime = 0;
        outgoingAudio.volume = 1;
      });
      incomingAudio.volume = 0;
    }

    activeKey = key;
    activeAudio = incomingAudio;
    trackName.textContent = tracks[key].title;
    art.textContent = tracks[key].icon;
    player.classList.add("visible");
    document.body.classList.add("music-player-open");
    updatePlayer();
  };

  const updateReleasePills = () => {
    document.querySelectorAll(".release-tab[data-audio-track]").forEach((pill) => {
      const isCurrent = pill.dataset.audioTrack === activeKey;
      pill.classList.toggle("is-playing", isCurrent && !activeAudio.paused);
      pill.classList.toggle("is-paused", isCurrent && activeAudio.paused);
      pill.setAttribute(
        "aria-label",
        `${activeAudio.paused || !isCurrent ? "Play" : "Pause"} ${pill.dataset.audioTrack === "pink-lips" ? "Pink Lips Remix" : "Fun Dipp"}`
      );
    });

    document.querySelectorAll(".release-panel[data-release]").forEach((panel) => {
      const isCurrent = panel.dataset.release === activeKey;
      panel.classList.toggle("is-playing", isCurrent && !activeAudio.paused);
      panel.classList.toggle("is-paused", isCurrent && activeAudio.paused);
    });

    player?.classList.toggle("is-playing", !activeAudio.paused);
  };

  const updatePlayer = () => {
    if (!activeAudio) return;
    toggle.textContent = activeAudio.paused ? "▶" : "Ⅱ";
    status.textContent = activeAudio.paused ? "PAUSED" : "NOW PLAYING";
    current.textContent = formatTime(activeAudio.currentTime);
    duration.textContent = formatTime(activeAudio.duration);
    progress.value = activeAudio.duration
      ? String((activeAudio.currentTime / activeAudio.duration) * 100)
      : "0";
    updateReleasePills();
  };

  const playTrack = async (key, forcePlay = false) => {
    const switchingTracks = key !== activeKey;
    setActiveTrack(key);

    try {
      if (activeAudio.paused || switchingTracks || forcePlay) {
        await activeAudio.play();
        if (activeAudio.volume < 1) fadeAudio(activeAudio, 1, 480);
      } else {
        fadeAudio(activeAudio, 0, 240, () => {
          activeAudio.pause();
          activeAudio.volume = 1;
          updatePlayer();
        });
      }
      updatePlayer();
    } catch (error) {
      status.textContent = "TAP PLAY TO START";
      updatePlayer();
    }
  };

  const skipTrack = (direction) => {
    const currentIndex = trackOrder.indexOf(activeKey);
    const nextIndex = (currentIndex + direction + trackOrder.length) % trackOrder.length;
    const nextKey = trackOrder[nextIndex];

    document.querySelectorAll(".release-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.release === nextKey);
    });
    document.querySelectorAll(".release-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.target === nextKey);
    });

    playTrack(nextKey, true);
  };

  document.querySelectorAll("[data-audio-track]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      playTrack(control.dataset.audioTrack);
    });
  });

  toggle?.addEventListener("click", () => playTrack(activeKey));
  previous?.addEventListener("click", () => skipTrack(-1));
  next?.addEventListener("click", () => skipTrack(1));

  close?.addEventListener("click", () => {
    activeAudio?.pause();
    player.classList.remove("visible");
    document.body.classList.remove("music-player-open");
    updatePlayer();
  });

  progress?.addEventListener("input", () => {
    if (!activeAudio?.duration) return;
    activeAudio.currentTime = (Number(progress.value) / 100) * activeAudio.duration;
  });

  Object.values(tracks).forEach(({ audio }) => {
    audio?.addEventListener("timeupdate", updatePlayer);
    audio?.addEventListener("loadedmetadata", updatePlayer);
    audio?.addEventListener("play", updatePlayer);
    audio?.addEventListener("pause", updatePlayer);
    audio?.addEventListener("ended", () => {
      audio.currentTime = 0;
      updatePlayer();
    });
  });
})();

shareSurpriseButton?.removeAttribute("disabled");


// =========================================================
// BUILD 4.4.6 — CONTACT EMAIL
// =========================================================
document.getElementById("copyBusinessEmail")?.addEventListener("click", async () => {
  const email = "jahntella@gmail.com";

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      const input = document.createElement("textarea");
      input.value = email;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    if (typeof showToast === "function") {
      showToast("Email address copied! 📧");
    } else {
      window.alert("Copied: " + email);
    }
  } catch (error) {
    window.prompt("Copy this email address:", email);
  }
});
(() => {
  'use strict';

  window.JAHNTELLA_BUILD = '5.1-MUSIC-EXPERIENCE';

  const section = document.getElementById('music');
  if (!section) return;

  const stylesheet = document.createElement('style');
  stylesheet.textContent = `
    .music-section-v51{position:relative;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 18% 20%,rgba(255,79,163,.19),transparent 28%),radial-gradient(circle at 86% 70%,rgba(139,61,255,.18),transparent 31%)}
    .music-section-v51:before,.music-section-v51:after{content:"♪";position:absolute;z-index:-1;font-size:clamp(8rem,18vw,18rem);opacity:.035;animation:v51Drift 12s ease-in-out infinite}
    .music-section-v51:before{left:-2%;top:8%}.music-section-v51:after{content:"✦";right:2%;bottom:2%;animation-delay:-5s}
    @keyframes v51Drift{50%{transform:translateY(-22px) rotate(7deg)}}
    .music-v51-heading{text-align:center;margin-inline:auto;max-width:850px}
    .music-v51-shell{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:28px;align-items:stretch}
    .music-v51-panel{position:relative;border:1px solid rgba(255,255,255,.14);border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 35px 90px rgba(0,0,0,.34);backdrop-filter:blur(16px);overflow:hidden}
    .music-v51-art-panel{display:grid;place-items:center;min-height:640px;padding:48px}
    .music-v51-glow{position:absolute;width:68%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,79,163,.38),rgba(139,61,255,.13) 45%,transparent 72%);filter:blur(15px);animation:v51Glow 4s ease-in-out infinite}
    @keyframes v51Glow{50%{transform:scale(1.08);opacity:.78}}
    .music-v51-vinyl{position:relative;width:min(470px,76vw);aspect-ratio:1;border-radius:50%;padding:36px;background:repeating-radial-gradient(circle,#171119 0 4px,#08060a 5px 8px);box-shadow:0 30px 80px rgba(0,0,0,.58),0 0 70px rgba(255,79,163,.2);transition:transform .35s}
    .music-v51-vinyl.playing{animation:v51Spin 7s linear infinite}
    @keyframes v51Spin{to{transform:rotate(360deg)}}
    .music-v51-vinyl img{width:100%;height:100%;object-fit:cover;border-radius:50%;box-shadow:inset 0 0 0 5px rgba(255,255,255,.22)}
    .music-v51-vinyl:after{content:"";position:absolute;inset:46%;border-radius:50%;background:#fff;box-shadow:0 0 0 8px rgba(255,79,163,.85),0 0 24px rgba(255,79,163,.8)}
    .music-v51-art-caption{position:absolute;left:26px;right:26px;bottom:24px;display:flex;justify-content:space-between;align-items:end;gap:20px;padding:18px 20px;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:rgba(9,0,15,.72);backdrop-filter:blur(14px)}
    .music-v51-art-caption small,.music-v51-kicker{display:block;color:#ff90c7;font-size:.73rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
    .music-v51-art-caption strong{display:block;margin-top:4px;font-family:"Playfair Display",serif;font-size:clamp(1.7rem,3vw,2.5rem)}
    .music-v51-art-caption span{font-size:.8rem;color:#d8cfdd;text-align:right}
    .music-v51-player{padding:42px;display:flex;flex-direction:column;justify-content:center}
    .music-v51-player h3{margin:10px 0 6px;font-family:"Playfair Display",serif;font-size:clamp(3rem,6vw,5.6rem);line-height:.92}
    .music-v51-subtitle{margin:0 0 22px;color:#d7ccdc;line-height:1.7}
    .music-v51-now{display:flex;align-items:center;gap:10px;margin:10px 0 18px;color:#fff;font-weight:700}
    .music-v51-dot{width:9px;height:9px;border-radius:50%;background:#ff4fa3;box-shadow:0 0 14px #ff4fa3;animation:v51Pulse 1.2s infinite}
    @keyframes v51Pulse{50%{opacity:.35;transform:scale(.75)}}
    .music-v51-controls{display:flex;align-items:center;gap:14px;margin:12px 0 18px}
    .music-v51-play{width:68px;height:68px;border:0;border-radius:50%;cursor:pointer;color:white;background:linear-gradient(135deg,#ff4fa3,#8b3dff);font-size:1.35rem;box-shadow:0 18px 42px rgba(255,79,163,.35);transition:.25s}
    .music-v51-play:hover{transform:scale(1.06)}
    .music-v51-time{font-variant-numeric:tabular-nums;color:#d8cfdd;font-size:.86rem}
    .music-v51-progress{width:100%;height:8px;accent-color:#ff4fa3;cursor:pointer}
    .music-v51-volume-row{display:flex;align-items:center;gap:12px;margin:12px 0 22px;color:#d8cfdd}
    .music-v51-volume-row input{width:150px;accent-color:#ff4fa3}
    .music-v51-visualizer{height:48px;display:flex;align-items:end;gap:5px;margin:8px 0 22px}
    .music-v51-visualizer i{display:block;width:7px;height:18%;border-radius:999px;background:linear-gradient(#fff,#ff4fa3,#8b3dff);animation:v51Bars .75s ease-in-out infinite alternate;animation-play-state:paused}
    .music-v51-visualizer.active i{animation-play-state:running}
    .music-v51-visualizer i:nth-child(2n){animation-delay:-.2s}.music-v51-visualizer i:nth-child(3n){animation-delay:-.45s}.music-v51-visualizer i:nth-child(5n){animation-delay:-.6s}
    @keyframes v51Bars{to{height:100%}}
    .music-v51-actions{display:flex;flex-wrap:wrap;gap:10px}
    .music-v51-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:28px}
    .music-v51-info{padding:32px;min-height:290px}
    .music-v51-info h3{margin:8px 0 12px;font-family:"Playfair Display",serif;font-size:2rem}
    .music-v51-info p{color:#d2c7d7;line-height:1.72}
    .music-v51-video{grid-column:span 2;min-height:360px;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 50% 30%,rgba(255,79,163,.2),transparent 40%),linear-gradient(135deg,rgba(139,61,255,.14),rgba(255,79,163,.08))}
    .music-v51-video-icon{font-size:4rem;filter:drop-shadow(0 0 20px rgba(255,79,163,.7))}
    .music-v51-streaming{margin-top:28px;padding:34px}
    .music-v51-streaming h3{margin:0 0 22px;font-family:"Playfair Display",serif;font-size:2.2rem;text-align:center}
    .music-v51-stream-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
    .music-v51-stream-card{min-height:110px;display:grid;place-items:center;gap:4px;padding:16px;border:1px solid rgba(255,255,255,.13);border-radius:20px;background:rgba(255,255,255,.035);text-align:center;transition:.25s}
    .music-v51-stream-card:hover{transform:translateY(-5px);border-color:#ff4fa3;box-shadow:0 18px 40px rgba(255,79,163,.17)}
    .music-v51-stream-card b{font-size:1rem}.music-v51-stream-card span{font-size:.75rem;color:#cfc3d4}
    .music-v51-cta{margin-top:28px;padding:42px;text-align:center;background:linear-gradient(135deg,rgba(255,79,163,.17),rgba(139,61,255,.16))}
    .music-v51-cta h3{margin:8px 0 10px;font-family:"Playfair Display",serif;font-size:clamp(2rem,4vw,3.5rem)}
    .music-v51-cta p{color:#d8cfdd;margin-bottom:22px}
    @media(max-width:980px){.music-v51-shell{grid-template-columns:1fr}.music-v51-art-panel{min-height:540px}.music-v51-stream-grid{grid-template-columns:repeat(2,1fr)}.music-v51-stream-card:last-child{grid-column:span 2}}
    @media(max-width:680px){.music-v51-art-panel{padding:25px;min-height:430px}.music-v51-vinyl{width:min(330px,78vw);padding:26px}.music-v51-art-caption{left:14px;right:14px;bottom:14px}.music-v51-player,.music-v51-info,.music-v51-streaming,.music-v51-cta{padding:25px}.music-v51-grid{grid-template-columns:1fr}.music-v51-video{grid-column:auto}.music-v51-player h3{font-size:3.4rem}}
    @media(prefers-reduced-motion:reduce){.music-section-v51:before,.music-section-v51:after,.music-v51-glow,.music-v51-vinyl.playing,.music-v51-dot,.music-v51-visualizer i{animation:none!important}}
  `;
  document.head.appendChild(stylesheet);

  section.classList.add('music-section-v51');
  section.innerHTML = `
    <header class="section-heading music-v51-heading reveal visible">
      <p class="eyebrow">THE SWEET ERA</p>
      <h2>Turn up <em>something sweet.</em></h2>
      <p>Step inside the official Fun Dipp music experience. Listen, explore and keep the soundtrack playing while you travel through Jahntella's world.</p>
    </header>

    <div class="music-v51-shell">
      <div class="music-v51-panel music-v51-art-panel reveal visible">
        <div class="music-v51-glow" aria-hidden="true"></div>
        <div class="music-v51-vinyl" id="v51Vinyl"><img src="fun-dipp-cover.png" alt="Fun Dipp cover artwork"></div>
        <div class="music-v51-art-caption">
          <div><small>FEATURED SINGLE</small><strong>Fun Dipp</strong></div>
          <span>Sweet. Bold.<br>Addictive.</span>
        </div>
      </div>

      <div class="music-v51-panel music-v51-player reveal visible">
        <span class="music-v51-kicker">NOW PLAYING</span>
        <h3>Fun Dipp</h3>
        <p class="music-v51-subtitle">Bright dance-pop, playful confidence and a chorus made to stay in your head.</p>
        <div class="music-v51-now"><i class="music-v51-dot"></i><span id="v51Status">Ready to dip in</span></div>
        <div class="music-v51-visualizer" id="v51Visualizer" aria-hidden="true">${'<i></i>'.repeat(24)}</div>
        <input class="music-v51-progress" id="v51Progress" type="range" min="0" max="100" value="0" aria-label="Song progress">
        <div class="music-v51-controls">
          <button class="music-v51-play" id="v51Play" type="button" aria-label="Play Fun Dipp">▶</button>
          <span class="music-v51-time"><span id="v51Current">0:00</span> / <span id="v51Duration">0:00</span></span>
        </div>
        <label class="music-v51-volume-row">🔊 Volume <input id="v51Volume" type="range" min="0" max="1" step="0.01" value="0.85"></label>
        <div class="music-v51-actions">
          <a class="button button-primary" href="https://open.spotify.com/search/Jahntella" target="_blank" rel="noopener">Spotify ↗</a>
          <a class="button button-glass" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener">YouTube ↗</a>
          <button class="button button-glass" id="v51Share" type="button">Share Song</button>
        </div>
      </div>
    </div>

    <div class="music-v51-grid">
      <article class="music-v51-panel music-v51-info reveal visible"><span class="music-v51-kicker">LYRICS</span><h3>Sing it sweet.</h3><p>Official lyrics are coming soon. Join The Sweet List and be first to unlock them when they drop.</p><a class="button button-glass" href="#sweet-list">Join The Sweet List</a></article>
      <article class="music-v51-panel music-v51-info reveal visible"><span class="music-v51-kicker">BEHIND THE SONG</span><h3>Every hook has a story.</h3><p>Come back for the inspiration, studio memories and creative details behind Fun Dipp.</p><a class="button button-glass" href="#sweet-list">Get the story first</a></article>
      <article class="music-v51-panel music-v51-video reveal visible"><div><div class="music-v51-video-icon">▶</div><span class="music-v51-kicker">OFFICIAL MUSIC VIDEO</span><h3>Premiering Soon</h3><p>The lights are warming up. Follow Jahntella on YouTube so you do not miss the premiere.</p><a class="button button-primary" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener">Visit YouTube ↗</a></div></article>
    </div>

    <div class="music-v51-panel music-v51-streaming reveal visible">
      <h3>Listen your way.</h3>
      <div class="music-v51-stream-grid">
        <a class="music-v51-stream-card" href="https://open.spotify.com/search/Jahntella" target="_blank" rel="noopener"><b>Spotify</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://music.apple.com/us/search?term=Jahntella" target="_blank" rel="noopener"><b>Apple Music</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://www.youtube.com/@Jahntella" target="_blank" rel="noopener"><b>YouTube Music</b><span>Open channel ↗</span></a>
        <a class="music-v51-stream-card" href="https://music.amazon.com/search/Jahntella" target="_blank" rel="noopener"><b>Amazon Music</b><span>Open platform ↗</span></a>
        <a class="music-v51-stream-card" href="https://soundcloud.com/search?q=Jahntella" target="_blank" rel="noopener"><b>SoundCloud</b><span>Open platform ↗</span></a>
      </div>
    </div>

    <div class="music-v51-panel music-v51-cta reveal visible"><span class="music-v51-kicker">NEVER MISS A RELEASE</span><h3>Join The Sweet List.</h3><p>Get early music, behind-the-scenes moments and exclusive drops delivered first.</p><a class="button button-primary" href="#sweet-list">Join The Sweet List</a></div>
  `;

  const audio = document.getElementById('audioFunDipp');
  const play = document.getElementById('v51Play');
  const progress = document.getElementById('v51Progress');
  const volume = document.getElementById('v51Volume');
  const current = document.getElementById('v51Current');
  const duration = document.getElementById('v51Duration');
  const status = document.getElementById('v51Status');
  const vinyl = document.getElementById('v51Vinyl');
  const visualizer = document.getElementById('v51Visualizer');

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const sync = () => {
    if (!audio) return;
    const isPlaying = !audio.paused;
    play.textContent = isPlaying ? '❚❚' : '▶';
    play.setAttribute('aria-label', isPlaying ? 'Pause Fun Dipp' : 'Play Fun Dipp');
    status.textContent = isPlaying ? 'Fun Dipp is playing' : (audio.currentTime > 0 ? 'Paused' : 'Ready to dip in');
    vinyl.classList.toggle('playing', isPlaying);
    visualizer.classList.toggle('active', isPlaying);
    current.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  };

  if (audio) {
    audio.volume = Number(volume.value);
    ['play','pause','timeupdate','loadedmetadata','durationchange','ended'].forEach(evt => audio.addEventListener(evt, sync));
    play.addEventListener('click', () => {
      document.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); });
      if (audio.paused) {
        audio.play().catch(() => { status.textContent = 'Tap play again to begin'; });
      } else audio.pause();
    });
    progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration; });
    volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
    sync();
  } else {
    play.disabled = true;
    status.textContent = 'Audio file is not connected';
  }

  document.getElementById('v51Share').addEventListener('click', async () => {
    const shareData = { title: 'Fun Dipp by Jahntella', text: 'I am listening to Fun Dipp in the World of Jahntella 🍭', url: window.location.href.split('#')[0] + '#music' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        status.textContent = 'Share link copied!';
      }
    } catch (_) {}
  });

  const badge = document.getElementById('buildBadge');
  if (badge) badge.textContent = 'BUILD 5.1';
})();
(() => {
  'use strict';

  const VERSION = '5.2';
  const places = {
    'Donut District': {
      icon: '🍩', kicker: 'SPRINKLES START HERE', accent: 'donut',
      title: 'Donut <em>District</em>',
      description: 'Step into Sweetville’s warmest bakery, where glossy pink boxes, fresh donuts and flying sprinkles turn every visit into a tiny celebration.',
      features: [['Daily Treat','A fresh sweet message'],['Sprinkle Rush','Tap to fill the meter'],['Hidden Reward','Find the golden donut'],['Bakery Mood','Warm, playful and pink']],
      primary: 'Start Sprinkle Rush', secondary: 'Open a Sweet Fortune'
    },
    'Melody Studio': {
      icon: '🎵', kicker: 'WHERE HOOKS COME ALIVE', accent: 'studio',
      title: 'Melody <em>Studio</em>',
      description: 'Enter the creative room where melodies sparkle, speakers pulse and the next unforgettable Jahntella moment begins taking shape.',
      features: [['Now Playing','Fun Dipp'],['Studio Diary','A note from the session'],['Mixing Desk','Tap the glowing pads'],['Secret Sound','Unlock a studio chime']],
      primary: 'Play Studio Pads', secondary: 'Read Studio Diary'
    },
    'Neon Lounge': {
      icon: '💋', kicker: 'THE SWEET AFTER DARK', accent: 'neon',
      title: 'Neon <em>Lounge</em>',
      description: 'Slip past the velvet rope into Sweetville after dark—neon reflections, floating hearts, confident energy and a little trouble.',
      features: [['VIP Mode','Turn the lights down'],['Photo Moment','Neon-ready backdrop'],['Fan Wall','Sweet messages coming soon'],['Hidden Kiss','Catch the glowing lips']],
      primary: 'Enter Night Mode', secondary: 'Send a Neon Kiss'
    },
    'Pink Café': {
      icon: '☕', kicker: 'SIP. TALK. DREAM.', accent: 'cafe',
      title: 'Pink <em>Café</em>',
      description: 'Take a cozy seat for coffee, tiny journal notes, daily questions and behind-the-scenes thoughts from the World of Sweet.',
      features: [['Today’s Note','Choose joy on purpose'],['Question','What made you smile?'],['Coffee Mood','Sweet with extra sparkle'],['Fan Spotlight','Opening in a future update']],
      primary: 'Reveal Today’s Note', secondary: 'Leave a Sweet Thought'
    },
    'Sparkle Lake': {
      icon: '✨', kicker: 'MAKE A LITTLE WISH', accent: 'lake',
      title: 'Sparkle <em>Lake</em>',
      description: 'A quiet magical corner filled with fireflies, wishing stars and secret rewards for curious Sweeties who look closely.',
      features: [['Wishing Stars','Catch three to make a wish'],['Firefly Glow','Tap the lake lights'],['Secret Reward','A surprise waits nearby'],['Seasonal Magic','The lake changes over time']],
      primary: 'Make a Wish', secondary: 'Release Fireflies'
    }
  };

  const css = `
  :root{--sv52-pink:#ff4fa3;--sv52-hot:#ff1684;--sv52-gold:#ffd76a}
  .sweetville-section{overflow:hidden;position:relative;isolation:isolate}.sweetville-section.v52-ready{min-height:100vh}.sweetville-place{overflow:hidden}.sweetville-place::after{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.2) 49%,transparent 60%);transform:translateX(-70%) rotate(8deg);transition:transform .8s ease}.sweetville-place:hover::after{transform:translateX(70%) rotate(8deg)}
  .sv52-overlay{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:18px;background:rgba(4,0,10,.82);backdrop-filter:blur(15px);opacity:0;visibility:hidden;transition:.28s ease}.sv52-overlay.open{opacity:1;visibility:visible}.sv52-world{width:min(1120px,96vw);height:min(760px,92vh);border:1px solid rgba(255,255,255,.2);border-radius:30px;overflow:hidden;background:radial-gradient(circle at 80% 10%,rgba(255,79,163,.25),transparent 35%),linear-gradient(145deg,#160520,#08000e);box-shadow:0 35px 120px rgba(0,0,0,.65),0 0 60px rgba(255,79,163,.2);display:grid;grid-template-rows:auto 1fr;transform:scale(.96) translateY(12px);transition:.3s ease;color:#fff}.sv52-overlay.open .sv52-world{transform:none}.sv52-topbar{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(10,0,17,.78)}.sv52-brand{display:flex;align-items:center;gap:12px}.sv52-brand-icon{font-size:30px;filter:drop-shadow(0 0 12px rgba(255,79,163,.6))}.sv52-brand small{display:block;letter-spacing:.15em;color:#ff9ed0;font-weight:800}.sv52-brand strong{font-size:20px}.sv52-close,.sv52-back,.sv52-action{border:0;cursor:pointer;color:#fff;font:inherit;font-weight:800}.sv52-close{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.1);font-size:25px}.sv52-close:hover,.sv52-back:hover{background:rgba(255,255,255,.18)}.sv52-stage{position:relative;overflow:auto}.sv52-scene{min-height:100%;padding:clamp(22px,4vw,52px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:30px;align-items:center;animation:sv52In .45s ease}.sv52-copy h3{font-family:"Playfair Display",serif;font-size:clamp(38px,6vw,72px);line-height:.95;margin:8px 0 18px}.sv52-copy h3 em{color:#ff75b9;font-style:normal}.sv52-kicker{font-size:12px;letter-spacing:.2em;font-weight:900;color:#ff93ca}.sv52-copy p{max-width:640px;color:rgba(255,255,255,.78);font-size:17px;line-height:1.7}.sv52-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.sv52-action{padding:13px 18px;border-radius:999px;background:linear-gradient(135deg,var(--sv52-hot),#ff7bc0);box-shadow:0 10px 30px rgba(255,22,132,.28)}.sv52-action.alt{background:rgba(255,255,255,.1);box-shadow:none;border:1px solid rgba(255,255,255,.15)}.sv52-card{position:relative;min-height:390px;border-radius:28px;padding:24px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.045));box-shadow:inset 0 1px rgba(255,255,255,.12),0 24px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}.sv52-card::before{content:"";position:absolute;width:230px;height:230px;border-radius:50%;right:-70px;top:-70px;background:radial-gradient(circle,rgba(255,255,255,.3),transparent 68%);animation:sv52Pulse 3s ease-in-out infinite}.sv52-hero-icon{font-size:110px;text-align:center;filter:drop-shadow(0 18px 20px rgba(0,0,0,.25));animation:sv52Float 3s ease-in-out infinite}.sv52-mini{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.sv52-mini div{padding:13px;border-radius:16px;background:rgba(0,0,0,.18);font-size:13px}.sv52-mini strong{display:block;color:#ffb4d9;margin-bottom:3px}.sv52-toast{position:fixed;left:50%;bottom:28px;z-index:100002;transform:translate(-50%,20px);padding:13px 18px;border-radius:999px;background:#fff;color:#250019;font-weight:900;opacity:0;pointer-events:none;transition:.25s}.sv52-toast.show{opacity:1;transform:translate(-50%,0)}.sv52-sprinkle{position:absolute;top:-30px;font-size:20px;animation:sv52Fall 2.4s linear forwards;pointer-events:none}.sv52-night .sv52-world{background:radial-gradient(circle at 20% 20%,rgba(119,0,255,.32),transparent 38%),linear-gradient(145deg,#08000e,#18001d)}.sv52-meter{height:12px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:14px}.sv52-meter span{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff4fa3,#ffd76a);transition:width .25s}.sv52-diary{font-family:"Sacramento",cursive;font-size:31px;line-height:1.25;color:#ffd9ed}.sv52-star{position:absolute;border:0;background:none;color:#fff;font-size:25px;cursor:pointer;animation:sv52Twinkle 1.6s ease-in-out infinite}
  @keyframes sv52In{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes sv52Float{50%{transform:translateY(-12px) rotate(3deg)}}@keyframes sv52Pulse{50%{transform:scale(1.12);opacity:.65}}@keyframes sv52Fall{to{transform:translateY(110vh) rotate(720deg);opacity:.2}}@keyframes sv52Twinkle{50%{transform:scale(1.4);text-shadow:0 0 18px #fff}}@media(max-width:760px){.sv52-world{height:94vh;border-radius:22px}.sv52-scene{grid-template-columns:1fr;padding:28px 18px 40px}.sv52-card{min-height:300px}.sv52-copy h3{font-size:43px}.sv52-topbar{padding:12px}.sv52-brand strong{font-size:16px}}@media(prefers-reduced-motion:reduce){.sv52-overlay *{animation:none!important;transition:none!important}}
  `;

  function toast(message) {
    let el = document.querySelector('.sv52-toast');
    if (!el) { el = document.createElement('div'); el.className = 'sv52-toast'; document.body.appendChild(el); }
    el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function featureMarkup(features) {
    return features.map(([a,b]) => `<div><strong>${a}</strong>${b}</div>`).join('');
  }

  function render(placeName) {
    const p = places[placeName]; if (!p) return;
    const stage = document.querySelector('.sv52-stage');
    stage.innerHTML = `<div class="sv52-scene sv52-${p.accent}"><div class="sv52-copy"><span class="sv52-kicker">${p.kicker}</span><h3>${p.title}</h3><p>${p.description}</p><div class="sv52-actions"><button class="sv52-action" data-v52-primary>${p.primary}</button><button class="sv52-action alt" data-v52-secondary>${p.secondary}</button></div></div><div class="sv52-card"><div class="sv52-hero-icon">${p.icon}</div><div class="sv52-mini">${featureMarkup(p.features)}</div><div class="sv52-meter" aria-hidden="true"><span></span></div></div></div>`;
    const primary = stage.querySelector('[data-v52-primary]');
    const secondary = stage.querySelector('[data-v52-secondary]');
    primary.addEventListener('click', () => interact(placeName, true));
    secondary.addEventListener('click', () => interact(placeName, false));
  }

  function sprinkleBurst(count=30) {
    const overlay = document.querySelector('.sv52-overlay');
    const icons = ['•','✦','♥','★','🍬'];
    for(let i=0;i<count;i++){
      const s=document.createElement('span'); s.className='sv52-sprinkle'; s.textContent=icons[Math.floor(Math.random()*icons.length)]; s.style.left=Math.random()*100+'%'; s.style.animationDelay=Math.random()*.4+'s'; overlay.appendChild(s); setTimeout(()=>s.remove(),3000);
    }
  }

  function interact(name, primary) {
    const overlay = document.querySelector('.sv52-overlay');
    const meter = overlay.querySelector('.sv52-meter span');
    if(name==='Donut District'){
      if(primary){ let n=0; sprinkleBurst(); const timer=setInterval(()=>{n+=10; if(meter) meter.style.width=n+'%'; if(n>=100){clearInterval(timer);toast('Golden donut unlocked! 🍩✨');localStorage.setItem('jahntella_v52_donut','1');}},90);} else toast(['Your sweetness is your superpower.','Today deserves extra sprinkles.','A bright moment is on its way.'][Math.floor(Math.random()*3)]);
    } else if(name==='Melody Studio'){
      if(primary){ toast('Studio pads activated 🎵'); [440,554,659].forEach((f,i)=>setTimeout(()=>tone(f),i*160)); if(meter) meter.style.width='78%'; } else { const card=overlay.querySelector('.sv52-card'); card.innerHTML='<div class="sv52-diary">Today we chased the feeling first—the kind of hook that makes you smile before you even know the words. The studio is glowing. ♡</div><div class="sv52-hero-icon">🎙️</div>'; }
    } else if(name==='Neon Lounge'){
      if(primary){ overlay.classList.toggle('sv52-night'); toast(overlay.classList.contains('sv52-night')?'Night mode unlocked 💋':'Lights turned back up ✨'); } else { sprinkleBurst(18); toast('Neon kiss sent 💋'); }
    } else if(name==='Pink Café'){
      if(primary){ toast(['Choose joy on purpose today.','You are allowed to begin again.','Big dreams can start at a tiny table.'][Math.floor(Math.random()*3)]); } else { const thought=prompt('Leave a sweet thought for yourself:'); if(thought){localStorage.setItem('jahntella_v52_thought',thought);toast('Your sweet thought was saved ☕');} }
    } else if(name==='Sparkle Lake'){
      if(primary){ createWishStars(); toast('Catch three stars to make your wish ✨'); } else { sprinkleBurst(20); toast('Fireflies released over the lake ✨'); }
    }
  }

  function tone(freq){ try{const C=window.AudioContext||window.webkitAudioContext;const c=new C();const o=c.createOscillator();const g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.04,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.45);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.5);}catch(e){} }

  function createWishStars(){
    const stage=document.querySelector('.sv52-stage'); let caught=0;
    for(let i=0;i<5;i++){const s=document.createElement('button');s.className='sv52-star';s.textContent='★';s.style.left=(12+Math.random()*76)+'%';s.style.top=(15+Math.random()*68)+'%';s.style.animationDelay=Math.random()+'s';s.setAttribute('aria-label','Catch wishing star');s.onclick=()=>{s.remove();caught++;if(caught===3){toast('Wish made! Come back and keep believing. ✨');localStorage.setItem('jahntella_v52_wish',new Date().toISOString());}};stage.appendChild(s);}
  }

  function init(){
    if(document.getElementById('sv52Styles')) return;
    const style=document.createElement('style');style.id='sv52Styles';style.textContent=css;document.head.appendChild(style);
    const section=document.getElementById('sweetville'); if(!section) return; section.classList.add('v52-ready');
    const overlay=document.createElement('div');overlay.className='sv52-overlay';overlay.setAttribute('aria-hidden','true');overlay.innerHTML='<div class="sv52-world" role="dialog" aria-modal="true" aria-label="Explore Sweetville"><div class="sv52-topbar"><div class="sv52-brand"><span class="sv52-brand-icon">🍭</span><div><small>THE WORLD OF JAHNTELLA</small><strong>Sweetville Explorer</strong></div></div><button class="sv52-close" aria-label="Close Sweetville">×</button></div><div class="sv52-stage"></div></div>';document.body.appendChild(overlay);
    const close=()=>{overlay.classList.remove('open','sv52-night');overlay.setAttribute('aria-hidden','true');document.body.style.overflow='';};
    overlay.querySelector('.sv52-close').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close();});
    section.querySelectorAll('[data-sweetville-place]').forEach(btn=>{const clone=btn.cloneNode(true);btn.parentNode.replaceChild(clone,btn);clone.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();render(clone.dataset.sweetvillePlace);overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});});
    const badge=document.getElementById('buildBadge');if(badge)badge.textContent='BUILD '+VERSION;
    window.JAHNTELLA_BUILD=VERSION;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

/* Jahntella v5.3 — Sweet Passport */
(() => {
  'use strict';
  const VERSION='5.3';
  const KEY='jahntella_sweet_passport_v53';
  const levels=[
    {min:0,name:'Visitor',icon:'🍭'},
    {min:120,name:'Sweet Explorer',icon:'✨'},
    {min:300,name:'Melody Hunter',icon:'🎵'},
    {min:600,name:'VIP Sweetie',icon:'💖'},
    {min:1000,name:'Sweetville Legend',icon:'👑'}
  ];
  const stampDefs={
    founder:['Founder','👑','Early Sweetville explorer'],
    donut:['Donut District','🍩','Visited the sweetest bakery'],
    studio:['Melody Studio','🎵','Stepped inside the studio'],
    neon:['Neon Lounge','💋','Entered Sweetville after dark'],
    cafe:['Pink Café','☕','Saved a seat at the café'],
    lake:['Sparkle Lake','✨','Made a wish by the lake'],
    surprise:['Sweet Surprise','🎁','Opened a Sweet Pack'],
    fundipp:['Played Fun Dipp','🍭','Played the featured single'],
    stars:['Star Hunter','⭐','Found all four hidden sparkles'],
    sweetlist:['Sweet List','💌','Joined the Sweet List'],
    returner:['Welcome Back','🏡','Returned to Sweetville']
  };
  const now=()=>new Date().toISOString();
  function makeId(){return 'SWEET-'+Math.floor(100000+Math.random()*900000)}
  function load(){
    let p; try{p=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
    if(!p){p={id:makeId(),name:'Sweetie',joined:now(),lastVisit:'',visits:0,xp:0,coins:0,stamps:{},secrets:0,songs:0,events:{}}}
    p.visits=(p.visits||0)+1; p.lastVisit=now(); p.stamps=p.stamps||{}; p.events=p.events||{};
    save(p); return p;
  }
  function save(p){localStorage.setItem(KEY,JSON.stringify(p))}
  let passport=load();
  function levelFor(xp){let out=levels[0];levels.forEach(l=>{if(xp>=l.min)out=l});return out}
  function nextLevel(xp){return levels.find(l=>l.min>xp)||null}
  function once(key,fn){if(passport.events[key])return false;passport.events[key]=now();fn();save(passport);return true}
  function reward(key,xp,coins,message){return once(key,()=>{passport.xp+=xp;passport.coins+=coins;celebrate(message||`+${xp} XP · +${coins} Sweet Coins`)})}
  function stamp(id,xp=35,coins=10){if(passport.stamps[id])return false;passport.stamps[id]=now();passport.xp+=xp;passport.coins+=coins;save(passport);const d=stampDefs[id]||[id,'✦',''];celebrate(`${d[1]} ${d[0]} stamp unlocked!`);render();return true}
  function celebrate(message){
    let t=document.querySelector('.sp53-toast');if(!t){t=document.createElement('div');t.className='sp53-toast';document.body.appendChild(t)}
    t.textContent=message;t.classList.add('show');clearTimeout(celebrate.timer);celebrate.timer=setTimeout(()=>t.classList.remove('show'),2600);
    for(let i=0;i<24;i++){const s=document.createElement('i');s.className='sp53-confetti';s.textContent=['✦','♡','★','🍬'][i%4];s.style.left=(45+Math.random()*10)+'%';s.style.setProperty('--x',(Math.random()*360-180)+'px');s.style.setProperty('--r',(Math.random()*720-360)+'deg');document.body.appendChild(s);setTimeout(()=>s.remove(),1600)}
  }
  function fmt(d){try{return new Date(d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}catch(e){return d}}
  function render(){
    const root=document.querySelector('.sp53-modal');if(!root)return;
    const level=levelFor(passport.xp),next=nextLevel(passport.xp);const base=level.min;const target=next?next.min:Math.max(1000,passport.xp);const pct=next?Math.min(100,((passport.xp-base)/(target-base))*100):100;
    root.querySelector('.sp53-book').innerHTML=`
      <button class="sp53-close" aria-label="Close passport">×</button>
      <div class="sp53-cover"><span class="sp53-seal">🍭</span><small>THE WORLD OF JAHNTELLA</small><h2>Sweet Passport</h2><p>Official Sweetville Explorer</p><b>${passport.id}</b></div>
      <div class="sp53-page">
        <div class="sp53-profile"><button class="sp53-avatar" aria-label="Edit explorer name">${level.icon}</button><div><small>EXPLORER</small><h3>${escapeHtml(passport.name)}</h3><button class="sp53-rename">Edit name</button></div></div>
        <div class="sp53-level"><strong>Level ${levels.indexOf(level)+1} · ${level.name}</strong><span>${passport.xp} XP</span><div><i style="width:${pct}%"></i></div><small>${next?`${target-passport.xp} XP until ${next.name}`:'Maximum legend level reached'}</small></div>
        <div class="sp53-stats"><div><b>${passport.coins}</b><span>Sweet Coins</span></div><div><b>${Object.keys(passport.stamps).length}</b><span>Stamps</span></div><div><b>${passport.visits}</b><span>Visits</span></div><div><b>${passport.songs||0}</b><span>Songs Played</span></div></div>
        <div class="sp53-meta"><span>Member since <b>${fmt(passport.joined)}</b></span><span>Passport <b>${passport.id}</b></span></div>
        <h4>Passport Stamps</h4><div class="sp53-stamps">${Object.entries(stampDefs).map(([id,d])=>`<div class="sp53-stamp ${passport.stamps[id]?'earned':'locked'}"><i>${passport.stamps[id]?d[1]:'?'}</i><strong>${d[0]}</strong><small>${passport.stamps[id]?d[2]:'Keep exploring to unlock'}</small></div>`).join('')}</div>
      </div>`;
    root.querySelector('.sp53-close').onclick=close;
    root.querySelector('.sp53-rename').onclick=rename;
    root.querySelector('.sp53-avatar').onclick=rename;
  }
  function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function rename(){const n=prompt('What should your Sweet Passport call you?',passport.name);if(n&&n.trim()){passport.name=n.trim().slice(0,24);save(passport);render();celebrate('Passport updated ✨')}}
  function open(){const m=document.querySelector('.sp53-modal');render();m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function close(){const m=document.querySelector('.sp53-modal');m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  const css=`
  .sp53-button{position:fixed;right:18px;bottom:18px;z-index:99980;border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:12px 17px;background:linear-gradient(135deg,#ff1684,#ff79bd);color:#fff;font:800 13px/1 DM Sans,sans-serif;box-shadow:0 15px 45px rgba(255,22,132,.38);cursor:pointer;display:flex;gap:8px;align-items:center}.sp53-button span{font-size:20px}.music-player-open .sp53-button{bottom:104px}.sp53-modal{position:fixed;inset:0;z-index:100200;display:grid;place-items:center;padding:18px;background:rgba(5,0,10,.84);backdrop-filter:blur(16px);opacity:0;visibility:hidden;transition:.25s}.sp53-modal.open{opacity:1;visibility:visible}.sp53-book{position:relative;width:min(1050px,96vw);max-height:92vh;overflow:auto;display:grid;grid-template-columns:330px 1fr;border-radius:28px;background:#fff7fb;color:#290018;box-shadow:0 35px 120px rgba(0,0,0,.7);transform:translateY(14px) scale(.97);transition:.3s}.sp53-modal.open .sp53-book{transform:none}.sp53-cover{min-height:650px;padding:42px 30px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 50% 20%,rgba(255,255,255,.25),transparent 32%),linear-gradient(145deg,#ff1684,#9b0759);color:#fff;border-right:6px solid #d99025;box-shadow:inset -10px 0 25px rgba(0,0,0,.18)}.sp53-cover:after{content:"";position:absolute;left:20px;top:20px;bottom:20px;width:1px;border-left:1px solid rgba(255,215,106,.7)}.sp53-seal{font-size:72px;width:125px;height:125px;border-radius:50%;display:grid;place-items:center;border:3px solid #ffd76a;box-shadow:0 0 0 8px rgba(255,215,106,.18),0 15px 35px rgba(0,0,0,.22);margin-bottom:24px}.sp53-cover small{letter-spacing:.18em;font-weight:900}.sp53-cover h2{font-family:Playfair Display,serif;font-size:46px;line-height:1;margin:14px 0 8px}.sp53-cover p{opacity:.8}.sp53-cover b{margin-top:35px;padding:9px 15px;border:1px solid rgba(255,255,255,.3);border-radius:999px}.sp53-page{padding:42px;min-width:0}.sp53-close{position:absolute;right:14px;top:14px;z-index:3;width:42px;height:42px;border:0;border-radius:50%;background:#290018;color:#fff;font-size:26px;cursor:pointer}.sp53-profile{display:flex;align-items:center;gap:17px}.sp53-avatar{width:82px;height:82px;border-radius:24px;border:2px solid #ffd76a;background:linear-gradient(145deg,#ffdaed,#fff);font-size:42px;cursor:pointer}.sp53-profile small{letter-spacing:.16em;font-weight:900;color:#ad416e}.sp53-profile h3{font-family:Playfair Display,serif;font-size:34px;margin:2px 0}.sp53-rename{border:0;background:none;color:#d31b73;padding:0;text-decoration:underline;cursor:pointer;font-weight:800}.sp53-level{margin:25px 0;padding:18px;border-radius:18px;background:#fff;border:1px solid #ffd1e7}.sp53-level>span{float:right;font-weight:900}.sp53-level>div{height:11px;border-radius:99px;background:#f2dbe6;overflow:hidden;margin:12px 0 7px}.sp53-level i{display:block;height:100%;background:linear-gradient(90deg,#ff1684,#ffd76a);border-radius:inherit}.sp53-level small{color:#7a5265}.sp53-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.sp53-stats div{padding:15px 10px;border-radius:16px;background:#2a061f;color:#fff;text-align:center}.sp53-stats b{display:block;font-size:23px;color:#ff91c8}.sp53-stats span{font-size:11px}.sp53-meta{display:flex;justify-content:space-between;gap:12px;margin:18px 0;color:#725265;font-size:12px}.sp53-page h4{font-size:17px;margin:24px 0 12px}.sp53-stamps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.sp53-stamp{min-height:125px;padding:13px;border-radius:17px;border:1px dashed #d8a8bd;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}.sp53-stamp i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#fff;font-style:normal;font-size:25px;box-shadow:0 5px 13px rgba(70,0,35,.1)}.sp53-stamp strong{font-size:12px;margin-top:7px}.sp53-stamp small{font-size:10px;color:#8c6176}.sp53-stamp.locked{filter:grayscale(1);opacity:.43}.sp53-stamp.earned{background:linear-gradient(145deg,#fff,#ffe8f3);border-style:solid;border-color:#ef9bc3}.sp53-toast{position:fixed;left:50%;top:24px;z-index:100300;transform:translate(-50%,-20px);opacity:0;padding:14px 19px;border-radius:999px;background:#fff;color:#2b001a;font-weight:900;box-shadow:0 18px 50px rgba(0,0,0,.3);transition:.25s;pointer-events:none}.sp53-toast.show{opacity:1;transform:translate(-50%,0)}.sp53-confetti{position:fixed;left:50%;top:45%;z-index:100290;font-style:normal;font-size:20px;pointer-events:none;animation:sp53Pop 1.5s ease-out forwards}@keyframes sp53Pop{to{transform:translate(var(--x),220px) rotate(var(--r));opacity:0}}@media(max-width:780px){.sp53-book{grid-template-columns:1fr}.sp53-cover{min-height:310px;border-right:0;border-bottom:5px solid #d99025}.sp53-cover h2{font-size:38px}.sp53-seal{width:90px;height:90px;font-size:50px;margin-bottom:15px}.sp53-page{padding:28px 17px 38px}.sp53-stats{grid-template-columns:repeat(2,1fr)}.sp53-stamps{grid-template-columns:repeat(2,1fr)}.sp53-meta{flex-direction:column}.sp53-button{right:12px;bottom:12px}}
  `;
  function init(){
    const style=document.createElement('style');style.id='sp53Styles';style.textContent=css;document.head.appendChild(style);
    const btn=document.createElement('button');btn.className='sp53-button';btn.innerHTML='<span>🛂</span> Sweet Passport';btn.onclick=open;document.body.appendChild(btn);
    const modal=document.createElement('div');modal.className='sp53-modal';modal.setAttribute('aria-hidden','true');modal.innerHTML='<div class="sp53-book" role="dialog" aria-modal="true" aria-label="Sweet Passport"></div>';document.body.appendChild(modal);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
    stamp('founder',50,25);
    if(passport.visits>1) stamp('returner',30,10);
    document.addEventListener('click',e=>{
      const place=e.target.closest('[data-sweetville-place]');if(place){const map={'Donut District':'donut','Melody Studio':'studio','Neon Lounge':'neon','Pink Café':'cafe','Sparkle Lake':'lake'};setTimeout(()=>stamp(map[place.dataset.sweetvillePlace],35,10),350)}
      if(e.target.closest('#surpriseButton,.machine-button')) setTimeout(()=>stamp('surprise',40,12),500);
      if(e.target.closest('[data-audio-track="fun-dipp"]')){passport.songs=(passport.songs||0)+1;save(passport);stamp('fundipp',45,15)}
      if(e.target.closest('.hidden-star')){setTimeout(()=>{if(document.querySelectorAll('.hidden-star.collected').length>=4)stamp('stars',55,20)},250)}
    },true);
    document.querySelectorAll('audio').forEach(a=>a.addEventListener('play',()=>{passport.songs=(passport.songs||0)+1;save(passport);if(a.id==='audioFunDipp')stamp('fundipp',45,15)},{passive:true}));
    document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',()=>{if(f.closest('#sweet-list,.newsletter-section')||f.id.toLowerCase().includes('newsletter'))stamp('sweetlist',60,20)}));
    const badge=document.getElementById('buildBadge');if(badge)badge.textContent='BUILD '+VERSION;window.JAHNTELLA_BUILD=VERSION;
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
