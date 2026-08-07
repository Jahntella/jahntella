JAHNTELLA EXP 38.2 — FULL MAP ROUTES RESTORE

ROOT CAUSE
EXP 38.1 replaced the full district routing table with a Sphere-only routing patch.
Sphere worked, but Sparkle Lake and other dedicated districts could fall back to older homepage routes.

FIX
- Restores all 13 dedicated Sweetville map routes
- Sparkle Lake -> sparkle-lake.html
- Sweetville Sphere remains -> sphere.html
- Keeps the top-navigation Sphere correction
- Blocks older click handlers from redirecting districts to the homepage

FILE REPLACED
- sweetville/exp32-map-routes.js

LOCKED FILES NOT INCLUDED
- sweetville/index.html
- sweetville/sphere.html
- sweetville/sparkle-lake.html
- Sweet Studio
- cinematic intro
- official map artwork
- homepage deep-link engine
- Fast Pass
- passport
- contact system
- all district pages

UPLOAD
Upload everything inside this ZIP to the repository root.

COMMIT
Jahntella EXP 38.2 — Restore all dedicated Sweetville map routes
