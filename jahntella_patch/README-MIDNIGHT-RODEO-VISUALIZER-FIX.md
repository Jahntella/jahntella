# Midnight Rodeo — Shine Era Full Visualizer Fix

This supplemental patch is designed to be uploaded after the earlier Midnight Rodeo website drop-in.

## Important
GitHub's web uploader has a 25 MB file limit. The included visualizer is the web-optimized H.264 version and is intentionally under that limit.

## Files
- `midnight-rodeo-home.js` — adds the Midnight Rodeo music card and full visualizer to the existing Shine Era sneak-peek section. The site version contains **only the full visualizer**; the 60-second teaser is not included.
- `midnight-rodeo-shine-visualizer.css` — styling for the Shine Era visualizer.
- `assets/shine-era/midnight-rodeo-visualizer.mp4` — 5:10.86 full visualizer, web-optimized for GitHub Pages.

The earlier drop-in package should already provide `assets/music-thumbs/midnight-rodeo.webp` and `sweetville/midnight-rodeo.mp3`.

## Upload
Extract this package into the repository root and allow the files to merge/overwrite. Do not upload the original larger visualizer file; use the included web-optimized MP4.
