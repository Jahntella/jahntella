# Midnight Rodeo — Jahntella Website Drop-In

This package adds **Midnight Rodeo** as the newest Shine Era teaser, with the clearer square cover, a push-to-play card, and a continuous-play bridge back into the existing playlist.

## Files
- `sweetville/midnight-rodeo.mp3` — master song audio
- `assets/music-thumbs/midnight-rodeo.webp` — square cover for the homepage
- `sweetville/midnight-rodeo-cover.webp` — square cover for Sweetville
- `midnight-rodeo.css` + `midnight-rodeo-home.js` — homepage card and playlist bridge
- `sweetville/midnight-rodeo-sweetville.css` + `sweetville/midnight-rodeo-sweetville.js` — Sweetville card
- `INSTALL-INSTRUCTIONS.html` — exact script/style tags to add

## Important
The existing sitewide player keeps its own track registry. This drop-in intentionally uses an additive bridge rather than replacing the mature player code. The homepage bridge hands off from the existing final track (`We Are 1`) to Midnight Rodeo, then from Midnight Rodeo back to `Fun Dipp`, so the listening experience remains continuous.

After extracting, copy the package files into the matching repository folders and add the four stylesheet/script tags shown in `INSTALL-INSTRUCTIONS.html`.

Also update the visible homepage count from **15 new songs** to **16 new songs** if that copy is still present. The Sweet Era listening playlist announcement should read **18-track playlist**.
