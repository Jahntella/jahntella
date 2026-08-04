(() => {
  const KEY='jahntellaBubblegumBayPassportV253';
  const button=document.getElementById('exp253StampButton');
  const title=document.getElementById('exp253PassportTitle');
  const text=document.getElementById('exp253PassportText');
  const row=document.querySelector('.exp253-passport-row');
  if(!button||!title||!text||!row)return;
  const render=()=>{
    const stamped=localStorage.getItem(KEY)==='yes';
    row.classList.toggle('is-stamped',stamped);
    button.disabled=stamped;
    button.textContent=stamped?'Bubblegum Bay Stamped ✓':'Stamp Bubblegum Bay';
    title.textContent=stamped?'Bubblegum Bay is in your Sweetie Passport':'Bubblegum Bay stamp waiting';
    text.textContent=stamped?'Your visit to Sweetville’s newest district is saved on this device.':'Visit the new district to add this destination to your device.';
  };
  button.addEventListener('click',()=>{localStorage.setItem(KEY,'yes');render();document.getElementById('exp254BubblegumBay')?.scrollIntoView({behavior:'smooth',block:'start'});});
  render();
})();