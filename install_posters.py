from pathlib import Path

root = Path(__file__).resolve().parent
index_path = root / "index.html"
section_path = root / "downloads-section.html"

if not index_path.exists():
    raise SystemExit("index.html was not found. Put these files in the root of the Jahntella repository, then run again.")

html = index_path.read_text(encoding="utf-8")
section = section_path.read_text(encoding="utf-8")

start_marker = '    <section class="downloads-section reveal" id="downloads">'
end_marker = '    <section class="gallery-section reveal" id="gallery">'
start = html.find(start_marker)
end = html.find(end_marker)
if start == -1 or end == -1 or end <= start:
    raise SystemExit("Could not locate the Downloads section in index.html. No changes were made.")

html = html[:start] + section + "\n\n" + html[end:]

css_link = '  <link rel="stylesheet" href="poster-downloads.css">'
if css_link not in html:
    html = html.replace('  <link rel="stylesheet" href="styles.css">', '  <link rel="stylesheet" href="styles.css">\n' + css_link)

backup = root / "index-before-posters.html"
if not backup.exists():
    backup.write_text(index_path.read_text(encoding="utf-8"), encoding="utf-8")
index_path.write_text(html, encoding="utf-8")
print("Success: the eight-poster Downloads gallery was installed into index.html.")
