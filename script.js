
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

// Easter eggs
let foundHearts = 0;
const discovered = new Set();

document.querySelectorAll(".easter-egg").forEach((item, index) => {
  item.addEventListener("click", () => {
    showToast(item.dataset.secret || "You found something sweet! 💖");

    if (!discovered.has(index)) {
      discovered.add(index);
      foundHearts += 1;
      document.getElementById("heartCounter").textContent = foundHearts;
    }

    if (foundHearts === 4) {
      window.setTimeout(() => showToast("All hidden hearts collected. Welcome to the real Sweet List. ✨"), 500);
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

// Ambient sparkle sound
let ambientNodes = null;
document.getElementById("soundControl").addEventListener("click", (event) => {
  const button = event.currentTarget;

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (ambientNodes) {
    ambientNodes.oscillator.stop();
    ambientNodes = null;
    button.innerHTML = "<span>♫</span> Sparkle sound: off";
    button.setAttribute("aria-pressed", "false");
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 523.25;
  filter.type = "lowpass";
  filter.frequency.value = 900;
  gain.gain.value = 0.012;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();

  ambientNodes = { oscillator, gain, filter };
  button.innerHTML = "<span>♫</span> Sparkle sound: on";
  button.setAttribute("aria-pressed", "true");
});

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
