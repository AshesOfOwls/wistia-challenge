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

  video.grid.top.appendChild(el);
};

const removeAutoplayElement = function () {
  var el = document.querySelector('.autoplay-delay');

  if (!el) return;

  el.remove();
};

const setAutoplaySize = function (size) {
  const autoplayElement = document.querySelector('.autoplay-delay');

  if (size.width) {
    autoplayElement.style.width = `${size.width}px`;
  }

  if (size.height) {
    autoplayElement.style.height = `${size.height}px`;
  }
};

let autoplayInterval = null;

const clearAutoplayInterval = function () {
  clearInterval(autoplayInterval);
};

Wistia.plugin("autoplay-delay-plugin", function(video, options) {
  const setPlayingClass = function (isPlaying) {
    const previousEl = document.querySelector('.playing');
    const el = getElementByVideoId(video.data.media.hashedId);

    if (previousEl && previousEl.classList) {
      previousEl.classList.remove('playing');
    }

    el.classList.add('playing');
  };

  const nextVideo = function () {
    clearAutoplayInterval();
  };

  video.bind("heightchange", function() {
    setAutoplaySize({ height: video.height() })
  });

  video.bind("widthchange", function() {
    setAutoplaySize({ width: video.width() })
  });
  
  video.bind("play", function() {
    removeAutoplayElement();
    setPlayingClass();
  });

  video.bind("end", function() {
    console.log("PAUSE")
    video.pause();

    createAutoplayElement(video);

    setAutoplaySize({ height: video.height() })
    setAutoplaySize({ width: video.width() })

    const timeAtEnd = Date.now();

    autoplayInterval = setInterval(function () {
      let timeLeft = Math.ceil(5 - ((Date.now() - timeAtEnd) / 1000));

      if (timeLeft <= 0) {
        timeLeft = 0;
        nextVideo();
      }

      updateAutoplayNumber(timeLeft);
    }, 500);

    return false;
  });

  video.bind("beforeremove", function() {
    clearAutoplayInterval();
    return video.unbind();
  });
});
