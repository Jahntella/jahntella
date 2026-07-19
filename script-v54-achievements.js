/* Jahntella v5.4 — Achievement Badges
   Builds on v5.3.1 without replacing Music, Sweetville, Passport, Vault or Surprises.
*/
(() => {
  'use strict';

  const VERSION = '5.4';
  const KEY = 'jahntella_achievements_v54';
  const PASSPORT_KEY = 'jahntella_sweet_passport_v53';

  const definitions = {
    firstSteps: {
      icon: '🍭',
      title: 'First Steps',
      description: 'Entered the World of Sweet.',
      secret: false
    },
    founder: {
      icon: '👑',
      title: 'Sweetville Founder',
      description: 'Joined during the founding era.',
      secret: false
    },
    explorer: {
      icon: '🗺️',
      title: 'Sweet Explorer',
      description: 'Visited a Sweetville destination.',
      secret: false
    },
    tourist: {
      icon: '🏙️',
      title: 'Sweetville Tourist',
      description: 'Visited all five Sweetville destinations.',
      secret: false
    },
    firstSpin: {
      icon: '🎵',
      title: 'First Spin',
      description: 'Played a Jahntella song.',
      secret: false
    },
    remixAfterDark: {
      icon: '💋',
      title: 'Remix After Dark',
      description: 'Played Pink Lips Remix.',
      secret: false
    },
    packOpener: {
      icon: '🎁',
      title: 'Pack Opener',
      description: 'Opened a Sweet Surprise pack.',
      secret: false
    },
    starHunter: {
      icon: '⭐',
      title: 'Star Hunter',
      description: 'Found all four hidden sparkles.',
      secret: false
    },
    collector: {
      icon: '🎴',
      title: 'Sweet Collector',
      description: 'Collected at least six Sweet Vault cards.',
      secret: false
    },
    vaultMaster: {
      icon: '🏆',
      title: 'Vault Master',
      description: 'Completed the 12-card Sweet Vault.',
      secret: false
    },
    secretRare: {
      icon: '🌈',
      title: 'Secret Rare',
      description: 'Discovered a Secret Rare collectible.',
      secret: true
    },
    sweetList: {
      icon: '💌',
      title: 'Sweet List Insider',
      description: 'Joined The Sweet List.',
      secret: false
    },
    welcomeBack: {
      icon: '🏡',
      title: 'Welcome Back',
      description: 'Returned for another visit.',
      secret: false
    }
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) {}
    return { unlocked: {}, opened: 0 };
  }

  function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function loadPassport() {
    try {
      return JSON.parse(localStorage.getItem(PASSPORT_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function savePassport(passport) {
    if (passport) localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
  }

  const state = loadState();

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function celebrate(message) {
    let toast = document.querySelector('.ach54-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ach54-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(celebrate.timer);
    celebrate.timer = setTimeout(() => toast.classList.remove('show'), 3000);

    for (let i = 0; i < 26; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'ach54-confetti';
      piece.textContent = ['✦', '♡', '★', '🍬', '✨'][i % 5];
      piece.style.left = `${46 + Math.random() * 8}%`;
      piece.style.setProperty('--x', `${Math.random() * 420 - 210}px`);
      piece.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1700);
    }
  }

  function rewardPassport(id) {
    const passport = loadPassport();
    if (!passport) return;

    passport.events = passport.events || {};
    const rewardKey = `achievement_${id}`;
    if (passport.events[rewardKey]) return;

    passport.events[rewardKey] = new Date().toISOString();
    passport.xp = Number(passport.xp || 0) + 25;
    passport.coins = Number(passport.coins || 0) + 5;
    savePassport(passport);
  }

  function unlock(id, announce = true) {
    if (!definitions[id] || state.unlocked[id]) return false;
    state.unlocked[id] = new Date().toISOString();
    saveState();
    rewardPassport(id);
    render();

    if (announce) {
      const item = definitions[id];
      celebrate(`${item.icon} Achievement unlocked: ${item.title} · +25 XP · +5 Coins`);
    }
    return true;
  }

  function importPassportProgress() {
    const passport = loadPassport();
    if (!passport) return;

    const stamps = passport.stamps || {};
    if (stamps.founder) unlock('founder', false);
    if (stamps.returner || Number(passport.visits || 0) > 1) unlock('welcomeBack', false);
    if (stamps.sweetlist) unlock('sweetList', false);
    if (stamps.surprise) unlock('packOpener', false);
    if (stamps.stars) unlock('starHunter', false);
    if (stamps.fundipp || Number(passport.songs || 0) > 0) unlock('firstSpin', false);

    const placeIds = ['donut', 'studio', 'neon', 'cafe', 'lake'];
    const placeCount = placeIds.filter(id => stamps[id]).length;
    if (placeCount > 0) unlock('explorer', false);
    if (placeCount === placeIds.length) unlock('tourist', false);
  }

  function inspectVault() {
    const unlockedEl = document.getElementById('collectionUnlocked');
    const secretEl = document.getElementById('vaultSecretStatus');

    const unlocked = Number(unlockedEl?.textContent || 0);
    if (unlocked >= 6) unlock('collector');
    if (unlocked >= 12) unlock('vaultMaster');

    const secretText = String(secretEl?.textContent || '').toLowerCase();
    if (secretText && !secretText.includes('not found') && !secretText.includes('—')) {
      unlock('secretRare');
    }
  }

  function addStyles() {
    if (document.getElementById('ach54Styles')) return;

    const style = document.createElement('style');
    style.id = 'ach54Styles';
    style.textContent = `
      .ach54-nav-button{
        appearance:none;border:0;background:transparent;color:inherit;font:inherit;
        font-weight:700;cursor:pointer;padding:0;white-space:nowrap
      }
      .ach54-nav-button:hover{color:#ff7fbd}
      .ach54-modal{
        position:fixed;inset:0;z-index:100250;display:grid;place-items:center;padding:18px;
        background:rgba(5,0,10,.86);backdrop-filter:blur(17px);
        opacity:0;visibility:hidden;transition:.25s
      }
      .ach54-modal.open{opacity:1;visibility:visible}
      .ach54-shell{
        position:relative;width:min(1100px,96vw);max-height:92vh;overflow:auto;
        border:1px solid rgba(255,255,255,.18);border-radius:30px;
        background:
          radial-gradient(circle at 85% 5%,rgba(255,79,163,.25),transparent 31%),
          linear-gradient(145deg,#21051b,#09000f);
        color:#fff;box-shadow:0 38px 130px rgba(0,0,0,.72);
        padding:clamp(24px,4vw,48px);transform:translateY(15px) scale(.97);transition:.3s
      }
      .ach54-modal.open .ach54-shell{transform:none}
      .ach54-close{
        position:absolute;right:16px;top:16px;width:44px;height:44px;border:0;border-radius:50%;
        background:rgba(255,255,255,.1);color:#fff;font-size:27px;cursor:pointer
      }
      .ach54-heading{padding-right:55px}
      .ach54-heading small{
        display:block;color:#ff95c9;font-weight:900;letter-spacing:.18em;text-transform:uppercase
      }
      .ach54-heading h2{
        margin:8px 0;font-family:"Playfair Display",serif;
        font-size:clamp(38px,6vw,68px);line-height:.95
      }
      .ach54-heading h2 em{color:#ff71b6;font-style:normal}
      .ach54-heading p{max-width:690px;color:#d7c9d5;line-height:1.65}
      .ach54-progress{
        display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;
        margin:25px 0;padding:17px 19px;border:1px solid rgba(255,255,255,.13);
        border-radius:20px;background:rgba(255,255,255,.055)
      }
      .ach54-progress strong{font-size:25px;color:#ff91c8}
      .ach54-track{height:12px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}
      .ach54-track i{
        display:block;height:100%;border-radius:inherit;
        background:linear-gradient(90deg,#ff1684,#ffd76a);transition:width .4s ease
      }
      .ach54-progress span{font-size:13px;color:#e7d7e1}
      .ach54-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
      .ach54-card{
        position:relative;min-height:190px;padding:19px;border-radius:22px;
        border:1px solid rgba(255,255,255,.13);
        background:linear-gradient(145deg,rgba(255,255,255,.095),rgba(255,255,255,.035));
        display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
        overflow:hidden
      }
      .ach54-card.earned{
        border-color:rgba(255,124,190,.58);
        box-shadow:inset 0 1px rgba(255,255,255,.13),0 18px 40px rgba(255,22,132,.12)
      }
      .ach54-card.locked{filter:grayscale(.65);opacity:.48}
      .ach54-card.secret.locked strong,.ach54-card.secret.locked p{filter:blur(4px);user-select:none}
      .ach54-icon{
        width:72px;height:72px;border-radius:50%;display:grid;place-items:center;
        font-size:38px;background:radial-gradient(circle,#fff,#ffd9eb);
        color:#220015;box-shadow:0 12px 30px rgba(0,0,0,.25);margin-bottom:13px
      }
      .ach54-card strong{font-size:15px;margin-bottom:6px}
      .ach54-card p{margin:0;color:#cdbfc9;font-size:12px;line-height:1.45}
      .ach54-card small{
        position:absolute;right:10px;top:10px;padding:5px 8px;border-radius:999px;
        background:rgba(255,255,255,.08);font-size:9px;font-weight:900;letter-spacing:.08em
      }
      .ach54-card.earned small{background:#ff1684;color:white}
      .ach54-footer{
        margin-top:22px;text-align:center;color:#cdbfc9;font-size:12px
      }
      .ach54-toast{
        position:fixed;left:50%;top:24px;z-index:100350;max-width:min(90vw,680px);
        transform:translate(-50%,-18px);opacity:0;padding:14px 20px;border-radius:999px;
        background:#fff;color:#2b001a;font-weight:900;text-align:center;
        box-shadow:0 18px 55px rgba(0,0,0,.35);transition:.25s;pointer-events:none
      }
      .ach54-toast.show{opacity:1;transform:translate(-50%,0)}
      .ach54-confetti{
        position:fixed;left:50%;top:42%;z-index:100340;font-style:normal;font-size:21px;
        pointer-events:none;animation:ach54Pop 1.6s ease-out forwards
      }
      @keyframes ach54Pop{
        to{transform:translate(var(--x),250px) rotate(var(--r));opacity:0}
      }
      @media(max-width:900px){.ach54-grid{grid-template-columns:repeat(3,1fr)}}
      @media(max-width:680px){
        .ach54-nav-button{width:100%;text-align:left;padding:12px 0}
        .ach54-shell{padding:26px 16px 34px;border-radius:22px}
        .ach54-grid{grid-template-columns:repeat(2,1fr);gap:10px}
        .ach54-card{min-height:170px;padding:13px}
        .ach54-progress{grid-template-columns:1fr;text-align:center}
      }
      @media(prefers-reduced-motion:reduce){
        .ach54-modal,.ach54-shell,.ach54-track i,.ach54-confetti{transition:none!important;animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function render() {
    const modal = document.querySelector('.ach54-modal');
    if (!modal) return;

    const total = Object.keys(definitions).length;
    const unlocked = Object.keys(state.unlocked).filter(id => definitions[id]).length;
    const percent = Math.round((unlocked / total) * 100);

    modal.querySelector('.ach54-shell').innerHTML = `
      <button class="ach54-close" type="button" aria-label="Close achievements">×</button>
      <header class="ach54-heading">
        <small>JAHNTELLA REWARDS</small>
        <h2>Sweet <em>Achievements.</em></h2>
        <p>Explore, listen, collect and uncover secrets. Every achievement adds 25 XP and 5 Sweet Coins to your Sweet Passport.</p>
      </header>

      <div class="ach54-progress">
        <strong>${unlocked}/${total}</strong>
        <div class="ach54-track" aria-label="${percent}% complete"><i style="width:${percent}%"></i></div>
        <span>${percent}% complete</span>
      </div>

      <div class="ach54-grid">
        ${Object.entries(definitions).map(([id, item]) => {
          const earned = Boolean(state.unlocked[id]);
          const hiddenTitle = item.secret && !earned ? 'Secret Achievement' : item.title;
          const hiddenDescription = item.secret && !earned ? 'Keep collecting to reveal this hidden badge.' : item.description;
          return `
            <article class="ach54-card ${earned ? 'earned' : 'locked'} ${item.secret ? 'secret' : ''}">
              <small>${earned ? 'UNLOCKED' : 'LOCKED'}</small>
              <div class="ach54-icon">${earned ? item.icon : '?'}</div>
              <strong>${escapeHtml(hiddenTitle)}</strong>
              <p>${escapeHtml(hiddenDescription)}</p>
            </article>
          `;
        }).join('')}
      </div>

      <p class="ach54-footer">Your achievements are saved automatically on this device.</p>
    `;

    modal.querySelector('.ach54-close').addEventListener('click', closeModal);
  }

  function openModal() {
    const modal = document.querySelector('.ach54-modal');
    if (!modal) return;
    state.opened = Number(state.opened || 0) + 1;
    saveState();
    importPassportProgress();
    inspectVault();
    render();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.querySelector('.ach54-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function buildInterface() {
    const nav = document.getElementById('siteNav');
    if (nav && !nav.querySelector('.ach54-nav-button')) {
      const button = document.createElement('button');
      button.className = 'ach54-nav-button';
      button.type = 'button';
      button.textContent = 'Achievements';
      button.setAttribute('aria-label', 'Open Sweet Achievements');
      button.addEventListener('click', openModal);

      const passport = nav.querySelector('.sp53-nav-button');
      if (passport?.nextSibling) nav.insertBefore(button, passport.nextSibling);
      else nav.appendChild(button);
    }

    if (!document.querySelector('.ach54-modal')) {
      const modal = document.createElement('div');
      modal.className = 'ach54-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '<section class="ach54-shell" role="dialog" aria-modal="true" aria-label="Sweet Achievements"></section>';
      modal.addEventListener('click', event => {
        if (event.target === modal) closeModal();
      });
      document.body.appendChild(modal);
    }

    render();
  }

  function listenForProgress() {
    document.addEventListener('click', event => {
      const place = event.target.closest('[data-sweetville-place]');
      if (place) {
        unlock('explorer');
        setTimeout(importPassportProgress, 500);
      }

      if (event.target.closest('#surpriseButton,.machine-button')) {
        setTimeout(() => unlock('packOpener'), 450);
      }

      if (event.target.closest('.hidden-star')) {
        setTimeout(() => {
          if (document.querySelectorAll('.hidden-star.collected').length >= 4) unlock('starHunter');
        }, 300);
      }

      if (event.target.closest('#floatingVaultButton,#collectionDialog,.floating-vault-button')) {
        setTimeout(inspectVault, 500);
      }
    }, true);

    const funDipp = document.getElementById('audioFunDipp');
    const pinkLips = document.getElementById('audioPinkLips');

    document.querySelectorAll('audio').forEach(audio => {
      audio.addEventListener('play', () => unlock('firstSpin'), { passive: true });
    });

    if (pinkLips) {
      pinkLips.addEventListener('play', () => unlock('remixAfterDark'), { passive: true });
    }

    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', () => {
        if (form.closest('#sweet-list,.newsletter-section') || form.id.toLowerCase().includes('newsletter')) {
          unlock('sweetList');
        }
      });
    });

    const observer = new MutationObserver(() => inspectVault());
    ['collectionUnlocked', 'vaultSecretStatus'].forEach(id => {
      const target = document.getElementById(id);
      if (target) observer.observe(target, { childList: true, characterData: true, subtree: true });
    });
  }

  function updateVersion() {
    const badge = document.getElementById('buildBadge');
    if (badge) badge.textContent = `BUILD ${VERSION}`;
    window.JAHNTELLA_BUILD = VERSION;
  }

  function init() {
    addStyles();
    buildInterface();
    unlock('firstSteps', false);
    importPassportProgress();
    inspectVault();
    listenForProgress();
    updateVersion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
