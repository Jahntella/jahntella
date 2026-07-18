window.JAHNTELLA_BUILD = "3.6.1-FORCED-REFRESH";

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



// VERSION 3.0: Official Jahntella First Edition Card Art
// Each collectible now uses its own approved pose, outfit, setting, and finished card design.
const SWEET_SURPRISES = [
  {id:"fun-dipp-001",number:"001",title:"Fun Dipp",subtitle:"Candy-Coated Confidence",category:"Signature Portrait",icon:"🍭",rarity:"Ultra Rare",photo:"jahntella-world-v361-001.jpg",theme:"official-card",a:"#ff2b91",b:"#5726d9",trait:"Candy-Coated Confidence",lore:"The iconic First Edition portrait—the card that welcomes every Sweetie into Jahntella’s world.",quote:"Every unforgettable era begins with one brave step."},
  {id:"pink-convertible-002",number:"002",title:"Pink Convertible",subtitle:"Windows Down, Music Up",category:"Favorite Things",icon:"🚗",rarity:"Rare",photo:"jahntella-world-v361-002.jpg",theme:"official-card",a:"#ff4f9e",b:"#6c164d",trait:"Main-Character Energy",lore:"Jahntella’s favorite ride through Sweetville: neon streets, warm night air, and the newest song turned all the way up.",quote:"Take the long way when the playlist is perfect."},
  {id:"sweetie-003",number:"003",title:"Sweetie",subtitle:"Official Best Friend",category:"Sweetville Friends",icon:"🐶",rarity:"Ultra Rare",photo:"jahntella-world-v361-003.jpg",theme:"official-card",a:"#9e4fbd",b:"#251250",trait:"Loyal Little Heart",lore:"Sweetie has been beside Jahntella from the beginning—and is rumored to steal marshmallows whenever nobody is looking.",quote:"The smallest friends can hold the biggest part of your heart."},
  {id:"sweetville-sign-004",number:"004",title:"Sweetville Sign",subtitle:"Welcome To The Story",category:"Sweetville Landmark",icon:"🏙️",rarity:"Legendary",photo:"jahntella-world-v361-004.jpg",theme:"official-card",a:"#f2b53b",b:"#9a245e",trait:"The Gateway Glows",lore:"The legendary neon sign at the edge of town. Once it lights up for you, Sweetville always remembers your name.",quote:"You are not just visiting—you are part of the story now."},
  {id:"favorite-latte-005",number:"005",title:"Favorite Latte",subtitle:"A Little Heart On Top",category:"Favorite Things",icon:"☕",rarity:"Rare",photo:"jahntella-world-v361-005.jpg",theme:"official-card",a:"#d8688c",b:"#6d3159",trait:"Cozy Inspiration",lore:"Jahntella’s signature pink café order, served with a heart and usually beside a notebook full of new ideas.",quote:"Some of the best dreams begin over one warm cup."},
  {id:"golden-hoop-006",number:"006",title:"Golden Hoop",subtitle:"Signature Shine",category:"Style Icons",icon:"✨",rarity:"Rare",photo:"jahntella-world-v361-006.jpg",theme:"official-card",a:"#e5ad31",b:"#6e3511",trait:"Perfect Pop Instinct",lore:"The unmistakable hoops that catch every spotlight. Sweetville legend says they swing whenever a perfect hook is near.",quote:"Wear the thing that reminds you who you are."},
  {id:"bubblegum-pop-007",number:"007",title:"Bubblegum Pop",subtitle:"Bright, Bold, Unapologetic",category:"Favorite Things",icon:"🫧",rarity:"Common",photo:"jahntella-world-v361-007.jpg",theme:"official-card",a:"#ff66b3",b:"#45a6d9",trait:"Instant Joy",lore:"A giant pink bubble floating through a candy-colored afternoon—the playful sound and spirit of the Sweet Era.",quote:"Joy does not need permission."},
  {id:"studio-session-008",number:"008",title:"Studio Session",subtitle:"Where The Magic Starts",category:"Behind The Music",icon:"🎙️",rarity:"Rare",photo:"jahntella-world-v361-008.jpg",theme:"official-card",a:"#190d4f",b:"#d22291",trait:"Creative Focus",lore:"Microphone ready, headphones on, lyrics nearby. This is where a quiet idea becomes the song everyone remembers.",quote:"Make the thing you cannot stop hearing in your heart."},
  {id:"sparkle-lake-009",number:"009",title:"Sparkle Lake",subtitle:"Make A Wish",category:"Sweetville Landmark",icon:"🌙",rarity:"Common",photo:"jahntella-world-v361-009.jpg",theme:"official-card",a:"#288bc9",b:"#8d4de7",trait:"Hope In Motion",lore:"The water glows whenever someone makes an honest wish and follows it with one brave action.",quote:"A wish becomes a path when you move toward it."},
  {id:"vip-pass-010",number:"010",title:"VIP Pass",subtitle:"Your Name Is On The List",category:"Sweet Era Awards",icon:"🎟️",rarity:"Rare",photo:"jahntella-world-v361-010.jpg",theme:"official-card",a:"#8d1b72",b:"#29104f",trait:"All-Access Confidence",lore:"A backstage pass from Jahntella herself. The lights are warm, the music is loud, and the velvet rope has already moved.",quote:"Walk in like the room was waiting for you."},
  {id:"directors-chair-011",number:"011",title:"Director's Chair",subtitle:"Build The World",category:"Creative Awards",icon:"🎬",rarity:"Ultra Rare",photo:"jahntella-world-v361-011.jpg",theme:"official-card",a:"#303030",b:"#a31462",trait:"Vision Into Reality",lore:"Reserved for the imagination behind every color, lyric, scene, and sparkle that brings the Jahntella universe to life.",quote:"Do not just imagine the world. Build it."},
  {id:"sweet-era-award-012",number:"012",title:"Sweet Era Award",subtitle:"Limited First Edition",category:"Sweet Era Awards",icon:"🏆",rarity:"Legendary",photo:"jahntella-world-v361-012.jpg",theme:"official-card",a:"#ff3f9b",b:"#6338e4",trait:"Here From Day One",lore:"The final First Edition treasure, awarded to the Sweeties who believed early, collected boldly, and helped Sweetville shine.",quote:"The sweetest victories are the ones we celebrate together."}
];

