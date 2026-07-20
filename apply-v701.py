#!/usr/bin/env python3
"""Apply Jahntella v7.0.1 to an extracted repository folder."""

from pathlib import Path
import shutil
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
index_path = root / "index.html"
source_js = Path(__file__).with_name("script-v701.js")
target_js = root / "script-v701.js"

if not index_path.exists():
    raise SystemExit(f"index.html was not found in: {root}")

shutil.copy2(source_js, target_js)

html = index_path.read_text(encoding="utf-8")

include = '  <script src="script-v701.js"></script>'
if 'script-v701.js' not in html:
    marker = '  <script src="script-v700.js"></script>'
    if marker not in html:
        raise SystemExit("Could not find the script-v700.js include in index.html.")
    html = html.replace(marker, marker + "\n" + include, 1)

html = html.replace(">BUILD 5.1.1</div>", ">BUILD 7.0.1</div>")
html = html.replace(">BUILD 5.1</div>", ">BUILD 7.0.1</div>")

index_path.write_text(html, encoding="utf-8")
print("Applied Jahntella v7.0.1 successfully.")
print(f"Updated: {index_path}")
print(f"Added:   {target_js}")
