(() => {
  'use strict';

  const tools={
    coloring:'coloringStudio',
    creative:'creativeStudio',
    gallery:'sweetvilleGallery',
    photo:'photoBooth'
  };

  const revealTarget=id=>{
    const target=document.getElementById(id);
    if(!target)return false;

    // Leave map-only mode so the real creation section becomes visible.
    document.body.classList.add('exp260-explore-mode');

    // Remove any district-only inline display rules left by prior routing.
    document.querySelectorAll('main > section').forEach(section=>{
      section.style.removeProperty('display');
    });

    // Close overlays that could block the selected tool.
    document.getElementById('svCinematicIntro')?.classList.add('finished');
    document.getElementById('svCinematicIntro')?.setAttribute('aria-hidden','true');
    document.getElementById('gateScreen')?.classList.add('open');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');

    setTimeout(()=>{
      target.scrollIntoView({behavior:'smooth',block:'start'});
    },100);
    return true;
  };

  // Handle direct URLs from Sweet Studio.
  const params=new URLSearchParams(location.search);
  const requestedTool=params.get('tool');
  if(requestedTool&&tools[requestedTool]){
    window.addEventListener('load',()=>{
      revealTarget(tools[requestedTool]);

      const mode=params.get('mode');
      if(mode){
        setTimeout(()=>{
          document.querySelector(`[data-mode="${CSS.escape(mode)}"]`)?.click();
        },500);
      }
    });
  }

  // Handle the four cards shown in the user's screenshot.
  document.querySelectorAll('#createHub a[href^="#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const id=(link.getAttribute('href')||'').slice(1);
      if(!id)return;
      event.preventDefault();
      history.replaceState(null,'',`#${id}`);
      revealTarget(id);
    });
  });

  // Also make any other links to these tools reliable.
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link)return;
    const id=(link.getAttribute('href')||'').slice(1);
    if(!Object.values(tools).includes(id))return;
    event.preventDefault();
    history.replaceState(null,'',`#${id}`);
    revealTarget(id);
  });
})();