#!/usr/bin/env python3
"""Apply the Jahntella v4.3 five-second hero patch."""

from pathlib import Path
import shutil
import sys

ROOT = Path.cwd()
INDEX = ROOT / "index.html"
CSS_TARGET = ROOT / "hero-v4.3.css"
VIDEO_DIR = ROOT / "videos"

OLD_HERO_START = '    <section class="hero reveal" id="home">'
OLD_HERO_END = "    </section>"

NEW_HERO = """    <section class="hero-video-section" id="home" aria-label="Welcome to the World of Sweet">
      <video
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        poster="assets/jahntella-hero-circle.png"
        aria-hidden="true"
      >
        <source src="videos/Hero.mp4" type="video/mp4">
      </video>

      <div class="hero-video-overlay" aria-hidden="true"></div>

      <div class="hero-video-content">
        <p class="eyebrow">WELCOME TO THE WORLD OF SWEET</p>
        <div class="hero-video-logo">Jahntella<span>♡</span></div>
        <p class="hero-video-tagline">Sweet hooks. Big choruses. Good vibes.</p>
        <a class="hero-dip-button" href="#music">DIP IN <span aria-hidden="true">▶</span></a>
      </div>

      <a class="hero-scroll-cue" href="#music" aria-label="Continue to music">
        <span>SCROLL</span>
        <i aria-hidden="true"></i>
      </a>
    </section>
"""

CSS_CONTENT = r"""/* Jahntella v4.3 — 5-second cinematic hero patch */

.hero-video-section {
  position: relative;
  isolation: isolate;
  min-height: calc(100svh - 72px);
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(255,79,183,.18), transparent 36rem),
    #090009;
}

.hero-video {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-video-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(180deg, rgba(8,0,10,.35) 0%, rgba(8,0,10,.12) 38%, rgba(8,0,10,.62) 100%),
    radial-gradient(circle at center, transparent 15%, rgba(10,0,12,.44) 100%);
}

.hero-video-section::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  z-index: -1;
  height: 32%;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, #100012);
}

.hero-video-content {
  width: min(92%, 920px);
  padding: 6rem 1.25rem 7rem;
  text-align: center;
  text-shadow: 0 4px 30px rgba(0,0,0,.72);
  animation: hero-content-enter 1.15s .18s both;
}

.hero-video-logo {
  margin: .15rem 0 .75rem;
  font-family: "Sacramento", cursive;
  font-size: clamp(5rem, 15vw, 11rem);
  line-height: .9;
  letter-spacing: -.03em;
  filter: drop-shadow(0 0 28px rgba(255,79,183,.42));
}

.hero-video-logo span {
  color: var(--pink);
}

.hero-video-tagline {
  max-width: 680px;
  margin: 0 auto 2rem;
  color: #fff8fc;
  font-family: "Playfair Display", serif;
  font-size: clamp(1.25rem, 3vw, 2.1rem);
  line-height: 1.25;
}

.hero-dip-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: .65rem;
  min-height: 3.45rem;
  padding: .9rem 1.7rem;
  border: 1px solid rgba(255,255,255,.38);
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, rgba(255,79,183,.94), rgba(165,76,255,.94));
  box-shadow:
    0 16px 45px rgba(255,79,183,.34),
    inset 0 1px 0 rgba(255,255,255,.35);
  font-weight: 800;
  letter-spacing: .1em;
  backdrop-filter: blur(12px);
  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
}

.hero-dip-button:hover,
.hero-dip-button:focus-visible {
  transform: translateY(-3px) scale(1.025);
  filter: brightness(1.08);
  box-shadow:
    0 22px 58px rgba(255,79,183,.44),
    0 0 30px rgba(255,155,213,.2);
}

.hero-scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  display: grid;
  justify-items: center;
  gap: .45rem;
  transform: translateX(-50%);
  color: rgba(255,255,255,.72);
  font-size: .64rem;
  font-weight: 800;
  letter-spacing: .2em;
}

.hero-scroll-cue i {
  display: block;
  width: 1px;
  height: 28px;
  background: linear-gradient(to bottom, rgba(255,255,255,.85), transparent);
  animation: hero-scroll-pulse 1.7s ease-in-out infinite;
}

@keyframes hero-content-enter {
  from {
    opacity: 0;
    transform: translateY(22px) scale(.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes hero-scroll-pulse {
  50% {
    opacity: .32;
    transform: translateY(7px);
  }
}

@media (max-width: 680px) {
  .hero-video-section {
    min-height: calc(100svh - 66px);
  }

  .hero-video-content {
    padding-top: 5rem;
    padding-bottom: 6rem;
  }

  .hero-video-logo {
    font-size: clamp(4.5rem, 24vw, 7.25rem);
  }

  .hero-video-tagline {
    max-width: 19rem;
    font-size: clamp(1.08rem, 5vw, 1.45rem);
  }

  .hero-dip-button {
    width: min(100%, 250px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-video-content,
  .hero-scroll-cue i {
    animation: none;
  }

  .hero-video {
    display: none;
  }
}
"""

def fail(message: str) -> None:
    print(f"\nPATCH STOPPED: {message}\n")
    sys.exit(1)

if not INDEX.exists():
    fail("index.html was not found. Run this script from the root of the Jahntella repository.")

html = INDEX.read_text(encoding="utf-8")

if "hero-video-section" in html:
    print("The v4.3 hero markup is already present. No HTML replacement was needed.")
else:
    start = html.find(OLD_HERO_START)
    if start == -1:
        fail('Could not find the current hero section: <section class="hero reveal" id="home">')

    end = html.find(OLD_HERO_END, start)
    if end == -1:
        fail("Could not locate the end of the current hero section.")
    end += len(OLD_HERO_END)

    backup = ROOT / "index-before-v4.3-hero.html"
    if not backup.exists():
        shutil.copy2(INDEX, backup)

    html = html[:start] + NEW_HERO.rstrip() + html[end:]

    css_link = '  <link rel="stylesheet" href="hero-v4.3.css?v=1">'
    if css_link not in html:
        marker = '</head>'
        if marker not in html:
            fail("Could not find </head> to add the hero stylesheet.")
        html = html.replace(marker, f"{css_link}\n{marker}", 1)

    INDEX.write_text(html, encoding="utf-8")
    print("Updated index.html and created index-before-v4.3-hero.html.")

CSS_TARGET.write_text(CSS_CONTENT, encoding="utf-8")
VIDEO_DIR.mkdir(exist_ok=True)

notice = VIDEO_DIR / "ADD-HERO-VIDEO-HERE.txt"
notice.write_text(
    "Place the five-second MP4 in this folder and name it exactly: Hero.mp4\n",
    encoding="utf-8",
)

print("Created hero-v4.3.css.")
print("Created/confirmed videos/ folder.")
print("\nNEXT: Place your five-second video at videos/Hero.mp4, then upload the changed files to GitHub.")
