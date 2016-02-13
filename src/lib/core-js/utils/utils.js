'use strict';

$.fn.reverse = [].reverse;

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
  }
});
