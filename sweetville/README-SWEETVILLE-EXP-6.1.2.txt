SWEETVILLE EXP 6.1.2 — LEGACY RENDER REPAIR

CODE-ONLY HOTFIX

ROOT CAUSE
The browser was still loading an older cached sweetville-v4.0.js file, and
its render() function directly referenced removed legacy elements.

FIXED
- Forces a new sweetville-v4.0.js cache version
- Patches render() with direct null checks
- Patches My Sweetie Room rendering with null checks
- Restores intro slideshow initialization
- Restores Skip Intro
- Keeps emergency scroll unlock protection
- Preserves EXP 6.1 collection sync
- Preserves EXP 6.0 Passport and EXP 5.5 Storybook
- No images included
- Main homepage and magazine untouched

UPLOAD
Upload the included sweetville folder and replace matching files.
Do not delete sweetville/assets.

COMMIT MESSAGE
Sweetville EXP 6.1.2 — Fix legacy render crash and intro

PREVIEW
https://jahntella.com/sweetville/?v=exp-6.1.2
