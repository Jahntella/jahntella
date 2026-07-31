SWEETVILLE EXPANSION PACK v3.0 — STORY MODE

INCLUDES
1. Main homepage button:
   OPEN THE GATES / ENTER SWEETVILLE
2. New Sweetville Story Mode page:
   /sweetville/story.html
3. Story Mode teaser card for the Sweetville Living World page
4. Origin of Sweetville
5. Six Rules of Sweetville
6. Sweetville timeline
7. Letters from Jahntella

INSTALLATION

A. MAIN HOMEPAGE
Open /index.html.

Inside the existing:
<div class="hero-actions">

Add this third button after the current two buttons:

<a class="secondary-button sweetville-entry-button" href="sweetville/">
  <span>OPEN THE GATES</span>
  <small>ENTER SWEETVILLE →</small>
</a>

Then paste the contents of:
homepage-sweetville-button.css

at the bottom of /styles.css.


B. SWEETVILLE STORY MODE
Upload these two files into /sweetville/:

story.html
story-mode.css


C. ADD STORY MODE CARD TO SWEETVILLE
Open /sweetville/index.html.

Paste the contents of:
sweetville-story-card.html

immediately before:
<section class="secret-ending"

Then paste the contents of:
sweetville-story-card.css

at the bottom of /sweetville/sweetville.css.

OPTIONAL NAVIGATION LINK
Inside the Sweetville navigation, add:

<a href="story.html">Story Mode</a>


D. CLEANUP RECOMMENDED
The current /sweetville/index.html ends with an extra closing script tag:

<script src="sweetville-v2.0.2.js?v=2.0.2"></script></script>

Change it to:

<script src="sweetville-v2.0.2.js?v=2.0.2"></script>


COMMIT MESSAGE
Sweetville Expansion Pack v3.0 — Story Mode

TEST
https://jahntella.com/
https://jahntella.com/sweetville/
https://jahntella.com/sweetville/story.html

Press Ctrl+F5 once after deployment if cached pages appear.
