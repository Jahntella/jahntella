JAHNTELLA EXP 35.0 — HOMEPAGE MODE FIX

ROOT CAUSE
The old EXP 26 map stylesheet hides nearly every main section whenever
exp260-explore-mode is missing. EXP 31.4 removed that class when returning
to the homepage, so the official map and homepage sections disappeared and
Photo Booth became the next visible area.

FIX
- Keeps exp260-explore-mode active on the normal homepage
- Forces the old saved EXP 26 preference to Explore
- Watches for older scripts trying to remove the required class
- Restores the full homepage after the official map
- Keeps the intro and duplicate Fast Pass cleanup working

SAFE PATCH
Only this file is replaced:
sweetville/exp30-9-gate-hard-reset.js

UPLOAD
Upload everything inside this ZIP to the repository root.

COMMIT
Jahntella EXP 35.0 — Restore full Sweetville homepage after official map
