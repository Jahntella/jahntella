SWEETVILLE EXP 6.1.1 — INTRO RECOVERY & SAFE RENDERING

CODE-ONLY HOTFIX

ROOT CAUSE
The older sweetville-v4.0.js renderer directly updated legacy page elements
that no longer exist after the Passport redesign. A null element caused a
TypeError, preventing initialization and leaving the cinematic intro stuck.

FIXED
- Missing legacy elements no longer crash sweetville-v4.0.js
- Intro cinematic advances normally
- Skip Intro works again
- Scroll unlock recovery remains active
- EXP 6.1 collection synchronization remains included
- Passport, Storybook, collections, and Sweetie Room are preserved
- Adds emergency intro-exit protection
- No images included
- Main Jahntella homepage and magazine untouched

UPLOAD
Upload the included sweetville folder and replace matching code files.
Do not delete the existing sweetville/assets folder.

COMMIT MESSAGE
Sweetville EXP 6.1.1 — Intro recovery and safe rendering

PREVIEW
https://jahntella.com/sweetville/?v=exp-6.1.1
