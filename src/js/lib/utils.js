'use strict';

module.exports = {
  nextTick: function(fn) {
    setTimeout(fn, 1);
  },
  get: {
    fn: {
      param: {
        names: require('./utils/getFnParamNames')
      }
    },
    normalized: {
      path: require('./utils/normalizePath')
    }
  }
};
