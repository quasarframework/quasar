'use strict';

$.fn.reverse = [].reverse;
var fullscreen = require('./js/fullscreen');

$.extend(true, quasar, {
  nextTick: function(fn) {
    setTimeout(fn, 1);
  },
  get: {
    fn: {
      param: {
        names: require('./js/getFnParamNames')
      }
    },
    normalized: {
      path: require('./js/normalizePath')
    }
  },
  open: {
    url: require('./js/open-url')
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  debounce: require('./js/debounce'),
  is: {
    fullscreen: fullscreen.active
  },
  request: {
    fullscreen: fullscreen.request
  },
  exit: {
    fullscreen: fullscreen.exit
  },
  toggle: {
    fullscreen: fullscreen.toggle
  },
  runs: {
    within: {
      iframe: window.self != window.top
    }
  }
});
