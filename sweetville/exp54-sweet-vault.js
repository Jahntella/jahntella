/* EXP 54.0 — Sweet Vault, scoped to Sweetville */
(() => {
  "use strict";

  const ready = callback => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once:true });
    } else {
      callback();
    }
  };

  ready(() => {
    const vaultGrid = document.getElementById("vaultGrid");
    const vaultCount = document.getElementById("vaultCount");
    const vaultPercent = document.getElementById("vaultPercent");
    const vaultProgressBar = document.getElementById("vaultProgressBar");
    const openPackButton = document.getElementById("openPackButton");
    const packStatus = document.getElementById("packStatus");
    const resetVaultButton = document.getElementById("resetVaultButton");
    const lastPulledCard = document.getElementById("lastPulledCard");
    const revealModal = document.getElementById("cardRevealModal");
    const revealCardImage = document.getElementById("revealCardImage");
    const revealTitle = document.getElementById("revealTitle");
    const revealRarity = document.getElementById("revealRarity");
    const revealMessage = document.getElementById("revealMessage");
    const revealDoneButton = document.getElementById("revealDoneButton");
    const closeRevealButton = document.getElementById("closeRevealButton");
    const confettiLayer = document.getElementById("confettiLayer");

    const required = [
      vaultGrid, vaultCount, vaultPercent, vaultProgressBar, openPackButton,
      packStatus, resetVaultButton, lastPulledCard, revealModal, revealCardImage,
      revealTitle, revealRarity, revealMessage, revealDoneButton,
      closeRevealButton, confettiLayer
    ];

    if (required.some(element => !element)) return;

    if (revealModal.parentElement !== document.body) {
      document.body.appendChild(revealModal);
    }

    const asset = filename => new URL(`../${filename}`, document.baseURI).href;
    const sweetVaultCards = [
      { id:"001", title:"Bubblegum Queen", rarity:"Legendary", image:asset("sv-001-bubblegum-queen.png"), weight:5 },
      { id:"002", title:"Fun Dipp", rarity:"Ultra Rare", image:asset("sv-002-fun-dipp.png"), weight:6 },
      { id:"003", title:"Pink Lips", rarity:"Ultra Rare", image:asset("sv-003-pink-lips.png"), weight:6 },
      { id:"004", title:"Candy Rebel", rarity:"Epic", image:asset("sv-004-candy-rebel.png"), weight:10 },
      { id:"005", title:"Neon Sweetheart", rarity:"Epic", image:asset("sv-005-neon-sweetheart.png"), weight:10 },
      { id:"006", title:"Donut District", rarity:"Rare", image:asset("sv-006-donut-district.png"), weight:9 },
      { id:"007", title:"Melody Studio", rarity:"Rare", image:asset("sv-007-melody-studio.png"), weight:9 },
      { id:"008", title:"Sparkle Lake", rarity:"Rare", image:asset("sv-008-sparkle-lake.png"), weight:9 },
      { id:"009", title:"Pink Café", rarity:"Rare", image:asset("sv-009-pink-cafe.png"), weight:9 },
      { id:"010", title:"Cotton Candy Clouds", rarity:"Rare", image:asset("sv-010-cotton-candy-clouds.png"), weight:9 },
      { id:"011", title:"Stay Sweet", rarity:"Rare", image:asset("sv-011-stay-sweet.png"), weight:9 },
      { id:"012", title:"XO Sweetie", rarity:"Secret Rare", image:asset("sv-012-xo-sweetie-secret.png"), weight:5 }
    ];

    const STORAGE_KEY = "jahntellaSweetVaultV17";
    const BACK_IMAGE = asset("sweet-vault-card-back.png");
    let opening = false;
    let priorDocumentOverflow = "";
    let priorBodyOverflow = "";

    const readVault = () => {
      const keys = [STORAGE_KEY, "jahntellaSweetVaultV18", "jahntellaSweetVaultV19"];
      for (const key of keys) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || "{}");
          if (Array.isArray(parsed.collected) || parsed.lastPulled) {
            return {
              collected:Array.isArray(parsed.collected) ? [...new Set(parsed.collected)] : [],
              lastPulled:parsed.lastPulled || null
            };
          }
        } catch {}
      }
      return { collected:[], lastPulled:null };
    };

    let vaultState = readVault();

    const saveVault = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultState));
    const rarityClass = rarity => `rarity-${rarity.replaceAll(" ", "-")}`;

    const renderLastPulled = () => {
      const card = sweetVaultCards.find(item => item.id === vaultState.lastPulled);
      if (!card) {
        lastPulledCard.innerHTML = '<p class="eyebrow">LAST PULLED</p><div class="last-pulled-placeholder">Your newest card will appear here.</div>';
        return;
      }

      lastPulledCard.innerHTML = `
        <p class="eyebrow">LAST PULLED</p>
        <div class="last-pulled-display">
          <img src="${card.image}" alt="${card.title} Sweet Vault card">
          <div>
            <span class="rarity-pill">${card.rarity}</span>
            <h3>${card.title}</h3>
            <p>Card ${card.id} is safely stored in your Sweet Vault.</p>
          </div>
        </div>`;
    };

    const renderVault = () => {
      vaultGrid.innerHTML = sweetVaultCards.map(card => {
        const unlocked = vaultState.collected.includes(card.id);
        const image = unlocked ? card.image : BACK_IMAGE;
        const label = unlocked ? `Flip ${card.title}` : `Locked card ${card.id}`;
        const alt = unlocked ? `${card.title} card front` : "Locked Sweet Vault card";

        return `
          <button class="vault-card-button ${unlocked ? "" : "is-locked"}" data-card-id="${card.id}" ${unlocked ? "" : "aria-disabled='true'"} aria-label="${label}">
            <span class="vault-card-scene">
              <span class="vault-card-inner">
                <span class="vault-card-face vault-card-front"><img src="${image}" alt="${alt}" loading="lazy" decoding="async"></span>
                <span class="vault-card-face vault-card-back"><img src="${BACK_IMAGE}" alt="Sweet Vault card back" loading="lazy" decoding="async"></span>
              </span>
            </span>
          </button>`;
      }).join("");

      vaultGrid.querySelectorAll(".vault-card-button:not(.is-locked)").forEach(button => {
        button.addEventListener("click", () => button.classList.toggle("is-flipped"));
      });

      const count = vaultState.collected.length;
      const percent = Math.round((count / sweetVaultCards.length) * 100);
      vaultCount.textContent = String(count);
      vaultPercent.textContent = `${percent}%`;
      vaultProgressBar.style.width = `${percent}%`;
      renderLastPulled();
    };

    const weightedPull = () => {
      const total = sweetVaultCards.reduce((sum, card) => sum + card.weight, 0);
      let roll = Math.random() * total;
      for (const card of sweetVaultCards) {
        roll -= card.weight;
        if (roll <= 0) return card;
      }
      return sweetVaultCards[sweetVaultCards.length - 1];
    };

    const createConfetti = amount => {
      confettiLayer.innerHTML = "";
      for (let index = 0; index < amount; index += 1) {
        const piece = document.createElement("i");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDelay = `${Math.random() * .8}s`;
        piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
        confettiLayer.appendChild(piece);
      }
    };

    const lockPage = () => {
      priorDocumentOverflow = document.documentElement.style.overflow;
      priorBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    const unlockPage = () => {
      document.documentElement.style.overflow = priorDocumentOverflow;
      document.body.style.overflow = priorBodyOverflow;
    };

    const closeReveal = () => {
      revealModal.className = "card-reveal-modal";
      revealModal.setAttribute("aria-hidden", "true");
      confettiLayer.innerHTML = "";
      unlockPage();
      openPackButton.focus({ preventScroll:true });
    };

    const commitPullToVault = card => {
      const isNew = !vaultState.collected.includes(card.id);
      if (isNew) vaultState.collected.push(card.id);
      vaultState.lastPulled = card.id;

      try {
        saveVault();
      } catch (error) {
        console.error("Sweet Vault could not save:", error);
      }

      renderVault();

      if (isNew) {
        const slot = vaultGrid.querySelector(`[data-card-id="${card.id}"]`);
        slot?.classList.add("just-unlocked");
        window.setTimeout(() => slot?.classList.remove("just-unlocked"), 5200);
      }

      return isNew;
    };

    const showReveal = card => {
      const isNew = commitPullToVault(card);
      revealCardImage.src = card.image;
      revealCardImage.alt = `${card.title} Sweet Vault card`;
      revealRarity.textContent = card.rarity.toUpperCase();
      revealTitle.textContent = card.title;
      revealMessage.textContent = isNew
        ? "New card unlocked and saved to your Sweet Vault."
        : "Duplicate pull — your previous copy remains safely stored.";
      revealDoneButton.textContent = "View My Vault";

      lockPage();
      revealModal.className = `card-reveal-modal open ${rarityClass(card.rarity)}`;
      revealModal.setAttribute("aria-hidden", "false");

      if (card.rarity === "Secret Rare") createConfetti(70);
      else if (card.rarity === "Legendary" || card.rarity === "Ultra Rare") createConfetti(35);

      window.setTimeout(() => revealModal.classList.add("is-revealed"), 850);
      window.setTimeout(() => closeRevealButton.focus({ preventScroll:true }), 80);
    };

    openPackButton.addEventListener("click", () => {
      if (opening) return;
      opening = true;
      packStatus.textContent = "The foil pack is opening...";
      openPackButton.classList.add("is-opening");

      window.setTimeout(() => {
        const card = weightedPull();
        showReveal(card);
        openPackButton.classList.remove("is-opening");
        packStatus.textContent = `${card.title} revealed!`;
        opening = false;
      }, 1050);
    });

    revealDoneButton.addEventListener("click", () => {
      closeReveal();
      document.getElementById("vaultBinder")?.scrollIntoView({ behavior:"smooth", block:"start" });
    });

    closeRevealButton.addEventListener("click", closeReveal);
    revealModal.querySelector(".reveal-backdrop")?.addEventListener("click", closeReveal);

    resetVaultButton.addEventListener("click", () => {
      if (!window.confirm("Reset the entire Sweet Vault collection on this device?")) return;
      vaultState = { collected:[], lastPulled:null };
      saveVault();
      renderVault();
      packStatus.textContent = "Vault reset. Tap the pack to start again.";
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && revealModal.classList.contains("open")) closeReveal();
    });

    renderVault();
  });
})();
