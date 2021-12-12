const getElementByVideoId = function (videoId) {
  return document.querySelector(`[data-videoid="${videoId}"]`);
};

Wistia.plugin("autoplay-delay-plugin", function(video, options) {

  console.log("VIDEO IS 1", video.data.media.hashedId)
  
  const setPlaying = function (isPlaying) {
    const previousEl = document.querySelector('.playing');
    const el = getElementByVideoId(video.data.media.hashedId);

    if (previousEl) {
      previousEl.classList.remove('playing');
    }

    el.classList.add('playing');
  }

  video.bind("play", function() {
    setPlaying();
  });

  video.bind("beforeremove", function() {
    return video.unbind();
  });
});
