'use strict';

var template = require('raw!./slider.html');

function getBoolean(value) {
  return value ? true : false;
}

Vue.component('slider', {
  template: template,
  props: {
    arrows: {
      type: Boolean,
      default: false,
      coerce: getBoolean
    },
    dots: {
      type: Boolean,
      default: false,
      coerce: getBoolean
    },
    fullscreen: {
      type: Boolean,
      default: false,
      coerce: getBoolean
    },
    actions: {
      type: Boolean,
      default: false,
      coerce: getBoolean
    }
  },
  data: function() {
    return {
      position: 0,
      slide: 0,
      slidesNumber: 0,
      inFullscreen: false
    };
  },
  computed: {
    toolbar: function() {
      return this.dots || this.fullscreen || this.actions;
    }
  },
  methods: {
    pan: function(event) {
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position;
        this.track.velocity('stop');
      }

      var delta = event.deltaX;

      if (
        this.slide === 0 && event.deltaX > 0 ||
        this.slide === this.slidesNumber - 1 && event.deltaX < 0
      ) {
        delta = delta / 10;
      }

      this.position = this.initialPosition + delta / this.track.width() * 100;
      this.track.css('transform', 'translateX(' + this.position + '%)');

      if (event.isFinal) {
        if (event.distance < 100) {
          this.goToSlide(this.slide);
        }
        else {
          this.goToSlide(event.deltaX < 0 ? this.slide + 1 : this.slide - 1);
        }
        delete this.initialPosition;
      }
    },
    goToSlide: function(slide) {
      this.slide = Math.min(this.slidesNumber - 1, Math.max(0, slide));
      this.track.velocity('stop').velocity({
        translateX: [- this.slide * 100 + '%', this.position + '%']
      });
      this.position = - this.slide * 100;
    },
    toggleFullscreen: function() {
      this.inFullscreen = !this.inFullscreen;
    }
  },
  ready: function() {
    this.track = $(this.$els.track);
    this.slidesNumber = this.track.children().length;
  }
});
