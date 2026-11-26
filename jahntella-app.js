/* World of Sweet PWA foundation: opt-in installation; no music autoplay or offline audio promises. */
(() => {
  'use strict';
  let installEvent=null;
  let userDismissed=false;
  const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const boot=()=>{
    if(!('serviceWorker' in navigator)){ /* Install instructions remain useful without SW. */ }
    else window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js',{scope:'/'}).catch(()=>{}),{once:true});
    const open=document.getElementById('jahntellaAppOpen');
    const dialog=document.getElementById('jahntellaAppDialog');
    const install=document.getElementById('jahntellaAppInstall');
    const guidance=document.getElementById('jahntellaAppInstructions');
    const status=document.getElementById('jahntellaAppStatus');
    const dismiss=document.getElementById('jahntellaAppClose');
    if(!open||!dialog||!install||!guidance||!status||!dismiss)return;
    const refresh=()=>{
      if(standalone()){
        open.textContent='♡ Jahntella App';
        status.textContent='World of Sweet is already installed on this device. ♡';
        guidance.hidden=true;install.hidden=true;return;
      }
      open.textContent='♡ Install App';
      install.hidden=!installEvent;
      guidance.hidden=!!installEvent;
      if(installEvent){status.textContent='Add Jahntella to your home screen for one-tap access to all six eras.';return;}
      if(ios()){
        status.textContent='Install Jahntella from Safari on your iPhone or iPad.';
        guidance.innerHTML='<li>Open jahntella.com in Safari.</li><li>Tap Share (square with upward arrow).</li><li>Choose <strong>Add to Home Screen</strong>, then tap Add.</li>';
      }else{
        status.textContent='Add Jahntella to your home screen from your browser menu.';
        guidance.innerHTML='<li>Open jahntella.com in Chrome or your preferred browser.</li><li>Open the browser menu (⋮).</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>, if offered.</li>';
      }
    };
    open.addEventListener('click',()=>{refresh();if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');});
    dismiss.addEventListener('click',()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');});
    dialog.addEventListener('click',e=>{if(e.target===dialog&&typeof dialog.close==='function')dialog.close();});
    install.addEventListener('click',async()=>{
      if(!installEvent)return;
      const prompt=installEvent;installEvent=null;refresh();
      try{await prompt.prompt();const response=await prompt.userChoice;status.textContent=response?.outcome==='accepted'?'Follow your device’s instructions to finish installing. ♡':'You can install Jahntella any time from this menu.';}
      catch(_){status.textContent='Try Install app or Add to Home Screen in your browser menu.';}
    });
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;refresh();});
    window.addEventListener('appinstalled',()=>{installEvent=null;refresh();});
    refresh();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
