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


/* Jahntella v7.0 Vault launch bridges */
document.addEventListener("DOMContentLoaded", () => {
  const packButton = document.getElementById("v7OpenPack");
  const vaultButton = document.getElementById("v7OpenVault");
  const originalPack = document.getElementById("floatingPackButton")
    || document.querySelector("[data-open-pack]")
    || document.getElementById("openPackButton");
  const originalVault = document.getElementById("floatingVaultButton");

  if (packButton) {
    packButton.addEventListener("click", () => {
      if (typeof spinSweetMachine === "function") {
        spinSweetMachine();
      } else if (originalPack) {
        originalPack.click();
      } else {
        const dialog = document.getElementById("packDialog");
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      }
    });
  }

  if (vaultButton) {
    vaultButton.addEventListener("click", () => {
      if (typeof openVault === "function") {
        openVault();
      } else if (originalVault) {
        originalVault.click();
      } else {
        const dialog = document.getElementById("collectionDialog");
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      }
    });
  }

  document.querySelectorAll(".v7-coming-button").forEach((button) => {
    button.addEventListener("click", (event) => event.preventDefault());
  });
});
