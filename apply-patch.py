from pathlib import Path
import shutil
import sys

root = Path(__file__).resolve().parent
index_file = root / "index.html"
css_file = root / "poster-downloads.css"

if not index_file.exists() or not css_file.exists():
    print("ERROR: Put the current index.html and poster-downloads.css beside this script.")
    sys.exit(1)

html = index_file.read_text(encoding="utf-8")
css = css_file.read_text(encoding="utf-8")

old_nav = '      <a href="#downloads">Downloads</a>\n      <a href="#gallery">Gallery</a>'
new_nav = '      <a href="#downloads">Downloads</a>\n      <a href="#merch">Merch</a>\n      <a href="#gallery">Gallery</a>'

if new_nav not in html:
    if old_nav not in html:
        print("ERROR: Navigation marker not found.")
        sys.exit(1)
    html = html.replace(old_nav, new_nav, 1)

merch = '''    <section class="pop-merch-section reveal" id="merch">
      <div class="section-heading centered">
        <p class="eyebrow">MERCH — COMING SOON</p>
        <h2>The first <em>Jahntella drop</em> is taking shape.</h2>
        <p class="pop-merch-intro">Bold pop pieces inspired by Jahntella's debut era, with subtle Fun Dipp energy and collectible style.</p>
      </div>

      <div class="pop-merch-grid">
        <article class="pop-merch-card">
          <div class="pop-merch-visual visual-tee"><span class="concept">CONCEPT 01</span><span class="tee-shape">J</span></div>
          <p class="pop-merch-label">DEBUT ERA APPAREL</p>
          <h3>Signature Pop Tee</h3>
          <p>A clean statement piece built around Jahntella's emerging pop identity.</p>
          <span class="pop-merch-coming">COMING SOON</span>
        </article>

        <article class="pop-merch-card">
          <div class="pop-merch-visual visual-cap"><span class="concept">CONCEPT 02</span><span class="cap-shape">★</span><i class="dip-dot d1"></i><i class="dip-dot d2"></i><i class="dip-dot d3"></i></div>
          <p class="pop-merch-label">POP ACCESSORY</p>
          <h3>Icon Cap</h3>
          <p>A bright wearable accent with a subtle nod to the Fun Dipp era.</p>
          <span class="pop-merch-coming">IN DEVELOPMENT</span>
        </article>

        <article class="pop-merch-card">
          <div class="pop-merch-visual visual-disc"><span class="concept">CONCEPT 03</span><span class="disc-shape">J</span></div>
          <p class="pop-merch-label">COLLECTOR PIECE</p>
          <h3>Debut Era Collectible</h3>
          <p>A display-worthy piece celebrating the beginning of Jahntella's story.</p>
          <span class="pop-merch-coming">COMING SOON</span>
        </article>
      </div>
    </section>

'''

gallery_marker = '    <section class="gallery-section reveal" id="gallery">'
if 'id="merch"' not in html:
    if gallery_marker not in html:
        print("ERROR: Gallery marker not found.")
        sys.exit(1)
    html = html.replace(gallery_marker, merch + gallery_marker, 1)

