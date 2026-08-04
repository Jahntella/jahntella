
(() => {
  'use strict';

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  const visitorKey = 'sweetvilleExp191Visitor';
  let visitor = readJSON(visitorKey, null);

  if (!visitor) {
    visitor = {
      number: String(Math.floor(100000 + Math.random() * 900000)),
      trips: 0,
      favorite: 'Not chosen yet'
    };
  }

  visitor.trips = Number(visitor.trips || 0) + 1;
  localStorage.setItem(visitorKey, JSON.stringify(visitor));

  const memoriesA = readJSON('sweetvilleExp120DayMoments', []);
  const memoriesB = readJSON('sweetvilleExp1618Memories', []);
  const memoryTotal = (Array.isArray(memoriesA) ? memoriesA.length : 0) + (Array.isArray(memoriesB) ? memoriesB.length : 0);

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setText('exp191VisitorNumber', visitor.number);
  setText('exp191Trips', String(visitor.trips));
  setText('exp191Memories', String(memoryTotal));
  setText('exp191Favorite', visitor.favorite || 'Not chosen yet');

  document.querySelectorAll('[data-destination]').forEach(button => {
    button.addEventListener('click', () => {
      visitor.favorite = button.dataset.destination || visitor.favorite;
      localStorage.setItem(visitorKey, JSON.stringify(visitor));
      setText('exp191Favorite', visitor.favorite);
    });
  });
})();
