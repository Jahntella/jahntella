(() => {
  'use strict';

  const pages = [
    { src: 'images/cover.png', label: 'Cover', alt: 'Sweeties Magazine Issue 001 cover' },
    { src: 'images/page-01.png', label: 'Page 1', alt: 'Letter from Jahntella' },
    { src: 'images/page-02.png', label: 'Page 2', alt: 'My Sweet Story' },
    { src: 'images/page-03.png', label: 'Page 3', alt: 'The First Song' },
    { src: 'images/page-04.png', label: 'Page 4', alt: 'Welcome to Sweetville' },
    { src: 'images/page-05.png', label: 'Page 5', alt: 'Inside the Studio' },
    { src: 'images/page-06.png', label: 'Page 6', alt: 'On Stage' },
    { src: 'images/page-07.png', label: 'Page 7', alt: 'Sweet Dreams' },
    { src: 'images/page-08.png', label: 'Page 8', alt: 'Dear Sweeties letter' },
    { src: 'images/page-09.png', label: 'Page 9', alt: 'Dear Sweeties community page' },
    { src: 'images/back-cover.png', label: 'Back Cover', alt: 'Sweeties Magazine back cover' }
  ];

  const image = document.getElementById('pageImage');
  const card = document.getElementById('pageCard');
  const stage = document.getElementById('pageStage');
  const previous = document.getElementById('previousButton');
  const next = document.getElementById('nextButton');
  const label = document.getElementById('pageLabel');
  const count = document.getElementById('pageCount');
  const slider = document.getElementById('pageSlider');
  const dots = document.getElementById('pageDots');
  const fullscreen = document.getElementById('fullscreenButton');

  let current = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let locked = false;

  pages.forEach((page, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'page-dot';
    dot.setAttribute('aria-label', `Open ${page.label}`);
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);

    if (index > 0) {
      const preload = new Image();
      preload.src = page.src;
    }
  });

  const updateUI = () => {
    const page = pages[current];
    image.src = page.src;
    image.alt = page.alt;
    label.textContent = page.label;
    count.textContent = `${current + 1} / ${pages.length}`;
    slider.value = String(current);
    previous.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    [...dots.children].forEach((dot, index) => dot.classList.toggle('active', index === current));
    document.title = `${page.label} — Sweeties Magazine Issue 001`;
  };

  const goTo = (target) => {
    if (locked || target === current || target < 0 || target >= pages.length) return;
    locked = true;
    const direction = target > current ? 'flip-next' : 'flip-prev';
    card.classList.remove('flip-next', 'flip-prev');
    void card.offsetWidth;
    card.classList.add(direction);

    window.setTimeout(() => {
      current = target;
      updateUI();
    }, 255);

    window.setTimeout(() => {
      card.classList.remove(direction);
      locked = false;
    }, 570);
  };

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  slider.addEventListener('input', (event) => goTo(Number(event.target.value)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(current - 1);
    if (event.key === 'ArrowRight' || event.key === ' ') goTo(current + 1);
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(pages.length - 1);
  });

  stage.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  stage.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      goTo(deltaX < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  fullscreen.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen is not available in this browser.', error);
    }
  });

  updateUI();
})();
