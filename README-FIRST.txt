JAHNTELLA v4.3 — FIVE-SECOND HERO PATCH
========================================

This first-step patch changes ONLY the homepage hero.

WHAT IT DOES
------------
- Replaces the current split image hero with a full-screen video hero.
- Uses videos/Hero.mp4.
- Autoplay, muted, loop, playsinline.
- Adds a dark cinematic overlay.
- Keeps centered Jahntella branding.
- Adds a DIP IN button that leads to Music.
- Leaves Music, Story, Sweet Vault, Posters, Wallpapers, Merch, Gallery,
  Creative Director, and Connect untouched.

QUICK AUTOMATIC INSTALL
-----------------------
1. Extract this ZIP.
2. Copy apply_v4_3_hero_patch.py into the ROOT of your Jahntella repository,
   beside index.html.
3. Run:

   Windows:
       py apply_v4_3_hero_patch.py

   Mac/Linux:
       python3 apply_v4_3_hero_patch.py

4. Place your five-second video here:
       videos/Hero.mp4

5. Upload/commit these changes:
       index.html
       hero-v4.3.css
       videos/Hero.mp4

The script also creates:
       index-before-v4.3-hero.html

That is your automatic backup. You do not need to upload the backup to GitHub.

MANUAL INSTALL
--------------
- Replace the existing <section class="hero reveal" id="home">...</section>
  block with the contents of hero-section.html.
- Copy hero-v4.3.css into the repository root.
- Add this line immediately before </head> in index.html:

  <link rel="stylesheet" href="hero-v4.3.css?v=1">

- Create videos/ and add Hero.mp4.

IMPORTANT
---------
The filename and capitalization must be exact:
videos/Hero.mp4

GitHub Pages is case-sensitive.
