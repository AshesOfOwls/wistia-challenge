'use strict';

var ActiveVideo = {
  video: null,

  setVideo: function (video) {
    this.video = video;
  },

  getId: function () {
    return this.video.data.media.hashedId;
  }
};

var Playlist = {
  getMedias: function() {
    var url = new URL('https://api.wistia.com/v1/medias.json');
    url.searchParams.set('api_password', TOKEN);
    return axios.get(String(url));
  },

  renderMedia: function(media) {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.setAttribute('data-videoId', media.hashed_id);
    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.media-content').setAttribute(
      'href',
      '#wistia_' + media.hashed_id
    );

    document.getElementById('medias').appendChild(el);
  },

  getVideoElement: function () {
    const videoId = ActiveVideo.getId();
    const el = document.querySelector(`[data-videoid=${videoId}]`);
    return el;
  },
  
  setCurrentlyPlaying: function () {
    const videoId = ActiveVideo.getId();
    const el = this.getVideoElement(videoId);

    el.classList.add('playing');
  },

  removeCurrentlyPlaying: function () {
    const videoId = ActiveVideo.getId();
    const el = this.getVideoElement(videoId);

    el.classList.remove('playing');
  }
};

var Player = {
  init: function () {
    const self = this;
    window._wq = window._wq || [];

    _wq.push({
      id: '_all',
      options: {
        plugin: {
          "autoplay-delay-plugin": {
            customOption: true,
            src: "autoplay-delay-plugin.js"
          }
        }
      },
      onReady: function (video) {
        console.log("ON READY")
        self.setActiveVideo(video);
      },
    });
  },

  setActiveVideo: function (video) {
    this.removeActiveVideo();

    ActiveVideo.setVideo(video);
    this.createVideoListeners();
  },

  removeActiveVideo: function () {
    if (!ActiveVideo.video) return;

    this.onVideoEnd();
    this.destroyVideoListeners();
  },

  createVideoListeners: function () {
    const video = ActiveVideo.video;

    video.bind('play', this.onVideoPlay);
    video.bind('end', this.onVideoEnd);
    video.bind('beforereplace', this.onVideoReplace.bind(this));
  },

  destroyVideoListeners: function () {
    const video = ActiveVideo.video;

    video.unbind('play', this.onVideoPlay);
    video.unbind('end', this.onVideoEnd);
    video.unbind('beforereplace', this.onVideoReplace.bind(this));
  },

  onVideoPlay: function () {
    Playlist.setCurrentlyPlaying();
  },

  onVideoEnd: function () {
    Playlist.removeCurrentlyPlaying();
  },

  onVideoReplace: function () {
    this.removeActiveVideo()
    console.log("BEFORE VIDEO REPLACED");
  },
};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      Player.init();
      Playlist.getMedias().then(function(response) {
        var medias = response.data;
        if (!medias) {
          return;
        }

        document
          .querySelector('.wistia_embed')
          .classList.add('wistia_async_' + medias[0].hashed_id);

        medias.forEach(function(media) {
          Playlist.renderMedia(media);
        });
      });
    },
    false
  );
})();
