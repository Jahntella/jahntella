JAHNTELLA EXP 38.1 — SPHERE ROUTE FIX

ROOT CAUSE
The official map already pointed to sphere.html, but the top Sweetville
navigation still pointed Sphere to #sweetvilleSphere on the homepage.

FIX
- Forces the official Sphere map hotspot to sphere.html
- Changes the top navigation Sphere link to sphere.html
- Redirects every remaining #sweetvilleSphere link to sphere.html
- Stops older scripts from intercepting Sphere clicks
- Leaves the standalone interactive Sphere page unchanged

FILE REPLACED
- sweetville/exp32-map-routes.js

LOCKED FILES NOT INCLUDED
- sweetville/index.html
- sweetville/sphere.html
- intro
- official map artwork
- homepage routing engine
- Fast Pass
- Studio
- passport
- contact system
- district pages

UPLOAD
Upload everything inside this ZIP to the repository root.

PREVIEW
https://jahntella.com/sweetville/?v=38.1

COMMIT
Jahntella EXP 38.1 — Route every Sphere link to standalone experience
