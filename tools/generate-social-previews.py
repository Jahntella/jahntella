#!/usr/bin/env python3
"""Build static Facebook/X share previews from Jahntella's ORIGINAL song cover files.

Runs in GitHub Actions, so no third-party image host or runtime service is needed.
The rendered landscape images are standalone JPEGs suitable for social crawlers.
"""
from pathlib import Path
from urllib.parse import urlparse, unquote
from html import unescape
import re

from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SONGS = ROOT / "songs"
OUTPUT = ROOT / "assets" / "social"
OUTPUT.mkdir(parents=True, exist_ok=True)
SIZE = (1200, 630)

def page_tag(content, property_name):
    match = re.search(r'<meta\s+property="' + re.escape(property_name) + r'"\s+content="([^"]*)"', content)
    return unescape(match.group(1)) if match else None

def replace_image_tag(html, tagname, url):
    pattern = r'(<meta\s+(?:property|name)="' + re.escape(tagname) + r'"\s+content=")[^"]*(")'
    return re.sub(pattern, lambda m: m.group(1) + url + m.group(2), html)

def make_card(source, outfile):
    with Image.open(source) as image:
        original = ImageOps.exif_transpose(image).convert("RGB")
        back = ImageOps.fit(original, SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.35))
        back = back.filter(ImageFilter.GaussianBlur(35)).convert("RGBA")
        back.alpha_composite(Image.new("RGBA", SIZE, (17, 7, 28, 110)))

        # Full uncropped artwork: leave vertical padding for Facebook's wide thumbnail.
        cover = ImageOps.contain(original, (548, 548), method=Image.Resampling.LANCZOS)
        box = Image.new("RGBA", (cover.width + 16, cover.height + 16), (255, 255, 255, 0))
        shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        x = (SIZE[0] - cover.width)//2
        y = (SIZE[1] - cover.height)//2
        shadow_draw.rounded_rectangle((x-8,y-8,x+cover.width+8,y+cover.height+8), radius=14, fill=(0,0,0,175))
        shadow=shadow.filter(ImageFilter.GaussianBlur(16))
        back=Image.alpha_composite(back, shadow)
        back.paste(cover, (x,y))
        back.convert("RGB").save(outfile, "JPEG", quality=91, optimize=True, progressive=False)

done = []
skipped = []
for page in sorted(SONGS.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    old_image = page_tag(html, "og:image")
    if not old_image:
        skipped.append((page.name, "no og:image"))
        continue
    path = unquote(urlparse(old_image).path).lstrip("/")
    source = ROOT / path
    if not source.is_file():
        skipped.append((page.name, "missing original cover " + path))
        continue
    filename = page.stem + "-share.jpg"
    outfile = OUTPUT / filename
    make_card(source, outfile)
    new_url = "https://jahntella.com/assets/social/" + filename
    html = replace_image_tag(html, "og:image", new_url)
    html = replace_image_tag(html, "og:image:secure_url", new_url)
    html = replace_image_tag(html, "og:image:type", "image/jpeg")
    html = replace_image_tag(html, "twitter:image", new_url)
    # Explicit dimensions support Facebook's crawler.
    if 'property="og:image:width"' not in html:
        html = html.replace('<meta property="og:image"', '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image"', 1)
    page.write_text(html, encoding="utf-8")
    done.append(page.name)
print("Generated",len(done),"share images:",", ".join(done))
if skipped:
    print("Skipped:",skipped)
    raise SystemExit("Some song share images could not be built")
