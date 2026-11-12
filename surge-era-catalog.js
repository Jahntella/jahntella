/* Album V - appended to the existing four-era catalog. */
(function(){
  const surge=[
  {"key":"tik-tok","title":"Tik Tok","src":"assets/album5/tik-tok.mp3","artwork":"assets/album5/tik-tok-cover.webp","era":"Surge","number":1},
  {"key":"doll-face","title":"Doll Face","src":"assets/album5/doll-face.mp3","artwork":"assets/album5/doll-face-cover.webp","era":"Surge","number":2},
  {"key":"future-ex","title":"Future Ex","src":"assets/album5/future-ex.mp3","artwork":"assets/album5/future-ex-cover.webp","era":"Surge","number":3},
  {"key":"going-down","title":"Going Down","src":"assets/album5/going-down.mp3","artwork":"assets/album5/going-down-cover.webp","era":"Surge","number":4},
  {"key":"body-potion","title":"Body Potion","src":"assets/album5/body-potion.mp3","artwork":"assets/album5/body-potion-cover.webp","era":"Surge","number":5},
  {"key":"untouchable","title":"Untouchable","src":"assets/album5/untouchable.mp3","artwork":"assets/album5/untouchable-cover.webp","era":"Surge","number":6},
  {"key":"electric-tangerine","title":"Electric Tangerine","src":"assets/album5/electric-tangerine.mp3","artwork":"assets/album5/electric-tangerine-cover.webp","era":"Surge","number":7},
  {"key":"anxiety","title":"Anxiety","src":"assets/album5/anxiety.mp3","artwork":"assets/album5/anxiety-cover.webp","era":"Surge","number":8},
  {"key":"spit","title":"Spit","src":"assets/album5/spit.mp3","artwork":"assets/album5/spit-cover.webp","era":"Surge","number":9},
  {"key":"wild-card","title":"Wild Card","src":"assets/album5/wild-card.mp3","artwork":"assets/album5/wild-card-cover.webp","era":"Surge","number":10},
  {"key":"overload","title":"Overload","src":"assets/album5/overload.mp3","artwork":"assets/album5/overload-cover.webp","era":"Surge","number":11},
  {"key":"playlist","title":"Playlist","src":"assets/album5/playlist.mp3","artwork":"assets/album5/playlist-cover.webp","era":"Surge","number":12}
  ];
  window.JAHNTELLA_EXTRA_TRACKS=window.JAHNTELLA_EXTRA_TRACKS||[];
  surge.forEach(t=>{if(!window.JAHNTELLA_EXTRA_TRACKS.some(x=>x.key===t.key))window.JAHNTELLA_EXTRA_TRACKS.push(t);});
  window.JAHNTELLA_TRACK_ORDER=window.JAHNTELLA_TRACK_ORDER||[];
  surge.forEach(t=>{if(!window.JAHNTELLA_TRACK_ORDER.includes(t.key))window.JAHNTELLA_TRACK_ORDER.push(t.key);});
})();