css_patch = '''

/* JAHNTELLA POP MERCH PATCH + MOBILE POSTER FIX */
@media (max-width: 820px) {
  .downloads-section { overflow: visible !important; }
  .poster-gallery {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 100% !important;
    gap: 30px !important;
    margin: 36px auto 54px !important;
  }
  .poster-card {
    display: block !important;
    width: min(100%, 440px) !important;
    max-width: 440px !important;
    height: auto !important;
    margin: 0 auto !important;
    overflow: visible !important;
  }
  .poster-preview {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: auto !important;
    overflow: visible !important;
    pointer-events: none !important;
  }
  .poster-preview img {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-height: none !important;
    object-fit: contain !important;
  }
  .poster-copy {
    width: 100% !important;
    padding: 22px 20px 24px !important;
    text-align: center !important;
  }
  .poster-actions { display: block !important; }
  .poster-actions .secondary-button { display: none !important; }
  .poster-actions .primary-button {
    display: block !important;
    width: 100% !important;
    max-width: 300px !important;
    margin: 0 auto !important;
  }
}

.pop-merch-section { padding: 92px 24px; }
.pop-merch-intro { max-width: 720px; margin: 18px auto 0; color: rgba(255,255,255,.72); }
.pop-merch-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 24px;
  max-width: 1160px;
  margin: 44px auto 0;
}
.pop-merch-card {
  padding: 20px 20px 24px;
  border: 1px solid rgba(255,92,186,.3);
  border-radius: 26px;
  background: linear-gradient(155deg,rgba(54,6,53,.95),rgba(14,0,20,.98));
  box-shadow: 0 25px 70px rgba(0,0,0,.34);
}
.pop-merch-visual {
  position: relative;
  display: grid;
  place-items: center;
  height: 250px;
  overflow: hidden;
  border-radius: 21px;
  background: linear-gradient(145deg,#ff3fa5,#9f37d7 58%,#38195e);
}
.visual-cap { background: linear-gradient(145deg,#ff76bd,#ff397c 52%,#5923a5); }
.visual-disc { background: linear-gradient(145deg,#ad3ce4,#ff42a4 54%,#35104f); }
.concept {
  position: absolute;
  left: 15px;
  top: 15px;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 999px;
  background: rgba(18,0,24,.56);
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .13em;
}
.tee-shape {
  display: grid;
  place-items: center;
  width: 128px;
  height: 132px;
  clip-path: polygon(24% 0,39% 11%,61% 11%,76% 0,100% 21%,82% 40%,75% 33%,75% 100%,25% 100%,25% 33%,18% 40%,0 21%);
  background: linear-gradient(150deg,#fff,#ffd6ee);
  color: #ec278f;
  font: 900 3.4rem "Playfair Display", serif;
}
.cap-shape {
  display: grid;
  place-items: center;
  width: 145px;
  height: 90px;
  border-radius: 90px 90px 28px 28px;
  background: linear-gradient(160deg,#fff,#ffd1eb);
  color: #ef2c91;
  font-size: 2.8rem;
  font-weight: 900;
}
.disc-shape {
  display: grid;
  place-items: center;
  width: 145px;
  height: 145px;
  border-radius: 50%;
  border: 10px solid rgba(255,255,255,.72);
  background: radial-gradient(circle,#fff 0 10%,#f52b91 11% 27%,#31123f 28% 100%);
  font: 900 1.7rem "Playfair Display", serif;
}
.dip-dot { position:absolute; border-radius:50%; background:rgba(255,255,255,.78); box-shadow:0 0 16px rgba(255,255,255,.6); }
.d1 { width:13px; height:13px; left:18%; top:28%; }
.d2 { width:8px; height:8px; right:18%; top:22%; }
.d3 { width:18px; height:18px; right:24%; bottom:20%; }
.pop-merch-label { margin:22px 0 0; color:#ff65bd; font-size:.72rem; font-weight:900; letter-spacing:.14em; }
.pop-merch-card h3 { margin:7px 0 10px; font-size:1.65rem; }
.pop-merch-card > p:not(.pop-merch-label) { margin:0; min-height:58px; color:rgba(255,255,255,.7); }
.pop-merch-coming {
  display:block;
  margin-top:22px;
  padding:13px 16px;
  border:1px solid rgba(255,255,255,.17);
  border-radius:999px;
  background:rgba(255,255,255,.07);
  text-align:center;
  font-size:.76rem;
  font-weight:900;
  letter-spacing:.13em;
}
@media (max-width: 900px) {
  .pop-merch-grid { grid-template-columns:1fr; max-width:470px; }
}
@media (max-width: 520px) {
  .pop-merch-section { padding:72px 18px; }
  .pop-merch-visual { height:225px; }
}
'''

if "JAHNTELLA POP MERCH PATCH + MOBILE POSTER FIX" not in css:
    css = css.rstrip() + css_patch + "\n"

shutil.copy2(index_file, root / "index.html.before-patch")
shutil.copy2(css_file, root / "poster-downloads.css.before-patch")
index_file.write_text(html, encoding="utf-8")
css_file.write_text(css, encoding="utf-8")
print("SUCCESS: index.html and poster-downloads.css were updated.")
