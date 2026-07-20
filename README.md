# Jahntella v7.0.1 — Sweet Era Restoration

This patch fixes the competing music-player engines and reconnects the new
homepage Vault buttons to the preserved premium Sweet Vault flow.

## Included fixes

- Fun Dipp candy-stick play/pause
- Main player play/pause toggle
- Current-time and duration synchronization
- Progress seeking
- Previous and next song
- Fun Dipp and Pink Lips Remix controls
- Vinyl animation tied to real playback
- Premium pack launch button
- Vault collection button
- Build badge updated to 7.0.1

## Apply on Windows

1. Download or extract your `jahntella` repository.
2. Copy this whole patch folder into the repository folder.
3. Open Command Prompt or PowerShell in the patch folder.
4. Run:

   `python apply-v701.py ..`

   Replace `..` with the repository path when needed.

5. Upload/commit the modified `index.html` and the new `script-v701.js`.

## Manual installation

Copy `script-v701.js` into the repository root, then add this immediately after
the existing `script-v700.js` line in `index.html`:

```html
<script src="script-v700.js"></script>
<script src="script-v701.js"></script>
```

Change the visible build badge to `BUILD 7.0.1`.

## GitHub integration note

The connected GitHub app allowed repository inspection but returned HTTP 403
for branch/file writes, so this release is packaged as a ready-to-apply patch.
