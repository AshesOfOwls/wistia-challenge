const getElementByVideoId = function (videoId) {
  return document.querySelector(`[data-videoid="${videoId}"]`);
};

Wistia.plugin("autoplay-delay-plugin", function(video, options) {
  const togglePlaying = function (isPlaying) {
    const el = getElementByVideoId(video.data.media.hashedId);

    if (isPlaying) {
      el.classList.add('playing');
    } else {
      el.classList.remove('playing');
    }
  }

  video.bind("play", function() {
    togglePlaying(true);
  });

  video.bind("pause", function() {
    togglePlaying(false);
  });

  video.bind("end", function() {
    togglePlaying();
  });
});
