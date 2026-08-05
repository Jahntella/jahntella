JAHNTELLA EXP 30.9 — SWEETVILLE GATE HARD RESET

This replaces the unreliable timed scroll fix.

FIXES
- Open the Gates always begins at the top of the Sweetville homepage
- Clears stale hashes before the gates open
- Blurs the gate button before the overlay disappears
- Disables browser scroll anchoring during the full gate animation
- Prevents Photo Booth inputs from stealing focus during entry
- Forces absolute document top repeatedly until the Welcome section is stable
- Removes/hides the redundant World navigation and World section
- Intentional direct tool/district URLs still remain available

INSTALL
1. Upload both files inside /sweetville/ to the repository's /sweetville/ folder.
2. Add these two lines to sweetville/index.html:

Inside <head> before </head>:
<link rel="stylesheet" href="exp30-9-gate-hard-reset.css?v=30.9">

Immediately before </body>:
<script src="exp30-9-gate-hard-reset.js?v=30.9" defer></script>

IMPORTANT
Remove the old line below from sweetville/index.html so EXP 30.8 does not compete:
<script src="exp30-1-create-navigation.js?v=30.8" defer></script>

Keep exp30-1-create-navigation.js in the repository for tool routing if another page uses it,
but do not load it on the Sweetville homepage until it is rebuilt separately.

PREVIEW
https://jahntella.com/sweetville/?v=30.9

COMMIT
Jahntella EXP 30.9 — Hard reset Sweetville gate landing
