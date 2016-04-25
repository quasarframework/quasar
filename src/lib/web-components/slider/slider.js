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
    indicators: {
      type: Boolean,
      default: false,
      coerce: getBoolean
    }
  },
  data: function() {
    return {
      position: 0,
      slide: 0,
      slidesNumber: 0
    };
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
        delta = delta / 7;
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
        //this.goToSlide(event.distance > 130 ? - Math.round(this.position / 100) : this.slide);
        delete this.initialPosition;
      }
    },
    goToSlide: function(slide) {
      this.slide = Math.min(this.slidesNumber - 1, Math.max(0, slide));
      this.track.velocity('stop').velocity({
        translateX: [- this.slide * 100 + '%', this.position + '%']
      });
      this.position = - this.slide * 100;
    }
  },
  ready: function() {
    this.track = $(this.$els.track);
    this.slidesNumber = this.track.children().length;
  }
});
