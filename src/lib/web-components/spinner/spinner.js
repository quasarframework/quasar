'use strict';

var templates = {
  audio: require('raw!./svg-spinners/audio.svg'),
  ball: require('raw!./svg-spinners/ball.svg'),
  bars: require('raw!./svg-spinners/bars.svg'),
  circles: require('raw!./svg-spinners/circles.svg'),
  dots: require('raw!./svg-spinners/dots.svg'),
  facebook: require('raw!./svg-spinners/facebook.svg'),
  gears: require('raw!./svg-spinners/gears.svg'),
  grid: require('raw!./svg-spinners/grid.svg'),
  hearts: require('raw!./svg-spinners/hearts.svg'),
  hourglass: require('raw!./svg-spinners/hourglass.svg'),
  infinity: require('raw!./svg-spinners/infinity.svg'),
  ios: require('raw!./svg-spinners/ios.svg'),
  oval: require('raw!./svg-spinners/oval.svg'),
  pie: require('raw!./svg-spinners/pie.svg'),
  puff: require('raw!./svg-spinners/puff.svg'),
  radio: require('raw!./svg-spinners/radio.svg'),
  rings: require('raw!./svg-spinners/rings.svg'),
  tail: require('raw!./svg-spinners/tail.svg')
};

Object.keys(templates).forEach(function(spinner) {
  Vue.partial('quasar-partial-' + spinner, templates[spinner]);
});

Vue.component('spinner', {
  template: '<span><partial :name="partialName"></partial></span>',
  props: {
    name: {
      type: String,
      default: quasar.runs.on.ios ? 'ios' : 'tail'
    },
    size: {
      type: Number,
      default: 64
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  computed: {
    partialName: function() {
      return 'quasar-partial-' + this.name;
    }
  }
});
