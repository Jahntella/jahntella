<!doctype html>
<html lang="en" data-phase="night">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#120015">
  <meta name="description" content="Sweetville Build v5.1: Jahntella's House, quests, puppy NPCs, weather, shops, citizen passports, and the Castle Grand Hall.">
  <title>Sweetville Build v5.1 — Welcome Home</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&family=Sacramento&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="sweetville.css?v=5.1">
</head>
<body>
  <div class="weather-layer" id="weatherLayer"></div>

  <header class="sv-header">
    <a class="sv-brand" href="../index.html">Jahntella<span>♡</span></a>
    <button class="sv-menu-button" id="menuButton">☰</button>
    <nav id="svNav">
      <a href="#world">World</a>
      <a href="#house">Jahntella's House</a>
      <a href="#quests">Quests</a>
      <a href="#citizen">Citizen Passport</a>
      <a href="#npcs">Friends</a>
      <a href="#shops">Shops</a>
      <a href="#castle">Castle</a>
      <a href="story.html">Story Mode</a>
    </nav>
  </header>

  <main>
    <section class="hero" id="world">
      <div>
        <p class="eyebrow">SWEETVILLE BUILD v5.1</p>
        <h1>Welcome <em>home.</em></h1>
        <p>Sweetville now remembers you. Jahntella's House is open, quests are live, new friends are waiting, and a puppy has made the city its home.</p>

        <div class="actions">
          <a class="btn primary" href="#house">Enter Jahntella's House</a>
          <a class="btn secondary" href="#quests">View Today's Quests</a>
        </div>

        <div class="status">
          <div><small>WEATHER</small><strong id="weatherName">Starlight</strong></div>
          <div><small>CITIZEN RANK</small><strong id="citizenRank">Visitor</strong></div>
          <div><small>QUESTS COMPLETE</small><strong id="questCount">0 / 5</strong></div>
          <div><small>PUPPY FRIENDSHIP</small><strong id="puppyFriendship">0%</strong></div>
        </div>
      </div>

      <div class="hero-orb">
        <span>💋</span>
        <strong>SWEETVILLE</strong>
        <small>BUILD v5.1 • WELCOME HOME</small>
      </div>
    </section>

    <section class="panel" id="house">
      <p class="eyebrow">JAHNTELLA'S HOUSE</p>
      <h2>The lights are finally <em>on.</em></h2>
      <p>Explore the emotional center of Sweetville. Every room holds something personal.</p>

      <div class="house">
        <button data-room="piano">🎹<strong>Piano</strong><small>Play a melody</small></button>
        <button data-room="notebook">📖<strong>Lyric Notebook</strong><small>Read private lyrics</small></button>
        <button data-room="wardrobe">👗<strong>Wardrobe</strong><small>Explore iconic looks</small></button>
        <button data-room="records">🏆<strong>Gold Records</strong><small>See milestones</small></button>
        <button data-room="photos">📸<strong>Photo Wall</strong><small>Memory gallery</small></button>
        <button data-room="booth">🎤<strong>Recording Booth</strong><small>Leave a voice note</small></button>
        <button data-room="letter">💌<strong>Private Letter</strong><small>For Sweeties only</small></button>
      </div>

      <div class="house-display visual-house-display" id="houseDisplay">
        <div class="house-feature-image">
          <img src="../assets/fun-dipp-cover.png" alt="Jahntella Fun Dipp artwork">
        </div>
        <div>
          <p class="eyebrow">NOW PLAYABLE</p>
          <h3>Jahntella's Music Room</h3>
          <p>Choose a room to explore, or sit at the piano and play through your speakers.</p>
          <button class="btn primary" id="openPiano">Play the Sweetville Piano</button>
        </div>
      </div>

      <div class="piano-stage" id="pianoStage">
        <div class="piano-copy">
          <p class="eyebrow">INTERACTIVE PIANO</p>
          <h3>Play a little <em>Sweetville melody.</em></h3>
          <p>Click the keys or use your computer keyboard. White keys: A S D F G H J K. Black keys: W E T Y U.</p>
          <div class="piano-controls">
            <button class="btn secondary" id="pianoDemo">▶ Play Sweetville Demo</button>
            <button class="btn secondary" id="pianoSustain">Sustain: Off</button>
          </div>
          <p class="now-playing" id="nowPlaying">Ready to play.</p>
        </div>
        <div class="piano-shell">
          <div class="piano-brand">Jahntella <span>♡</span></div>
          <div class="piano-keys" id="pianoKeys" aria-label="Interactive piano keyboard"></div>
        </div>
      </div>
    </section>

    <section class="panel" id="quests">
      <p class="eyebrow">REAL QUESTS</p>
      <h2>Sweetville needs your <em>help.</em></h2>
      <div class="quest-grid" id="questGrid"></div>
    </section>

    <section class="panel" id="citizen">
      <p class="eyebrow">SWEETVILLE CITIZEN PASSPORT</p>
      <h2>Your place in the world is now <em>official.</em></h2>

      <div class="passport">
        <div class="passport-cover">
          <span>♡</span>
          <strong>SWEETVILLE</strong>
          <small>CITIZEN PASSPORT</small>
        </div>

        <div class="passport-info">
          <label>
            Citizen Name
            <input id="citizenName" maxlength="24" placeholder="Your Sweetie name">
          </label>
          <button class="btn primary" id="saveCitizen">Save Passport</button>

          <div class="passport-stats">
            <div><small>CITIZEN NUMBER</small><strong id="citizenNumber">SV-000000</strong></div>
            <div><small>JOIN DATE</small><strong id="joinDate">—</strong></div>
            <div><small>RANK</small><strong id="passportRank">Visitor</strong></div>
            <div><small>LIFETIME VISITS</small><strong id="lifetimeVisits">0</strong></div>
            <div><small>COMPLETION</small><strong id="completion">0%</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel" id="npcs">
      <p class="eyebrow">SWEETVILLE FRIENDS</p>
      <h2>Everyone remembers <em>you.</em></h2>

      <div class="npc-grid">
        <button class="npc-poppy" data-npc="poppy"><span class="npc-photo">🐶</span><strong>Poppy the Puppy</strong><small>Your new Sweetville companion</small></button>
        <button class="npc-rosie" data-npc="rosie"><span class="npc-photo">☕</span><strong>Rosie</strong><small>Pink Café</small></button>
        <button class="npc-melody" data-npc="melody"><span class="npc-photo">🎹</span><strong>Melody</strong><small>Melody Studio</small></button>
        <button class="npc-donny" data-npc="donny"><span class="npc-photo">🍩</span><strong>Donny</strong><small>Donut District</small></button>
        <button class="npc-sprinkle" data-npc="sprinkle"><span class="npc-photo">👑</span><strong>Princess Sprinkle</strong><small>Castle messenger</small></button>
      </div>

      <div class="dialogue" id="npcDialogue">Choose a friend to talk.</div>
    </section>

    <section class="panel" id="shops">
      <p class="eyebrow">SWEETVILLE SHOPS</p>
      <h2>The city feels more <em>lived in.</em></h2>

      <div class="shop-grid">
        <article class="shop-candy"><span>🍭</span><strong>Candy Shop</strong><small>Decorative preview</small></article>
        <article class="shop-fashion"><span>👗</span><strong>Fashion Boutique</strong><small>Wardrobe expansion</small></article>
        <article class="shop-record"><span>🎵</span><strong>Record Store</strong><small>Music collection</small></article>
        <article class="shop-cafe"><span>☕</span><strong>Pink Café</strong><small>Daily ritual</small></article>
        <article class="shop-trophy"><span>🏆</span><strong>Trophy Shop</strong><small>Achievement displays</small></article>
      </div>
    </section>

    <section class="panel" id="castle">
      <p class="eyebrow">CASTLE EXPANSION</p>
      <h2>The Grand Hall is <em>open.</em></h2>

      <div class="castle castle-visual">
        <div class="castle-image">
          <img src="assets/sv-005-neon-sweetheart.png" alt="Sweetville castle atmosphere">
          <span class="throne">👑</span>
        </div>
        <div>
          <h3>Sweetville Grand Hall</h3>
          <p>Explore portraits, world history, and the Royal Archives. More rooms will open in future chapters.</p>
          <button class="btn primary" id="openArchive">Open Royal Archive</button>
        </div>
      </div>

      <div class="archive" id="archive" hidden>
        <h3>Royal Archive — Chapter Zero</h3>
        <p>Before Sweetville had streets, stages, cafés, or castles, it began as one promise: every soft heart deserves a place where it can still feel powerful.</p>
      </div>
    </section>
  </main>

  <dialog id="roomModal">
    <button id="roomClose">×</button>
    <div id="roomModalContent"></div>
  </dialog>

  <div class="toast" id="toast"></div>
  <script src="sweetville-v5.1.js?v=5.1"></script>
</body>
</html>
