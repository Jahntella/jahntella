JAHNTELLA EXP 31.2 — CLEAN SWEETVILLE ENTRANCE

PURPOSE
The Open the Gates overlay and forced cinematic entrance are removed.
Sweetville now loads directly at the current Welcome to Sweetville section,
followed by the official interactive map.

SAFE CURRENT-LIVE PATCH
This ZIP does NOT contain sweetville/index.html.

It replaces only files already loaded by the current live homepage:
- sweetville/exp30-9-gate-hard-reset.css
- sweetville/exp30-9-gate-hard-reset.js
- sweetville/exp28-district-mode.js

Because index.html is not included, this patch cannot roll back:
- the current Sweetville homepage
- the official map
- district pages
- Sweet Studio
- contact forms
- Fast Pass
- passports
- poster galleries
- current images or artwork

RESULT
- No Open the Gates screen
- No forced cinematic intro screen
- No jump to Photo Booth
- Full Sweetville homepage appears immediately
- Welcome to Sweetville remains first
- Official map remains directly below
- Stale creative hashes and district parameters are cleared
- Intentional Sweet Studio tool links using ?tool= continue to work
- Redundant World button and World section remain removed

UPLOAD
Upload everything inside this ZIP to the repository root.
Allow the three files above to replace the existing versions.

No manual editing is required.

PREVIEW
https://jahntella.com/sweetville/?v=31.2

COMMIT
Jahntella EXP 31.2 — Remove broken gate and load Sweetville directly
