(() => {
  'use strict';

  const modal=document.getElementById('exp294ContactModal');
  if(!modal)return;

  const form=modal.querySelector('form');
  const close=modal.querySelector('[data-exp294-close]');
  const subject=form?.querySelector('[name="_subject"]');
  const inquiry=form?.querySelector('[name="inquiry_type"]');

  const open=(type='General Inquiry')=>{
    if(subject)subject.value=type;
    if(inquiry)inquiry.value=type;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>form?.querySelector('[name="name"]')?.focus(),50);
  };
  const shut=()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  };

  document.querySelectorAll('a[href^="mailto:"], [data-exp294-contact]').forEach(link=>{
    link.addEventListener('click',event=>{
      event.preventDefault();
      const type=link.dataset.subject || link.textContent.trim() || 'General Inquiry';
      open(type);
    });
  });

  close?.addEventListener('click',shut);
  modal.addEventListener('click',event=>{if(event.target===modal)shut()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')shut()});
})();