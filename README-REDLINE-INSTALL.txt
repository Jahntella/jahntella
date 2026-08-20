JAHNTELLA — REDLINE SITE INTEGRATION

Replace/add these files in the repository:

1) REPLACE album2-preview-config.js with the included version.
2) REPLACE midnight-rodeo-site.js with the included version only if it is present in the destination repo. The included redline loader registers before Midnight Rodeo so the continuous sequence is:
   Boots, Smile & Attitude → Midnight Rodeo → Redline → Fun Dipp
3) ADD redline-site.js and redline-site.css at repository root.
4) ADD sweetville/redline-sweetville.js and sweetville/redline-sweetville.css.
5) ADD the four assets under assets/album2/.

Homepage:
• Redline is the 5th Shine Era visualizer card, alongside the existing four.
• The Redline cover is clickable in the aesthetic gallery with no extra play button on the artwork.
• The existing homepage bottom player controls the Redline audio, including scrubber and volume, using the shared Boots transport.
• Sequence: Boots, Smile & Attitude → Midnight Rodeo → Redline → Fun Dipp.
• The homepage new-song counter is updated to 17.
• The Shine Era intro is updated to five glimpses and includes Redline.

Sweetville:
• Redline is added to the Shine Era/music release grid as a clickable cover.
• It plays the supplied Redline MP3 through Sweetville's existing continuous music element.
• When Redline finishes, Sweetville hands playback to Fun Dipp.

No 60-second teaser is included on the website.
