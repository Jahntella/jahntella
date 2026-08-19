JAHNTELLA — MIDNIGHT RODEO UNIFIED PLAYER FIX

Replace these two existing files in the repository:
  midnight-rodeo-site.js
  midnight-rodeo-site.css

Do not add another Midnight Rodeo player script. Keep the existing album2-preview-config.js loader.

What this fixes:
- Removes the non-music aesthetic artwork tile using assets/jahntella-official-v1.png from the Gallery/Aesthetic section.
- Midnight Rodeo artwork is a picture-only playable tile. No caption and no play button.
- Midnight Rodeo uses the existing bottom music bar for Play/Pause, Previous/Next, volume, and scrub position.
- Midnight Rodeo cannot play at the same time as another audio track.
- Midnight Rodeo plays after Boots, Smile & Attitude and then hands off to Fun Dipp.
- The Shine Era visualizer remains the compact fourth visualizer card.
- Gallery images are lazy-loaded/async for faster aesthetics loading.

The Midnight Rodeo MP3, cover art, and full visualizer already in the repository are reused; this package does not duplicate those large media files.
