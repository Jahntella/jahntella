/* SWEETVILLE EXP 8.0 — LITTLE MOMENTS */
(() => {
  'use strict';

  const KEY = 'sweetvilleExp80Moments';
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

  const moments = [
    {icon:'☕',place:'PINK CAFÉ',title:'I saved you a seat.',text:'Stay for one quiet minute. Imagine a warm drink, soft music, and rain against the window.',keep:'A Quiet Café Minute',keepText:'A tiny reminder that slowing down still counts.'},
    {icon:'✨',place:'SPARKLE LAKE',title:'Let’s watch the light move.',text:'Take three slow breaths and picture the lake glowing while the fireflies drift past.',keep:'A Sparkle Lake Breath',keepText:'Three calm breaths from the shore of Sweetville.'},
    {icon:'🎹',place:'MELODY STUDIO',title:'I wrote you four notes.',text:'Open the mini piano and play any four notes. There is no wrong melody today.',keep:'A Tiny Melody',keepText:'Four notes that belonged only to this moment.'},
    {icon:'🍓',place:'SWEETVILLE BAKERY',title:'I made too much strawberry frosting.',text:'Think of one person who deserves something kind today. Maybe send them a sweet message.',keep:'A Strawberry Kindness',keepText:'A small kindness shared from Jahntella’s kitchen.'},
    {icon:'🐾',place:'MOCHI’S CORNER',title:'Mochi thinks you need a smile.',text:'He has officially declared today a no-serious-face zone for the next thirty seconds.',keep:'Mochi’s Smile Break',keepText:'Proof that a tiny laugh can change a day.'}
  ];

  const jokes = [
    'Mochi chased his tail today. He says he won.',
    'Why did the donut blush? It saw the coffee without its lid.',
    'Jahntella asked Mochi to guard the cookies. There are now fewer cookies.',
    'Sparkle Lake called. It wants its glitter back.',
    'The piano keys are arguing again. It is a very minor disagreement.'
  ];

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
  };

  const save = state => localStorage.setItem(KEY, JSON.stringify(state));
  const state = read();
  state.visits = Number(state.visits || 0) + (sessionStorage.getItem('exp80Session') ? 0 : 1);
  sessionStorage.setItem('exp80Session','1');
  state.memories = Array.isArray(state.memories) ? state.memories : [];
  save(state);

  const index = Math.abs([...dayKey].reduce((a,c)=>a+c.charCodeAt(0),0)) % moments.length;
  const moment = moments[index];

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning. I’m really glad you came.'
    : hour < 18 ? 'I’m really glad you stopped by today.'
    : 'Welcome back. The lights are softer tonight.';

  set('exp80Greeting', greeting);
  set('exp80MomentIcon', moment.icon);
  set('exp80MomentPlace', moment.place);
  set('exp80MomentTitle', moment.title);
  set('exp80MomentText', moment.text);
  set('exp80KeepsakeTitle', moment.keep);
  set('exp80KeepsakeText', moment.keepText);
  set('exp80MemoryCount', state.memories.length);
  set('exp80VisitCount', state.visits);

  const begin = document.getElementById('exp80BeginMoment');
  const keep = document.getElementById('exp80SaveKeepsake');
  const card = document.getElementById('exp80MomentCard');
  const keepsake = document.getElementById('exp80KeepsakeCard');

  begin?.addEventListener('click', () => {
    card?.classList.add('exp80-sharing');
    set('exp80GreetingText', 'Stay as long as you need. Sweetville is not in a hurry.');
    window.setTimeout(() => card?.classList.remove('exp80-sharing'), 2600);
    window.sweetvilleLaunchFireworks?.(innerWidth*.5, innerHeight*.2, 20);
  });

  keep?.addEventListener('click', () => {
    if (!state.memories.includes(dayKey)) state.memories.push(dayKey);
    save(state);
    set('exp80MemoryCount', state.memories.length);
    keep.textContent = 'Memory Kept 💖';
    keep.disabled = true;
    keepsake?.classList.add('exp80-kept');
  });

  if (state.memories.includes(dayKey) && keep) {
    keep.textContent = 'Memory Kept 💖';
    keep.disabled = true;
    keepsake?.classList.add('exp80-kept');
  }

  let jokeIndex = Math.floor(Math.random()*jokes.length);
  set('exp80Joke', jokes[jokeIndex]);
  document.getElementById('exp80NewSmile')?.addEventListener('click', () => {
    jokeIndex = (jokeIndex + 1 + Math.floor(Math.random()*(jokes.length-1))) % jokes.length;
    set('exp80Joke', jokes[jokeIndex]);
    const smile = document.getElementById('exp80SmileCard');
    smile?.classList.remove('exp80-pop');
    void smile?.offsetWidth;
    smile?.classList.add('exp80-pop');
  });

  window.addEventListener('sweetville:progress-changed', () => {
    set('exp80MemoryCount', state.memories.length);
  });
})();
