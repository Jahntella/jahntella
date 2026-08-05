JAHNTELLA EXP 31.1 — TRUE GATE FIX

ROOT CAUSE
The Sweetville page could still load with a stale creative route such as:
?district=create
?tool=photo
#photoBooth

The existing exp28-district-mode.js then hid the entire Sweetville homepage and
showed only the Create section. Because Photo Booth is inside that section, it
appeared that Open the Gates was sending visitors there.

THIS FIX
- Clears stale creative query parameters and hashes on the gate page
- Prevents exp28-district-mode.js from entering district-only mode for stale
  creative routes while the Sweetville gate exists
- Replaces the gate button node so older click handlers cannot still fire
- Opens the full Sweetville homepage at Welcome to Sweetville
- Restores every main section before the gates open
- Keeps intentional dedicated district pages working
- Keeps direct creative-tool links working when they are used from Sweet Studio

SAFE CURRENT-STATE PATCH
Only these two existing live files are replaced:
sweetville/exp30-9-gate-hard-reset.js
sweetville/exp28-district-mode.js

No HTML, map, district page, Studio page, contact form, image, poster, or other
asset is replaced.

UPLOAD
Upload everything inside this ZIP to the repository root and allow both files
to replace the existing versions.

PREVIEW
https://jahntella.com/sweetville/?v=31.1

COMMIT
Jahntella EXP 31.1 — Fix stale creative route at Sweetville gate
