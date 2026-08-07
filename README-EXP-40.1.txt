JAHNTELLA EXP 40.1 — DIRECT MOBILE MAP FIX

ROOT CAUSE
EXP 40.0 added a CSS file that the homepage never loaded.

FIX
- Replaces the already-loaded sweetville/exp29-1-interactive-map.css
- Preserves desktop map rules and hotspot positions
- Adds the mobile override directly
- Removes the 980px mobile minimum width
- Scales map artwork and hotspots together

UPLOAD
Upload everything inside this ZIP to the repository root.

COMMIT
Jahntella EXP 40.1 — Apply mobile map fix directly to loaded stylesheet
