(() => {
  const ticket = document.getElementById("exp67Countdown");
  const toggle = document.getElementById("exp67Toggle");
  const handle = document.getElementById("exp67DragHandle");
  if (!ticket || !toggle || !handle) return;

  const units = {
    days: document.getElementById("exp67Days"),
    hours: document.getElementById("exp67Hours"),
    minutes: document.getElementById("exp67Minutes"),
    seconds: document.getElementById("exp67Seconds")
  };
  const message = document.getElementById("exp67Message");
  const shineRelease = document.createElement("p");
  shineRelease.className = "exp67-shine-release";
  shineRelease.innerHTML = "<strong>THE SHINE ERA</strong><span>DROPPING SEPTEMBER 25TH</span>";
  message?.insertAdjacentElement("afterend", shineRelease);
  const deadline = new Date(2026, 7, 27, 0, 0, 0, 0);
  const storageKey = "jahntellaAlbumCountdown67";
  let state = {};

  try { state = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (_) {}

  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  };

  const setCollapsed = (collapsed, userAction = false) => {
    ticket.classList.toggle("is-collapsed", collapsed);
    if (userAction) ticket.classList.toggle("is-user-open", !collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Open album countdown" : "Minimize album countdown");
    toggle.textContent = collapsed ? "+" : "−";
    state.collapsed = collapsed;
    save();
  };

  if (state.collapsed === true) setCollapsed(true);
  if (state.collapsed === false) ticket.classList.add("is-user-open");

  toggle.addEventListener("click", () => {
    const mobileAutoCollapsed = matchMedia("(max-width: 720px)").matches && !ticket.classList.contains("is-user-open");
    setCollapsed(!(ticket.classList.contains("is-collapsed") || mobileAutoCollapsed), true);
  });

  const pad = value => String(value).padStart(2, "0");
  const update = () => {
    const remaining = deadline.getTime() - Date.now();
    if (remaining <= 0) {
      Object.values(units).forEach(unit => { if (unit) unit.textContent = "00"; });
      ticket.classList.add("is-expired");
      if (message) message.innerHTML = "<strong>ALBUM AVAILABLE NOW</strong><span>Sweetie Roll Call is open ♡</span>";
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    if (units.days) units.days.textContent = pad(Math.floor(totalSeconds / 86400));
    if (units.hours) units.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    if (units.minutes) units.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    if (units.seconds) units.seconds.textContent = pad(totalSeconds % 60);
  };

  update();
  setInterval(update, 1000);

  if (Number.isFinite(state.left) && Number.isFinite(state.top)) {
    ticket.style.left = `${Math.max(6, Math.min(state.left, innerWidth - ticket.offsetWidth - 6))}px`;
    ticket.style.top = `${Math.max(6, Math.min(state.top, innerHeight - ticket.offsetHeight - 6))}px`;
    ticket.style.right = "auto";
  }

  let drag = null;
  handle.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    const rect = ticket.getBoundingClientRect();
    drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener("pointermove", event => {
    if (!drag) return;
    const left = Math.max(6, Math.min(event.clientX - drag.x, innerWidth - ticket.offsetWidth - 6));
    const top = Math.max(6, Math.min(event.clientY - drag.y, innerHeight - ticket.offsetHeight - 6));
    ticket.style.left = `${left}px`;
    ticket.style.top = `${top}px`;
    ticket.style.right = "auto";
  });

  const endDrag = event => {
    if (!drag) return;
    const rect = ticket.getBoundingClientRect();
    state.left = Math.round(rect.left);
    state.top = Math.round(rect.top);
    save();
    drag = null;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  };
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  addEventListener("resize", () => {
    if (ticket.style.left) {
      const rect = ticket.getBoundingClientRect();
      const left = Math.max(6, Math.min(rect.left, innerWidth - ticket.offsetWidth - 6));
      const top = Math.max(6, Math.min(rect.top, innerHeight - ticket.offsetHeight - 6));
      ticket.style.left = `${left}px`;
      ticket.style.top = `${top}px`;
    }
  });

  // Sweet Era back-cover cache-bust: force the browser/CDN to request the newest live artwork.
  const refreshSweetEraBackCover = () => {
    document.querySelectorAll('[data-lightbox="assets/album/the-sweet-era-back.webp?v=84.0"]').forEach(node => {
      node.dataset.lightbox = 'assets/album/the-sweet-era-back.webp?v=86.0';
    });
    document.querySelectorAll('img[src="assets/album/the-sweet-era-back-thumb.webp?v=84.0"]').forEach(img => {
      img.src = 'assets/album/the-sweet-era-back-thumb.webp?v=86.0';
    });
    document.querySelectorAll('[data-lightbox="assets/album/the-sweet-era-back.webp?v=85.0"]').forEach(node => {
      node.dataset.lightbox = 'assets/album/the-sweet-era-back.webp?v=86.0';
    });
    document.querySelectorAll('img[src="assets/album/the-sweet-era-back-thumb.webp?v=85.0"]').forEach(img => {
      img.src = 'assets/album/the-sweet-era-back-thumb.webp?v=86.0';
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshSweetEraBackCover, { once: true });
  else refreshSweetEraBackCover();
})();
