/* SWEETVILLE EXP 9.1 — SWEETVILLE GALLERY */
(() => {
  'use strict';

  const STORAGE_KEY = 'sweetvilleExp90Gallery';
  const DISPLAY_KEY = 'sweetvilleExp91DisplayedArtwork';

  const wall = document.getElementById('exp91GalleryWall');
  const count = document.getElementById('exp91GalleryCount');
  const message = document.getElementById('exp91GalleryMessage');
  const openLatest = document.getElementById('exp91OpenLatest');
  const roomImage = document.getElementById('exp91RoomArtwork');
  const roomTitle = document.getElementById('exp91RoomArtworkTitle');
  const roomPlaceholder = document.querySelector('.exp91-room-art-placeholder');

  const readGallery = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const saveGallery = gallery => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
    window.dispatchEvent(new CustomEvent('sweetville:gallery-changed', {detail:gallery}));
  };

  const getDisplayedId = () => {
    const value = Number(localStorage.getItem(DISPLAY_KEY));
    return Number.isFinite(value) ? value : 0;
  };

  const setDisplayedId = id => {
    localStorage.setItem(DISPLAY_KEY, String(id));
  };

  const createModal = () => {
    let modal = document.getElementById('exp91ArtworkModal');
    if (modal) return modal;

    modal = document.createElement('dialog');
    modal.id = 'exp91ArtworkModal';
    modal.className = 'exp91-artwork-modal';
    modal.innerHTML = `
      <div class="exp91-modal-card">
        <button type="button" class="exp91-modal-close" aria-label="Close artwork">×</button>
        <img alt="Saved Sweetville artwork">
        <div class="exp91-modal-copy">
          <small>CREATED WITH JAHNTELLA</small>
          <h3></h3>
          <p></p>
          <div>
            <button type="button" class="sv-button secondary exp91-display-room">Display in My Room</button>
            <button type="button" class="sv-button primary exp91-download-art">Download Again</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const close = () => {
      if (typeof modal.close === 'function' && modal.open) modal.close();
      else modal.removeAttribute('open');
    };

    modal.querySelector('.exp91-modal-close')?.addEventListener('click', close);
    modal.addEventListener('cancel', event => {
      event.preventDefault();
      close();
    });
    modal.addEventListener('click', event => {
      if (event.target === modal) close();
    });

    return modal;
  };

  const openArtwork = item => {
    if (!item) return;
    const modal = createModal();
    modal.dataset.artworkId = String(item.id);
    modal.querySelector('img').src = item.data;
    modal.querySelector('h3').textContent = item.title || 'Sweetville Artwork';
    modal.querySelector('p').textContent = `Created ${item.date || 'in Sweetville'}`;

    modal.querySelector('.exp91-display-room').onclick = () => {
      setDisplayedId(item.id);
      updateRoom();
      if (message) message.textContent = '“I put your artwork somewhere special.” — Jahntella';
      modal.querySelector('.exp91-display-room').textContent = 'Displayed in My Room 💖';
      window.setTimeout(() => {
        modal.querySelector('.exp91-display-room').textContent = 'Display in My Room';
      }, 1800);
    };

    modal.querySelector('.exp91-download-art').onclick = () => {
      const link = document.createElement('a');
      link.download = `sweetville-gallery-${item.id}.png`;
      link.href = item.data;
      link.click();
    };

    try {
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open','');
    } catch {
      modal.setAttribute('open','');
    }
  };

  const deleteArtwork = id => {
    const gallery = readGallery();
    const item = gallery.find(entry => entry.id === id);
    if (!item) return;

    if (!window.confirm(`Remove "${item.title}" from your gallery?`)) return;

    const next = gallery.filter(entry => entry.id !== id);
    saveGallery(next);

    if (getDisplayedId() === id) {
      localStorage.removeItem(DISPLAY_KEY);
    }

    render();
    updateRoom();
  };

  const render = () => {
    const gallery = readGallery();
    if (count) count.textContent = String(gallery.length);

    if (!wall) return;

    if (!gallery.length) {
      wall.innerHTML = `
        <div class="exp91-gallery-empty">
          <span>🎨</span>
          <h3>Your gallery is waiting.</h3>
          <p>Save a coloring page and Jahntella will frame it here for you.</p>
          <a class="sv-button primary" href="#coloringStudio">Create Your First Artwork</a>
        </div>`;
      if (openLatest) openLatest.disabled = true;
      return;
    }

    if (openLatest) openLatest.disabled = false;

    wall.innerHTML = gallery.map((item,index) => `
      <article class="exp91-art-frame ${getDisplayedId() === item.id ? 'displayed' : ''}" data-artwork="${item.id}" style="--tilt:${index % 2 ? '1.2deg' : '-1.2deg'}">
        <button class="exp91-art-open" type="button" aria-label="Open ${item.title || 'artwork'}">
          <span class="exp91-frame-glow"></span>
          <img src="${item.data}" alt="${item.title || 'Saved Sweetville artwork'}">
        </button>
        <div class="exp91-art-caption">
          <div>
            <strong>${item.title || 'Sweetville Artwork'}</strong>
            <small>${item.date || ''}</small>
          </div>
          <button type="button" class="exp91-art-delete" aria-label="Delete artwork">×</button>
        </div>
        ${getDisplayedId() === item.id ? '<span class="exp91-room-tag">IN MY ROOM</span>' : ''}
      </article>`
    ).join('');

    wall.querySelectorAll('.exp91-art-open').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.closest('[data-artwork]')?.dataset.artwork);
        openArtwork(gallery.find(item => item.id === id));
      });
    });

    wall.querySelectorAll('.exp91-art-delete').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const id = Number(button.closest('[data-artwork]')?.dataset.artwork);
        deleteArtwork(id);
      });
    });
  };

  const updateRoom = () => {
    const gallery = readGallery();
    const displayedId = getDisplayedId();
    const item = gallery.find(entry => entry.id === displayedId) || gallery[0];

    if (!roomImage || !roomTitle) return;

    if (!item) {
      roomImage.hidden = true;
      if (roomPlaceholder) roomPlaceholder.hidden = false;
      roomTitle.textContent = 'No artwork displayed yet';
      return;
    }

    roomImage.src = item.data;
    roomImage.hidden = false;
    if (roomPlaceholder) roomPlaceholder.hidden = true;
    roomTitle.textContent = item.title || 'Sweetville Artwork';

    if (!displayedId) setDisplayedId(item.id);
  };

  openLatest?.addEventListener('click', () => {
    openArtwork(readGallery()[0]);
  });

  window.addEventListener('storage', () => {
    render();
    updateRoom();
  });

  window.addEventListener('sweetville:gallery-changed', () => {
    render();
    updateRoom();
  });

  // Coloring Studio already writes to the shared gallery key.
  document.getElementById('exp90SaveBrowser')?.addEventListener('click', () => {
    window.setTimeout(() => {
      render();
      updateRoom();
      if (message) message.textContent = '“I framed your newest creation for you.” — Jahntella';
    }, 120);
  });

  render();
  updateRoom();
})();
