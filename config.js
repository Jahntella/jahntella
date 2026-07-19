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

// Load production patches in order so each release builds safely on the previous one.
window.addEventListener("load", function () {
  function loadScript(src, callback) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      if (callback) callback();
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    script.onload = function () {
      if (callback) callback();
    };
    document.body.appendChild(script);
  }

  loadScript("script-v531-patch.js", function () {
    loadScript("script-v54-achievements.js");
  });
});
