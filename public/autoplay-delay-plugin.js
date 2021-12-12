Wistia.plugin("autoplay-delay-plugin", function(video, options) {
  video.bind("play", function() {
    console.log("PLAYING", video);
  });
});
