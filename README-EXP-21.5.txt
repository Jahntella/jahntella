JAHNTELLA EXP 21.5 — CARD REVEAL CURRENT SCREEN FIX

ROOT CAUSE FOUND IN SCRIPT.JS
The native pack-opening code schedules:
vaultBinder.scrollIntoView(...)
900 milliseconds after every mobile pull.

That page jump occurs while the reveal is opening and moves the user away from
the pack, making the reveal appear at the top of the homepage.

FIXES
- Temporarily blocks only that scheduled automatic binder jump
- Captures the user's exact scroll position before opening the pack
- Anchors the reveal over that current visible screen
- Moves the reveal directly under BODY
- Keeps the reveal card within desktop and mobile viewport height
- Restores normal binder scrolling after the reveal
- Guarantees page scrolling is cleaned up after close
- Preserves the premium Sweet Pack and card collection logic

UPLOAD
Upload everything inside this ZIP to the repository root.

PREVIEW
https://jahntella.com/?v=21.5#sweet-vault

COMMIT MESSAGE
Jahntella EXP 21.5 — Keep Sweet Vault card reveal on current screen
