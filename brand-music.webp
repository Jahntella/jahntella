
(() => {
  const dialog = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImg');
  document.querySelectorAll('.lightbox-trigger').forEach(button => {
    button.addEventListener('click', () => {
      image.src = button.dataset.src;
      image.alt = button.querySelector('img')?.alt || 'Investor presentation image';
      dialog.showModal();
    });
  });
  document.getElementById('close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog?.open) dialog.close();
  });
})();
