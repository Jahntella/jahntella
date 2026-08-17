/*
 * The Shine Era preview switch
 *
 * Keep `previewMode` false until the planned manual activation on August 26,
 * 2026. Changing this single value to true switches Sweet Dreams and We Are 1
 * to their prepared 60-second audio and video previews everywhere on the site.
 */
window.JAHNTELLA_ALBUM2 = Object.freeze({
  previewMode: false,
  plannedManualActivation: "2026-08-26",
  releaseDate: "2026-08-27",
  tracks: Object.freeze({
    "sweet-dreams": Object.freeze({
      fullAudio: "sweetville/sweet-dreams.mp3",
      previewAudio: "sweetville/previews/sweet-dreams-preview.mp3",
      fullVideo: "assets/album2/sweet-dreams-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/sweet-dreams-preview.mp4"
    }),
    "we-are-1": Object.freeze({
      fullAudio: "sweetville/we-are-1.mp3",
      previewAudio: "sweetville/previews/we-are-1-preview.mp3",
      fullVideo: "assets/album2/we-are-1-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/we-are-1-preview.mp4"
    }),
    "boots-smile-attitude": Object.freeze({
      fullAudio: "sweetville/boots-smile-attitude.mp3",
      previewAudio: "sweetville/previews/boots-smile-attitude-preview.mp3",
      fullVideo: "assets/album2/boots-smile-attitude-official-visualizer.mp4",
      previewVideo: "assets/album2/previews/boots-smile-attitude-preview.mp4"
    })
  })
});
