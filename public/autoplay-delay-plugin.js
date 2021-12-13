const getElementByVideoId = function (videoId) {
  return document.querySelector(`[data-videoid="${videoId}"]`);
};

const updateAutoplayNumber = function (timeLeft) {
  var numberElement = document.querySelector('.timeLeft');

  numberElement.innerHTML = timeLeft;
};

const createAutoplayElement = function (video) {
  var template = document.getElementById('autoplay-delay-template');
  var clone = template.content.cloneNode(true);
  var el = clone.children[0];

  video.grid.bottom_inside.appendChild(el);
};

const autoplayInterval = null;

Wistia.plugin("autoplay-delay-plugin", function(video, options) {
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

  video.bind("end", function() {
    createAutoplayElement(video);

    autoplayInterval = setInterval(function () {
      
    }, 1000);
    console.log("ON END", video)
  });

  video.bind("beforeremove", function() {
    return video.unbind();
  });
});
