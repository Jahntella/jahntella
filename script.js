(() => {
  const SITE_PLAYBACK_KEY = "jahntellaSiteMusicV46";
  const SHINE_PLAYBACK_KEY = "jahntellaShineEraPlaybackV74";
  const album2Config = window.JAHNTELLA_ALBUM2 || {};
  const album2PreviewMode = album2Config.previewMode === true;
  const album2TrackConfig = key => album2Config.tracks?.[key] || {};
  const album2Url = path => new URL(path, document.baseURI).href;
  const album2Titles = {
    "sweet-dreams": "Sweet Dreams",
    "we-are-1": "We Are 1",
    "boots-smile-attitude": "Boots, Smile & Attitude"
  };

  const applyAlbum2PreviewMode = () => {
    document.documentElement.dataset.album2Playback = album2PreviewMode ? "preview" : "full";
    if (!album2PreviewMode) return;

    [
      ["sweet-dreams", "audioSweetDreams", "exp60SweetDreamsVideo"],
      ["we-are-1", "audioWeAre1", "exp61WeAre1Video"],
      ["boots-smile-attitude", "audioBootsSmileAttitude", "exp66BootsSmileAttitudeVideo"]
    ].forEach(([key, audioId, videoId]) => {
      const media = album2TrackConfig(key);
      const audio = document.getElementById(audioId);
      const audioSource = audio?.querySelector("source");
      if (audioSource && media.previewAudio) audioSource.src = album2Url(media.previewAudio);

      const video = document.getElementById(videoId);
      const videoSource = video?.querySelector("source");
      if (videoSource && media.previewVideo) {
        videoSource.src = album2Url(media.previewVideo);
        video.setAttribute("aria-label", `Play the ${album2Titles[key]} 60-second preview`);
        video.load();
      }
    });

    document.querySelectorAll(".exp60-shine-video-heading > span").forEach(label => {
      label.firstChild.textContent = "60-SECOND PREVIEW ";
    });
    document.querySelectorAll(".exp60-shine-video-note p").forEach(note => {
      note.innerHTML = "<strong>Listen to the preview.</strong> Hear the full song everywhere music is sold and streamed beginning August 27.";
    });
  };

  applyAlbum2PreviewMode();
  const order = window.JAHNTELLA_TRACK_ORDER || ["fun-dipp", "pink-lips", "bite-lip", "gloss", "your-girl", "embrace-me", "we-come-together", "play-with-me", "carnival", "made-of-light", "candy-wrapper", "playground", "milk-shake", "tonight", "sweet-dreams", "we-are-1", "boots-smile-attitude", "midnight-rodeo", "redline", "smoke-show", "chasing-me", "coming-down", "you-and-me", "come-here-come-close", "touch", "pull-me-in", "strip", "what-you-do-to-me", "exist", "escape", "pink-petals", "obsessed-with-me", "kiss-me-like-a-secret", "pretty-little-problem", "cant-look-away", "knock-your-boots-off", "snap-me", "hold-my-hand-to-heaven", "read-my-lips", "viral-spiral", "hotter-in-person", "show-me-something-real"];
  const tracks = {
    "fun-dipp": {
      audio: document.getElementById("audioFunDipp"),
      title: "Fun Dipp",
      artwork: "assets/fun-dipp-cover.webp",
      recordWrap: document.getElementById("funDippRecordWrap"),
      card: document.querySelector('[data-card="fun-dipp"]')
    },
    "pink-lips": {
      audio: document.getElementById("audioPinkLips"),
      title: "Pink Lips Remix",
      artwork: "assets/pink-lips-remix.webp",
      recordWrap: document.getElementById("pinkLipsRecordWrap"),
      card: document.querySelector('[data-card="pink-lips"]')
    },
    "bite-lip": {
      audio: document.getElementById("audioBiteLip"),
      title: "Bite Lip",
      artwork: "assets/album/sweet-era-art/bite-lip-cover.png",
      card: document.querySelector('[data-card="bite-lip"]')
    },
    "gloss": {
      audio: document.getElementById("audioGloss"),
      title: "Gloss",
      artwork: "assets/album/sweet-era-art/gloss-cover.png",
      card: document.querySelector('[data-card="gloss"]')
    },
    "your-girl": {
      audio: document.getElementById("audioYourGirl"),
      title: "I Want To Be Your Girl",
      artwork: "assets/music-thumbs/i-want-to-be-your-girl.webp",
      card: document.querySelector('[data-card="your-girl"]')
    },
    "embrace-me": {
      audio: document.getElementById("audioEmbraceMe"),
      title: "Embrace Me",
      artwork: "assets/music-thumbs/embrace-me.webp",
      card: document.querySelector('[data-card="embrace-me"]')
    },
    "we-come-together": {
      audio: document.getElementById("audioWeComeTogether"),
      title: "We Come Together",
      artwork: "assets/album/sweet-era-art/we-come-together-cover.png",
      card: document.querySelector('[data-card="we-come-together"]')
    },
    "play-with-me": {
      audio: document.getElementById("audioPlayWithMe"),
      title: "Play With Me",
      artwork: "assets/album/sweet-era-art/play-with-me-cover.png",
      card: document.querySelector('[data-card="play-with-me"]')
    },
    carnival: {
      audio: document.getElementById("audioCarnival"),
      title: "Carnival",
      artwork: "assets/album/sweet-era-art/carnival-cover.png",
      card: document.querySelector('[data-card="carnival"]')
    },
    "made-of-light": {
      audio: document.getElementById("audioMadeOfLight"),
      title: "Made of Light",
      artwork: "assets/album/sweet-era-art/made-of-light-cover.png",
      card: document.querySelector('[data-card="made-of-light"]')
    },
    "candy-wrapper": {
      audio: document.getElementById("audioCandyWrapper"),
      title: "Candy Wrapper",
      artwork: "assets/album/sweet-era-art/candy-wrapper-cover.png",
      card: document.querySelector('[data-card="candy-wrapper"]')
    },
    playground: {
      audio: document.getElementById("audioPlayground"),
      title: "Playground",
      artwork: "assets/album/sweet-era-art/playground-cover.png",
      card: document.querySelector('[data-card="playground"]')
    },
    "milk-shake": {
      audio: document.getElementById("audioMilkShake"),
      title: "Milk Shake",
      artwork: "assets/album/sweet-era-art/milk-shake-cover.png",
      card: document.querySelector('[data-card="milk-shake"]')
    },
    tonight: {
      audio: document.getElementById("audioTonight"),
      title: "Tonight",
      artwork: "assets/album/sweet-era-art/tonight-cover.png",
      card: document.querySelector('[data-card="tonight"]')
    },
    "sweet-dreams": {
      audio: document.getElementById("audioSweetDreams"),
      title: "Sweet Dreams",
      artwork: "assets/album2/JSweetDreamsNEW.png",
      card: document.querySelector('[data-card="sweet-dreams"]')
    },
    "we-are-1": {
      audio: document.getElementById("audioWeAre1"),
      title: "We Are 1",
      artwork: "assets/album2/JWeAre1NEW.png",
      card: document.querySelector('[data-card="we-are-1"]')
    },
    "boots-smile-attitude": {
      audio: document.getElementById("audioBootsSmileAttitude"),
      title: "Boots, Smile & Attitude",
      artwork: "assets/album2/JBoots,Smile,AttitudeNEW.png",
      card: document.querySelector('[data-card="boots-smile-attitude"]')
    },
    "come-here-come-close": { audio: document.getElementById("audioComeHereComeClose"), title: "Come Here Come Close", artwork: "assets/album3/JComeHereComeCloseNEW.png", card: document.querySelector('[data-card="come-here-come-close"]') },
    touch: { audio: document.getElementById("audioTouch"), title: "Touch", artwork: "assets/album3/JTouchNEW.png", card: document.querySelector('[data-card="touch"]') },
    "pull-me-in": { audio: document.getElementById("audioPullMeIn"), title: "Pull Me In", artwork: "assets/album3/JPullMeIn.png", card: document.querySelector('[data-card="pull-me-in"]') },
    strip: { audio: document.getElementById("audioStrip"), title: "Strip", artwork: "assets/album3/JStripNEW.png", card: document.querySelector('[data-card="strip"]') },
    "what-you-do-to-me": { audio: document.getElementById("audioWhatYouDoToMe"), title: "What You Do to Me", artwork: "assets/album3/JWhatYouDoToMe.png", card: document.querySelector('[data-card="what-you-do-to-me"]') },
    exist: { audio: document.getElementById("audioExist"), title: "Exist", artwork: "assets/album3/JExistNEW.png", card: document.querySelector('[data-card="exist"]') },
    escape: { audio: document.getElementById("audioEscape"), title: "Escape", artwork: "assets/album3/JEscape.png", card: document.querySelector('[data-card="escape"]') },
    "pink-petals": { audio: document.getElementById("audioPinkPetals"), title: "Pink Petals", artwork: "assets/album3/JPinkPetalsNEW.png", card: document.querySelector('[data-card="pink-petals"]') }
  };

  // Register every album with the same player, progress, volume and saved state.
  (window.JAHNTELLA_EXTRA_TRACKS || []).forEach(track => {
    if (tracks[track.key]) return;
    const audio = document.createElement('audio');
    audio.preload = 'none'; audio.src = track.src;
    document.body.appendChild(audio);
    tracks[track.key] = {audio, title:track.title, artwork:track.artwork,
      card:document.querySelector(`[data-card="${track.key}"]`)};
  });

  const player = document.getElementById("player");
  const toggle = document.getElementById("playerToggle");
  const prev = document.getElementById("playerPrev");
  const next = document.getElementById("playerNext");
  const title = document.getElementById("playerTitle");
  const artwork = document.getElementById("playerArtwork");
  const progress = document.getElementById("playerProgress");
  const time = document.getElementById("playerTime");
  const volume = document.getElementById("playerVolume");
  const scrollProgress = document.getElementById("scrollProgress");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const heroVisual = document.getElementById("heroVisual");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const siteLoader = document.getElementById("siteLoader");

  const shootingStars = document.getElementById("shootingStars");
  const twinkleStars = document.getElementById("twinkleStars");

  const buildTwinkleStars = () => {
    if (!twinkleStars || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const amount = Math.min(55, Math.max(24, Math.floor(window.innerWidth / 30)));
    twinkleStars.innerHTML = "";
    for (let i = 0; i < amount; i += 1) {
      const star = document.createElement("i");
      star.className = "twinkle-star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${2.4 + Math.random() * 4.2}s`);
      star.style.setProperty("--delay", `${Math.random() * -7}s`);
      const scale = .45 + Math.random() * .9;
      star.style.transform = `scale(${scale})`;
      twinkleStars.appendChild(star);
    }
  };

  const launchShootingStar = () => {
    if (!shootingStars || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const star = document.createElement("i");
    star.className = "shooting-star";
    const fromLeft = Math.random() > .22;
    star.style.left = `${fromLeft ? -8 : 58 + Math.random() * 35}%`;
    star.style.top = `${5 + Math.random() * 62}%`;
    star.style.setProperty("--angle", `${fromLeft ? -18 - Math.random() * 18 : 198 + Math.random() * 14}deg`);
    star.style.setProperty("--speed", `${1.1 + Math.random() * .9}s`);
    star.style.setProperty("--travel-x", `${fromLeft ? 125 + Math.random() * 35 : -120 - Math.random() * 30}vw`);
    star.style.setProperty("--travel-y", `${22 + Math.random() * 26}vh`);
    shootingStars.appendChild(star);
    window.setTimeout(() => star.remove(), 2400);
  };

  const scheduleShootingStar = () => {
    window.setTimeout(() => {
      launchShootingStar();
      if (Math.random() > .7) window.setTimeout(launchShootingStar, 420 + Math.random() * 650);
      scheduleShootingStar();
    }, 3600 + Math.random() * 5200);
  };

  buildTwinkleStars();
  scheduleShootingStar();
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__jahntellaStarResize);
    window.__jahntellaStarResize = window.setTimeout(buildTwinkleStars, 250);
  });

  // One playlist queue at a time; all audio still uses the existing site player.
  const curatedPlaylists = {
    country: {name:'Country Sweetheart',songs:['boots-smile-attitude','midnight-rodeo','knock-your-boots-off','wild-card']},
    afterdark: {name:'After Dark',songs:['touch','snap-me','strip','come-here-come-close']},
    electric: {name:'Electric Sweetie',songs:['tik-tok','electric-tangerine','overload','playlist']},
    confidence: {name:'Confidence Boost',songs:['obsessed-with-me','untouchable','pretty-little-problem','cant-look-away']}
  };
  window.JAHNTELLA_CURATED_PLAYLISTS = curatedPlaylists;
  let activePlaylist = null;
  let playlistPosition = -1;
  const playlistStatus = () => {
    const data=activePlaylist && curatedPlaylists[activePlaylist];
    window.dispatchEvent(new CustomEvent('jahntella:playlistchange',{detail:{
      id:activePlaylist,name:data?.name||'',index:playlistPosition,
      total:data?.songs.length||0,key:currentKey
    }}));
  };
  let currentKey = null;
  let currentCredited = false;
  let lastSavedSecond = -1;

  const readSitePlayback = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(SITE_PLAYBACK_KEY) || "{}");
      if (!tracks[value.track]) return {};
      if (album2PreviewMode && ["sweet-dreams", "we-are-1", "boots-smile-attitude"].includes(value.track) && value.album2Mode !== "preview") {
        return {...value, position: 0, playing: false, credited: false, album2Mode: "preview"};
      }
      return value;
    } catch {
      return {};
    }
  };

  const persistSitePlayback = (force = false) => {
    const track = currentTrack();
    if (!track?.audio || !currentKey) return;
    const second = Math.floor(track.audio.currentTime || 0);
    if (!force && second === lastSavedSecond) return;
    lastSavedSecond = second;
    try {
      sessionStorage.setItem(SITE_PLAYBACK_KEY, JSON.stringify({
        track: currentKey,
        position: track.audio.currentTime || 0,
        playing: !track.audio.paused && !track.audio.ended,
        credited: currentCredited,
        album2Mode: album2PreviewMode ? "preview" : "full",
        savedAt: Date.now()
      }));
    } catch {}
  };

  window.jahntellaMarkSiteCredit = key => {
    if (key === currentKey) {
      currentCredited = true;
      persistSitePlayback(true);
    }
  };

  window.jahntellaResetSiteCredit = key => {
    if (key === currentKey) {
      currentCredited = false;
      persistSitePlayback(true);
    }
  };

  const currentTrack = () => currentKey ? tracks[currentKey] : null;
  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  };

  const setPlaying = playing => {
    toggle.textContent = playing ? "❚❚" : "▶";
    player.classList.toggle("playing", playing);
    Object.entries(tracks).forEach(([key, track]) => {
      const active = key === currentKey;
      track.recordWrap?.classList.toggle("is-spinning", playing && active);
      track.card?.classList.toggle("is-active", active);
      const button = track.card?.querySelector(".play-button");
      if (button) button.textContent = active && playing ? `❚❚ Pause ${track.title}` : `▶ Play ${track.title}`;
    });
    persistSitePlayback(true);
  };

  const stopOthers = selected => {
    Object.values(tracks).forEach(track => {
      if (track.audio !== selected) {
        track.audio.pause();
        track.audio.currentTime = 0;
        track.recordWrap?.classList.remove("is-spinning");
      }
    });
  };

  // Mobile browsers sometimes report play() success while the next remote file
  // is still stalled. Recover this transition once without reloading the site.
  let transitionWatchdog = null;
  let transitionSerial = 0;
  const playbackNotice = document.createElement('button');
  playbackNotice.type = 'button';
  playbackNotice.setAttribute('aria-live','polite');
  // Keep the recovery action outside the player grid layout, so displaying
  // it cannot create an extra row or make the mobile dock taller.
  playbackNotice.className = 'jahntella-resume-notice';
  playbackNotice.style.display = 'none';
  playbackNotice.textContent = '♡ Tap to resume this song';
  player.appendChild(playbackNotice);
  const hidePlaybackNotice = () => { playbackNotice.style.display = 'none'; };
  const showPlaybackNotice = () => { playbackNotice.style.display = 'block'; };
  playbackNotice.addEventListener('click', () => {
    const audio=currentTrack()?.audio;
    if(!audio)return;
    hidePlaybackNotice();
    audio.play().then(()=>setPlaying(true)).catch(()=>showPlaybackNotice());
  });
  const watchMobileTransition = (key, audio) => {
    clearTimeout(transitionWatchdog);
    const serial=++transitionSerial;
    const from=audio.currentTime;
    let recoveryUsed=false;
    const check=()=>{
      if(serial!==transitionSerial || currentKey!==key || audio.ended || audio.paused || document.hidden)return;
      if(audio.currentTime>from+0.35){hidePlaybackNotice();return;}
      if(!recoveryUsed){
        recoveryUsed=true;
        const position=audio.currentTime;
        // One load retry only, preserving position when metadata is available.
        audio.pause();
        audio.load();
        const restart=()=>{
          if(serial!==transitionSerial || currentKey!==key)return;
          if(position>0 && audio.seekable.length){
            try{audio.currentTime=position;}catch(e){}
          }
          audio.play().then(()=>{
            if(serial===transitionSerial && currentKey===key) {
              setPlaying(true);
              transitionWatchdog=setTimeout(()=>{
                if(currentKey===key && serial===transitionSerial && !audio.paused && !audio.ended && !document.hidden && audio.currentTime<=from+0.35)showPlaybackNotice();
              },6500);
            }
          }).catch(()=>showPlaybackNotice());
        };
        if(audio.readyState>=2)restart();
        else audio.addEventListener('canplay',restart,{once:true});
        transitionWatchdog=setTimeout(()=>{
          if(serial===transitionSerial && currentKey===key && !audio.paused && !audio.ended && !document.hidden && audio.currentTime<=from+0.35)showPlaybackNotice();
        },9000);
      }
    };
    transitionWatchdog=setTimeout(check,8500);
  };
  const selectTrack = (key, autoplay = true, options = {}) => {
    const track = tracks[key];
    if (!track?.audio) return;
    if (activePlaylist && !options.fromPlaylist) {
      activePlaylist=null;playlistPosition=-1;playlistStatus();
    }
    const changing = currentKey !== key;
    clearTimeout(transitionWatchdog);
    ++transitionSerial;
    hidePlaybackNotice();
    stopOthers(track.audio);
    currentKey = key;
    if (activePlaylist) playlistStatus();
    if (changing || options.fresh) currentCredited = false;
    if (typeof options.credited === "boolean") currentCredited = options.credited;
    title.textContent = track.title;
    // Some full-resolution cover files are placeholders; use the thumbnail
    // when the original cannot load, without exposing alt text in the player.
    artwork.onerror = () => {
      const currentSrc = artwork.getAttribute("src") || "";
      if (!currentSrc.includes("-thumb.webp") && currentSrc.endsWith(".webp")) {
        artwork.src = currentSrc.slice(0, -5) + "-thumb.webp";
      } else {
        artwork.onerror = null;
        artwork.src = "assets/fun-dipp-cover.webp";
      }
    };
    artwork.alt = "";
    artwork.setAttribute("aria-hidden", "true");
    artwork.src = track.artwork;
    player.classList.add("visible");
    Object.entries(tracks).forEach(([trackKey, item]) => item.card?.classList.toggle("is-active", trackKey === key));
    if (key === 'bite-lip' && changing) {
      // Force this particular file to use the refreshed MP3 URL rather than a cached failed load.
      const source = track.audio.querySelector('source');
      if (source) {
        const url = source.getAttribute('src');
        if (track.audio.getAttribute('src') !== url) {
          track.audio.src = url;
        }
      }
      track.audio.load();
    }
    if (autoplay) {
      track.audio.play().then(() => {
        if (currentKey !== key || track.audio.paused) return;
        setPlaying(true);
        if(changing || options.fresh)watchMobileTransition(key,track.audio);
        // Celebrate confirmed new selections and autoplay transitions, not resume/pause.
        if (changing || options.fresh) {
          window.dispatchEvent(new CustomEvent('jahntella:trackstarted', {detail:{
            key, title:track.title, artwork:track.artwork,
            era:track.era || track.card?.closest('[id$="EraAlbum"],#shineEraSneakPeek')?.id
              ?.replace('EraAlbum','').replace('EraSneakPeek','') || ''
          }}));
        }
      }).catch(error => {
        console.warn('Jahntella playback could not start:', track.title, error);
        setPlaying(false);
        if(currentKey===key)showPlaybackNotice();
      });
    } else setPlaying(false);
  };

  window.jahntellaSelectSiteTrack = (key, autoplay = true, options = {}) => {
    selectTrack(key, autoplay, options);
  };
  window.jahntellaPlayPlaylist = id => {
    const data=curatedPlaylists[id];
    if (!data || !data.songs.every(k => tracks[k]?.audio)) return false;
    activePlaylist=id;playlistPosition=0;
    selectTrack(data.songs[0],true,{fromPlaylist:true,fresh:true});
    return true;
  };
  window.jahntellaStopPlaylist = () => {
    activePlaylist=null;playlistPosition=-1;playlistStatus();
  };
  window.jahntellaPlaylistState = () => ({
    id:activePlaylist,index:playlistPosition,
    total:activePlaylist?curatedPlaylists[activePlaylist].songs.length:0
  });

  const coverPlayStyles = document.createElement("style");
  coverPlayStyles.id = "jahntellaPlayableCoverStyles";
  coverPlayStyles.textContent = `
    .jahntella-playable-cover{cursor:pointer!important;transition:transform .22s ease,filter .22s ease,box-shadow .22s ease!important}
    .jahntella-playable-cover:hover{filter:brightness(1.08)!important}
    img.jahntella-playable-cover:hover{transform:scale(1.025)!important}
    .jahntella-playable-cover:focus-visible{outline:3px solid #ff8dcc!important;outline-offset:4px!important;box-shadow:0 0 0 7px rgba(255,79,183,.2)!important}
  `;
  document.head.appendChild(coverPlayStyles);

  const toggleCoverTrack = key => {
    const track = tracks[key];
    if (!track?.audio) return;
    if (currentKey === key && !track.audio.paused) {
      track.audio.pause();
      setPlaying(false);
      return;
    }
    if (currentKey === key) {
      track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    selectTrack(key);
  };

  const makeCoverPlayable = (element, key) => {
    const track = tracks[key];
    if (!element || !track || element.dataset.jahntellaCoverTrack) return;
    element.dataset.jahntellaCoverTrack = key;
    element.classList.add("jahntella-playable-cover");
    element.setAttribute("aria-label", `Play or pause ${track.title}`);
    element.title = `Play or pause ${track.title}`;

    const nativeControl = element.matches("button,a[href]");
    if (!nativeControl) {
      element.setAttribute("role", "button");
      element.tabIndex = 0;
    }

    element.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleCoverTrack(key);
    });

    if (!nativeControl) {
      element.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleCoverTrack(key);
      });
    }
  };

  Object.entries(tracks).forEach(([key, track]) => {
    track.card?.querySelectorAll("img").forEach(image => makeCoverPlayable(image, key));
  });

  const galleryCoverTracks = {
    "fun-dipp-cover.png": "fun-dipp",
    "fun-dipp-cover.webp": "fun-dipp",
    "pink-lips-remix.png": "pink-lips",
    "pink-lips-remix.webp": "pink-lips",
    "bite-lip-cover.png": "bite-lip",
    "gloss-cover.png": "gloss",
    "i-want-to-be-your-girl-cover.webp": "your-girl",
    "embrace-me-cover.webp": "embrace-me",
    "we-come-together-cover.png": "we-come-together",
    "play-with-me-cover.png": "play-with-me",
    "carnival-cover.png": "carnival",
    "made-of-light-cover.png": "made-of-light",
    "candy-wrapper-cover.png": "candy-wrapper",
    "playground-cover.png": "playground",
    "milk-shake-cover.png": "milk-shake",
    "tonight-cover.png": "tonight",
    "jsweetdreamsnew.png": "sweet-dreams",
    "jweare1new.png": "we-are-1",
    "jboots,smile,attitudenew.png": "boots-smile-attitude",
    "jcomeherecomeclosenew.png": "come-here-come-close",
    "jtouchnew.png": "touch",
    "jpullmein.png": "pull-me-in",
    "jstripnew.png": "strip",
    "jwhatyoudotome.png": "what-you-do-to-me",
    "jexistnew.png": "exist",
    "jescape.png": "escape",
    "jpinkpetalsnew.png": "pink-petals"
  };

  (window.JAHNTELLA_EXTRA_TRACKS || []).forEach(track => { galleryCoverTracks[decodeURIComponent(track.artwork.split(/[?#]/)[0].split('/').pop()).toLowerCase()] = track.key; });

  document.querySelectorAll("#gallery [data-lightbox]").forEach(cover => {
    const path = cover.dataset.lightbox?.split(/[?#]/)[0] || "";
    const filename = decodeURIComponent(path.split("/").pop() || "").toLowerCase();
    const key = galleryCoverTracks[filename];
    if (key) makeCoverPlayable(cover, key);
  });

  const moveTrack = direction => {
    if (activePlaylist) {
      const songs=curatedPlaylists[activePlaylist].songs;
      const nextPosition=playlistPosition+direction;
      if (nextPosition>=0 && nextPosition<songs.length) {
        playlistPosition=nextPosition;
        selectTrack(songs[playlistPosition],true,{fromPlaylist:true,fresh:true});
      }
      return;
    }
    const index = currentKey ? order.indexOf(currentKey) : 0;
    selectTrack(order[(index + direction + order.length) % order.length]);
  };

  document.querySelectorAll(".play-button").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.track;
      const track = tracks[key];
      if (currentKey === key && track && !track.audio.paused) {
        track.audio.pause();
        setPlaying(false);
      } else selectTrack(key);
    });
  });
  document.querySelectorAll(".sparkle-cover-play").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.track, track = tracks[key];
    if (!track) return;
    if (currentKey === key && !track.audio.paused) { track.audio.pause(); setPlaying(false); }
    else selectTrack(key);
  }));

  toggle.addEventListener("click", () => {
    if (!currentKey) return selectTrack("fun-dipp");
    const track = currentTrack();
    if (track.audio.paused) track.audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { track.audio.pause(); setPlaying(false); }
  });

  prev.addEventListener("click", () => moveTrack(-1));
  next.addEventListener("click", () => moveTrack(1));

  volume.addEventListener("input", () => {
    const level = Number(volume.value);
    Object.values(tracks).forEach(track => track.audio.volume = level);
  });

  // Signal one exact halfway-through radio moment for each uninterrupted song
  // playthrough. The main player knows the active track, unlike document-wide
  // media listeners, and can distinguish actual progress from seeking.
  const radioProgress = new WeakMap();
  Object.values(tracks).forEach(track => {
    const audio=track.audio;
    radioProgress.set(audio,{last:0,lyricsFired:false,fired:false,shareFired:false,seeked:false});
    audio.addEventListener('seeking',()=>{
      const state=radioProgress.get(audio);
      if(state)state.seeked=true;
    });
    audio.addEventListener('seeked',()=>{
      const state=radioProgress.get(audio);
      if(!state)return;
      state.last=audio.currentTime;
      state.lyricsFired=Number.isFinite(audio.duration)&&audio.currentTime>=audio.duration*.25;
      state.fired=Number.isFinite(audio.duration)&&audio.currentTime>=audio.duration/2;
      state.shareFired=Number.isFinite(audio.duration)&&audio.currentTime>=audio.duration*.75;
      state.seeked=false;
    });
    audio.addEventListener('play',()=>{
      const state=radioProgress.get(audio);
      if(state&&audio.currentTime<1){
        state.last=0;
        state.lyricsFired=false;
        state.fired=false;
        state.shareFired=false;
        state.seeked=false;
      }
    });
    audio.addEventListener('timeupdate',()=>{
      if(currentTrack()!==track||audio.paused||audio.seeking||document.hidden)return;
      const state=radioProgress.get(audio);
      const now=audio.currentTime,duration=audio.duration;
      if(!state||!Number.isFinite(duration)||duration<30)return;
      const lyricsPoint=duration*.25;
      const midpoint=duration/2;
      // Reset state on a real restart, not merely an audio pause/resume.
      if(now<1&&state.last>3){state.lyricsFired=false;state.fired=false;state.shareFired=false;state.last=0;}
      // Invite a singalong only when playback naturally crosses the quarter mark.
      const lyricsCrossed=!state.lyricsFired&&!state.seeked&&state.last<lyricsPoint&&now>=lyricsPoint;
      if(lyricsCrossed){
        state.lyricsFired=true;
        if(now-lyricsPoint<3){
          const key=Object.keys(tracks).find(k=>tracks[k]===track)||'';
          window.dispatchEvent(new CustomEvent('jahntella:radio-lyrics-reminder',{
            detail:{key,title:track.title,artwork:track.artwork,era:track.era||track.card?.closest('[id$="EraAlbum"],#shineEraSneakPeek')?.id||''}
          }));
        }
      }
      const crossed=!state.fired&&!state.seeked&&state.last<midpoint&&now>=midpoint;
      if(crossed){
        state.fired=true;
        if(now-midpoint<3){
          const key=Object.keys(tracks).find(k=>tracks[k]===track)||'';
          window.dispatchEvent(new CustomEvent('jahntella:radio-midpoint',{
            detail:{key,title:track.title,artwork:track.artwork,era:track.era||track.card?.closest('[id$="EraAlbum"],#shineEraSneakPeek')?.id||''}
          }));
        }
      }
      // A separate, once-per-playthrough 75% moment asks Sweeties to share.
      // Skips during/after scrubbing so a seek does not trigger a surprise.
      const sharePoint=duration*.75;
      const shareCrossed=!state.shareFired&&!state.seeked&&state.last<sharePoint&&now>=sharePoint;
      if(shareCrossed){
        state.shareFired=true;
        if(now-sharePoint<3){
          const key=Object.keys(tracks).find(k=>tracks[k]===track)||'';
          window.dispatchEvent(new CustomEvent('jahntella:radio-share-reminder',{
            detail:{key,title:track.title,artwork:track.artwork,era:track.era||track.card?.closest('[id$="EraAlbum"],#shineEraSneakPeek')?.id||''}
          }));
        }
      }
      state.last=now;
    });
  });

  Object.values(tracks).forEach(track => {
    track.audio.volume = Number(volume.value);
    track.audio.addEventListener("play", () => { if (currentTrack() === track) setPlaying(true); });
    track.audio.addEventListener("pause", () => { if (currentTrack() === track && !track.audio.ended) setPlaying(false); });
    track.audio.addEventListener("timeupdate", () => {
      if (currentTrack() !== track) return;
      if(!track.audio.paused && track.audio.currentTime>0.5)hidePlaybackNotice();
      progress.value = track.audio.duration ? (track.audio.currentTime / track.audio.duration) * 100 : 0;
      time.textContent = formatTime(track.audio.currentTime);
      persistSitePlayback();
    });
    track.audio.addEventListener("ended", () => {
      // Curated playlists play in the selected order, ending after song four.
      if (currentTrack() !== track) return;
      if (activePlaylist) {
        const songs=curatedPlaylists[activePlaylist].songs;
        if (playlistPosition+1<songs.length) {
          playlistPosition++;
          selectTrack(songs[playlistPosition],true,{fromPlaylist:true,fresh:true});
        } else {
          activePlaylist=null;playlistPosition=-1;playlistStatus();setPlaying(false);
        }
        return;
      }
      // Ordinary listening retains the original five-era continuous sequence.
      const position = order.indexOf(currentKey);
      const nextKey = order[(position + 1) % order.length];
      if (nextKey && tracks[nextKey]?.audio) selectTrack(nextKey, true, {fresh:true});
    });
  });

  progress.addEventListener("input", () => {
    const track = currentTrack();
    if (!track || !track.audio.duration) return;
    track.audio.currentTime = (Number(progress.value) / 100) * track.audio.duration;
    persistSitePlayback(true);
  });

  const savedPlayback = readSitePlayback();
  let hasSavedShinePlayback = false;
  try {
    const shinePlayback = JSON.parse(sessionStorage.getItem(SHINE_PLAYBACK_KEY) || "{}");
    hasSavedShinePlayback = typeof shinePlayback.track === "string" && shinePlayback.track.length > 0;
  } catch {}
  if (savedPlayback.track && !hasSavedShinePlayback) {
    selectTrack(savedPlayback.track, false, {credited: savedPlayback.credited === true});
    const restored = currentTrack()?.audio;
    const restorePosition = () => {
      const max = Number.isFinite(restored.duration) ? Math.max(0, restored.duration - .25) : savedPlayback.position;
      try { restored.currentTime = Math.max(0, Math.min(Number(savedPlayback.position) || 0, max)); } catch {}
      progress.value = restored.duration ? (restored.currentTime / restored.duration) * 100 : 0;
      time.textContent = formatTime(restored.currentTime);
      if (savedPlayback.playing) {
        restored.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    if (restored.readyState >= 1) restorePosition();
    else {
      restored.addEventListener("loadedmetadata", restorePosition, {once: true});
      // With preload disabled, explicitly request only the saved song when
      // playback or a saved position actually needs to be restored.
      if (savedPlayback.playing || Number(savedPlayback.position) > 0) restored.load();
    }
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download")) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin === location.origin) persistSitePlayback(true);
  }, true);

  window.addEventListener("pagehide", () => persistSitePlayback(true));

  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, { passive: true });

  window.addEventListener("pointermove", event => {
    if (!heroVisual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - .5) * 10;
    const y = (event.clientY / window.innerHeight - .5) * 10;
    heroVisual.style.transform = `translate3d(${x}px,${y}px,0)`;
  });

  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.lightbox;
      lightboxImage.alt = item.querySelector("img")?.alt || "Jahntella artwork";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

  const sweetVaultCards = [
    { id:"001", title:"Bubblegum Queen", rarity:"Legendary", image:"sv-001-bubblegum-queen.png", weight:5 },
    { id:"002", title:"Fun Dipp", rarity:"Ultra Rare", image:"sv-002-fun-dipp.png", weight:6 },
    { id:"003", title:"Pink Lips", rarity:"Ultra Rare", image:"sv-003-pink-lips.png", weight:6 },
    { id:"004", title:"Candy Rebel", rarity:"Epic", image:"sv-004-candy-rebel.png", weight:10 },
    { id:"005", title:"Neon Sweetheart", rarity:"Epic", image:"sv-005-neon-sweetheart.png", weight:10 },
    { id:"006", title:"Donut District", rarity:"Rare", image:"sv-006-donut-district.png", weight:9 },
    { id:"007", title:"Melody Studio", rarity:"Rare", image:"sv-007-melody-studio.png", weight:9 },
    { id:"008", title:"Sparkle Lake", rarity:"Rare", image:"sv-008-sparkle-lake.png", weight:9 },
    { id:"009", title:"Pink Café", rarity:"Rare", image:"sv-009-pink-cafe.png", weight:9 },
    { id:"010", title:"Cotton Candy Clouds", rarity:"Rare", image:"sv-010-cotton-candy-clouds.png", weight:9 },
    { id:"011", title:"Stay Sweet", rarity:"Rare", image:"sv-011-stay-sweet.png", weight:9 },
    { id:"012", title:"XO Sweetie", rarity:"Secret Rare", image:"sv-012-xo-sweetie-secret.png", weight:5 }
  ];

  const STORAGE_KEY = "jahntellaSweetVaultV17";
  const BACK_IMAGE = "sweet-vault-card-back.png";
  const vaultGrid = document.getElementById("vaultGrid");
  const vaultCount = document.getElementById("vaultCount");
  const vaultPercent = document.getElementById("vaultPercent");
  const vaultProgressBar = document.getElementById("vaultProgressBar");
  const openPackButton = document.getElementById("openPackButton");
  const packStatus = document.getElementById("packStatus");
  const resetVaultButton = document.getElementById("resetVaultButton");
  const lastPulledCard = document.getElementById("lastPulledCard");
  const revealModal = document.getElementById("cardRevealModal");
  const revealCardImage = document.getElementById("revealCardImage");
  const revealTitle = document.getElementById("revealTitle");
  const revealRarity = document.getElementById("revealRarity");
  const revealMessage = document.getElementById("revealMessage");
  const revealDoneButton = document.getElementById("revealDoneButton");
  const closeRevealButton = document.getElementById("closeRevealButton");
  const confettiLayer = document.getElementById("confettiLayer");

  if (vaultGrid && vaultCount && vaultPercent && vaultProgressBar && openPackButton &&
      packStatus && resetVaultButton && lastPulledCard && revealModal && revealCardImage &&
      revealTitle && revealRarity && revealMessage && revealDoneButton && closeRevealButton &&
      confettiLayer) {
  const readVault = () => {
    const keys = [STORAGE_KEY, "jahntellaSweetVaultV18", "jahntellaSweetVaultV19"];
    for (const key of keys) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        if (Array.isArray(parsed.collected) || parsed.lastPulled) {
          return {
            collected: Array.isArray(parsed.collected) ? [...new Set(parsed.collected)] : [],
            lastPulled: parsed.lastPulled || null
          };
        }
      } catch {}
    }
    return { collected: [], lastPulled: null };
  };

  let vaultState = readVault();
  let activePull = null;
  let opening = false;

  const saveVault = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(vaultState));

  const rarityClass = rarity => `rarity-${rarity.replaceAll(" ", "-")}`;

  const renderLastPulled = () => {
    const card = sweetVaultCards.find(item => item.id === vaultState.lastPulled);
    if (!card) {
      lastPulledCard.innerHTML = '<p class="eyebrow">LAST PULLED</p><div class="last-pulled-placeholder">Your newest card will appear here.</div>';
      return;
    }
    lastPulledCard.innerHTML = `
      <p class="eyebrow">LAST PULLED</p>
      <div class="last-pulled-display">
        <img src="${card.image}" alt="${card.title} Sweet Vault card">
        <div>
          <span class="rarity-pill">${card.rarity}</span>
          <h3>${card.title}</h3>
          <p>Card ${card.id} is safely stored in your Sweet Vault.</p>
        </div>
      </div>`;
  };

  const renderVault = () => {
    vaultGrid.innerHTML = sweetVaultCards.map(card => {
      const unlocked = vaultState.collected.includes(card.id);
      return `
        <button class="vault-card-button ${unlocked ? "" : "is-locked"}" data-card-id="${card.id}" ${unlocked ? "" : "aria-disabled='true'"} aria-label="${unlocked ? `Flip ${card.title}` : `Locked card ${card.id}`}">
          <span class="vault-card-scene">
            <span class="vault-card-inner">
              <span class="vault-card-face vault-card-front">
                <img src="${unlocked ? card.image : BACK_IMAGE}" alt="${unlocked ? `${card.title} card front` : "Locked Sweet Vault card"}">
              </span>
              <span class="vault-card-face vault-card-back">
                <img src="${BACK_IMAGE}" alt="Sweet Vault card back">
              </span>
            </span>
          </span>
        </button>`;
    }).join("");

    vaultGrid.querySelectorAll(".vault-card-button:not(.is-locked)").forEach(button => {
      button.addEventListener("click", () => button.classList.toggle("is-flipped"));
    });

    const count = vaultState.collected.length;
    const percent = Math.round((count / sweetVaultCards.length) * 100);
    vaultCount.textContent = String(count);
    vaultPercent.textContent = `${percent}%`;
    vaultProgressBar.style.width = `${percent}%`;
    renderLastPulled();
  };

  const weightedPull = () => {
    const total = sweetVaultCards.reduce((sum, card) => sum + card.weight, 0);
    let roll = Math.random() * total;
    for (const card of sweetVaultCards) {
      roll -= card.weight;
      if (roll <= 0) return card;
    }
    return sweetVaultCards[sweetVaultCards.length - 1];
  };

  const createConfetti = amount => {
    confettiLayer.innerHTML = "";
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * .8}s`;
      piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
      confettiLayer.appendChild(piece);
    }
  };

  const closeReveal = () => {
    revealModal.className = "card-reveal-modal";
    revealModal.setAttribute("aria-hidden", "true");
    confettiLayer.innerHTML = "";
    activePull = null;
  };

  const commitPullToVault = card => {
    const isNew = !vaultState.collected.includes(card.id);
    if (isNew) vaultState.collected.push(card.id);
    vaultState.lastPulled = card.id;

    try {
      saveVault();
    } catch (error) {
      console.error("Sweet Vault could not save:", error);
    }

    renderVault();
if(window.innerWidth<769){setTimeout(()=>document.getElementById('vaultBinder')?.scrollIntoView({behavior:'smooth',block:'start'}),900);}

    if (isNew) {
      const slot = vaultGrid.querySelector(`[data-card-id="${card.id}"]`);
      slot?.classList.add("just-unlocked");
      window.setTimeout(() => slot?.classList.remove("just-unlocked"), 5200);
    }

    return isNew;
  };

  const showReveal = card => {
    activePull = card;
    const isNew = commitPullToVault(card);

    revealModal.className = `card-reveal-modal open ${rarityClass(card.rarity)}`;
    revealModal.setAttribute("aria-hidden", "false");
    revealCardImage.src = card.image;
    revealCardImage.alt = `${card.title} Sweet Vault card`;
    revealRarity.textContent = card.rarity.toUpperCase();
    revealTitle.textContent = card.title;
    revealMessage.textContent = isNew
      ? "New card unlocked and saved to your Sweet Vault."
      : "Duplicate pull — your previous copy remains safely stored.";
    revealDoneButton.textContent = "View My Vault";

    if (card.rarity === "Secret Rare") createConfetti(70);
    else if (card.rarity === "Legendary" || card.rarity === "Ultra Rare") createConfetti(35);

    window.setTimeout(() => revealModal.classList.add("is-revealed"), 850);
  };

  openPackButton.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    packStatus.textContent = "The foil pack is opening...";
    openPackButton.classList.add("is-opening");
    window.setTimeout(() => {
      const card = weightedPull();
      showReveal(card);
      openPackButton.classList.remove("is-opening");
      packStatus.textContent = `${card.title} revealed!`;
      opening = false;
    }, 1050);
  });

  revealDoneButton.addEventListener("click", () => {
    closeReveal();
    document.getElementById("vaultGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  closeRevealButton.addEventListener("click", closeReveal);
  revealModal.addEventListener("click", event => {
    if (event.target.classList.contains("reveal-backdrop")) closeReveal();
  });

  resetVaultButton.addEventListener("click", () => {
    if (!window.confirm("Reset the entire Sweet Vault collection on this device?")) return;
    vaultState = { collected: [], lastPulled: null };
    saveVault();
    renderVault();
    packStatus.textContent = "Vault reset. Tap the pack to start again.";
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeReveal();
    }
  });

  renderVault();
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach(section => observer.observe(section));
  document.getElementById("year").textContent = new Date().getFullYear();

  // Reveal as soon as the page structure is usable. Waiting for every image,
  // font and media request made the loader feel stuck on slower connections.
  window.setTimeout(() => siteLoader?.classList.add("is-hidden"), 120);
})();