const SURPRISE_STORAGE_KEY = "jahntellaSweetSurpriseCollectionV361";
const FAVORITES_STORAGE_KEY = "jahntellaSweetCardFavoritesV361";
const UNLOCK_DATES_KEY = "jahntellaSweetCardUnlockDatesV361";

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

const packRevealOverlay = document.getElementById("packRevealOverlay");
const packStage = document.getElementById("packStage");
const sweetPack = document.getElementById("sweetPack");
const packCloseButton = document.getElementById("packCloseButton");
const cardRevealPanel = document.getElementById("cardRevealPanel");
const revealKicker = document.getElementById("revealKicker");
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
  const weights = {"Common":7,"Rare":4,"Ultra Rare":2,"Legendary":1};
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
  const dates = getUnlockDates();
  const found = dates[card.id] || "Sweet Surprise Machine";
  return `
    <span class="card-back-logo">Jahntella♡</span>
    <span class="card-back-number">CARD #${card.number}</span>
    <h3 class="card-back-title">${escapeHtml(card.title)}</h3>
    <p class="card-back-story">${escapeHtml(card.lore)}</p>
    <ul class="card-detail-list">
      <li><span>Collection</span><strong>Sweet Era — First Edition</strong></li>
      <li><span>Category</span><strong>${escapeHtml(card.category)}</strong></li>
      <li><span>Trait</span><strong>${escapeHtml(card.trait)}</strong></li>
      <li><span>Rarity</span><strong>${escapeHtml(card.rarity)}</strong></li>
      <li><span>Unlocked</span><strong>${escapeHtml(found)}</strong></li>
    </ul>
    <p class="card-back-quote">“${escapeHtml(card.quote)}”</p>
    <span class="card-back-signature">🍭 Stay Sweet<br><strong>xo, Jahntella 💋</strong></span>
  `;
}
function prepareFeaturedCard(card, isNew) {
  currentSurprise = card;
  revealIsNew = isNew;
  featuredSweetCard.classList.remove("is-flipped");
  featuredCardFront.className = `sweet-card-face sweet-card-front ${rarityClass(card.rarity)}`;
  featuredCardFront.style.setProperty("--card-a", card.a);
  featuredCardFront.style.setProperty("--card-b", card.b);
  featuredCardFront.innerHTML = cardFrontMarkup(card);
  featuredCardBack.innerHTML = cardBackMarkup(card);
  revealKicker.textContent = isNew ? "NEW CARD UNLOCKED" : "WELCOME BACK TO THIS CARD";
  updateFavoriteButton();
}
function openPackReveal(card, isNew) {
  prepareFeaturedCard(card, isNew);
  cardRevealPanel.hidden = true;
  sweetPack.hidden = false;
  sweetPack.classList.remove("is-opening");
  packRevealOverlay.hidden = false;
  packRevealOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => sweetPack.focus(), 80);
}
function closePackReveal() {
  packRevealOverlay.hidden = true;
  packRevealOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  featuredSweetCard.classList.remove("is-flipped");
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
  if (sweetPack.classList.contains("is-opening")) return;
  sweetPack.classList.add("is-opening");
  window.setTimeout(() => {
    sweetPack.hidden = true;
    cardRevealPanel.hidden = false;
    burstSweetConfetti();
    showToast(`${currentSurprise.rarity} card revealed! ${currentSurprise.icon}`);
    featuredSweetCard.focus();
  }, 720);
}
function revealSweetSurprise(card) {
  const collection = getSweetCollection();
  const isNew = !collection.includes(card.id);
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
  if (previewNumber) previewNumber.textContent = isNew ? `CARD #${card.number} UNLOCKED` : `CARD #${card.number} ENCORE`;
  if (previewIcon) previewIcon.textContent = card.icon;
  if (previewCategory) previewCategory.textContent = card.category.toUpperCase();
  if (previewTitle) previewTitle.textContent = card.title;
  if (previewMessage) previewMessage.textContent = card.lore;
  if (machineStatus) machineStatus.textContent = isNew ? "A NEW CARD JUST DROPPED!" : "A FAVORITE CARD RETURNED";
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
  const rareCount = unlockedCards.filter((card) => card.rarity !== "Common").length;
  const percentage = Math.round((unlockedCards.length / SWEET_SURPRISES.length) * 100);
  if (collectionUnlocked) collectionUnlocked.textContent = String(unlockedCards.length);
  if (collectionTotal) collectionTotal.textContent = String(SWEET_SURPRISES.length);
  if (collectionRare) collectionRare.textContent = String(rareCount);
  if (vaultProgressFill) vaultProgressFill.style.width = `${percentage}%`;
  if (vaultProgressPercent) vaultProgressPercent.textContent = `${percentage}% complete`;
  if (collectionGrid) {
    collectionGrid.innerHTML = SWEET_SURPRISES.map((card) => {
      if (!collection.includes(card.id)) {
        return `<div class="vault-card-slot locked" data-number="#${card.number}" aria-label="Locked card number ${card.number}"></div>`;
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
async function shareCurrentCard() {
  if (!currentSurprise) return;
  const text = `I unlocked Jahntella's ${currentSurprise.title} #${currentSurprise.number} — ${currentSurprise.rarity} 🎴🍭`;
  const data = {title:"Jahntella Sweet Card",text,url:window.location.href.split("#")[0] + "#surprises"};
  try {
    if (navigator.share) await navigator.share(data);
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${data.url}`);
      showToast("Card share message copied! 💖");
    } else showToast(text);
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Your card is still safe in My Sweet Vault.");
  }
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
    link.download = `Jahntella_${currentSurprise.number}_${currentSurprise.title.replace(/\s+/g, "_")}.jpg`;
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
  const shouldReset = window.confirm("Reset all 12 cards, favorites, and unlock dates saved in this browser?");
  if (!shouldReset) return;
  localStorage.removeItem(SURPRISE_STORAGE_KEY);
  localStorage.removeItem(FAVORITES_STORAGE_KEY);
  localStorage.removeItem(UNLOCK_DATES_KEY);
  currentSurprise = null;
  renderSweetCollection();
  if (previewRarity) {previewRarity.textContent="READY";previewRarity.className="surprise-rarity rarity-common";}
  if (previewNumber) previewNumber.textContent="SWEET DROP";
  if (previewIcon) previewIcon.textContent="🎁";
  if (previewCategory) previewCategory.textContent="YOUR NEXT LITTLE DELIGHT";
  if (previewTitle) previewTitle.textContent="What will you unlock?";
  if (previewMessage) previewMessage.textContent="Push the glowing button and let Sweetville choose a collectible card for you.";
  if (machineStatus) machineStatus.textContent="READY FOR A SWEET PACK?";
  if (shareSurpriseButton) shareSurpriseButton.disabled=true;
  if (surpriseButton) surpriseButton.querySelector("span:last-child").textContent="Open a Sweet Pack";
  showToast("Sweet Vault reset.");
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
