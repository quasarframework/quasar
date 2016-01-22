'use strict';

$.fn.reverse = [].reverse;

_.merge(q, {
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
  }
});
