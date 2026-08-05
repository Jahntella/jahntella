JAHNTELLA EXP 31.4 — WORLD STACK + FAST PASS FIX

CORRECTS
- Worlds stacking on top of one another
- Multiple Fast Pass buttons and panels appearing together
- EXP 31.3 globally forcing every section to display

RESULT
- Cinematic intro remains working
- Welcome and official map remain visible on the homepage
- Normal homepage sections display in their existing order
- Opening a focused legacy world shows only that world
- Returning to Map restores the homepage
- Only the first working Fast Pass trigger, panel, and animation remain visible
- Late-created duplicate Fast Pass controls are automatically hidden
- Approved redundant sections remain removed:
  World, old card map, Location Keys, and old homepage Summer Festival

SAFE PATCH
Only these current support files are replaced:
- sweetville/exp30-9-gate-hard-reset.css
- sweetville/exp30-9-gate-hard-reset.js
- sweetville/exp28-district-mode.js

No index.html, map asset, district page, image, Studio page, contact form,
poster, passport, or Fast Pass source file is replaced.

UPLOAD
Upload everything inside this ZIP to the repository root.
Allow all three files to replace the existing versions.

COMMIT
Jahntella EXP 31.4 — Fix stacked worlds and duplicate Fast Passes
