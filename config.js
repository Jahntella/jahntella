window.JAHNTELLA_CONFIG = {
  brand: {
    siteName: "Jahntella",
    email: "jahntella@gmail.com",
    signoff: "🍭 Stay Sweet, xo, Jahntella 💋"
  },

  // Replace any search URLs below with exact artist/channel URLs as soon as they are confirmed.
  social: {
    instagram: "https://www.instagram.com/jahntella/",
    tiktok: "https://www.tiktok.com/@jahntella",
    youtube: "https://www.youtube.com/@jahntella",
    spotify: "https://open.spotify.com/search/Jahntella",
    email: "mailto:jahntella@gmail.com"
  },

  music: {
    spotify: "https://open.spotify.com/search/Jahntella",
    appleMusic: "https://music.apple.com/us/search?term=Jahntella",
    youtubeMusic: "https://www.youtube.com/results?search_query=Jahntella+Fun+Dipp",
    amazonMusic: "https://music.amazon.com/search/Jahntella",
    soundcloud: "https://soundcloud.com/search?q=Jahntella"
  },

  store: {
    provider: "preview",
    checkoutUrl: ""
  },

  newsletter: {
    provider: "preview",
    endpoint: ""
  }
};

// Load the v5.3.1 production patch after the existing v5.3 application has initialized.
window.addEventListener("load", function () {
  var existing = document.querySelector('script[src="script-v531-patch.js"]');
  if (existing) return;

  var script = document.createElement("script");
  script.src = "script-v531-patch.js";
  script.defer = true;
  document.body.appendChild(script);
});
