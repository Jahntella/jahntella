JAHNTELLA EXP 31.0 — SAFE GATE FIX

NO ROLLBACK GUARANTEE
This ZIP was designed around the CURRENT LIVE Sweetville page.

It contains only one replacement file:
sweetville/exp30-9-gate-hard-reset.js

The current live sweetville/index.html already loads that exact filename.
Therefore:
- index.html is NOT replaced
- no district page is replaced
- no map file is replaced
- no Sweet Studio file is replaced
- no contact form file is replaced
- no poster/gallery file is replaced
- no artwork or asset is replaced
- no earlier EXP build is restored

FIX
- Stops the older gate click handler before it can restore Photo Booth state
- Opens the gates at Welcome to Sweetville
- Removes stale Photo Booth/creative hashes
- Prevents Photo Booth controls from taking focus during entry
- Keeps the page locked to the Welcome hero until the gate animation finishes
- Preserves intentional direct links to districts and creative tools
- Keeps the redundant World button/section hidden

UPLOAD
Upload everything inside this ZIP to the repository root.
Allow sweetville/exp30-9-gate-hard-reset.js to replace the existing file.

DO NOT DELETE OR REPLACE ANY OTHER FILE.

PREVIEW
https://jahntella.com/sweetville/?v=31.0

COMMIT
Jahntella EXP 31.0 — Safe Sweetville gate fix
