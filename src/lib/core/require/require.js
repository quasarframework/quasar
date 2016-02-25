'use strict';

var
  script = require('./require/require-script'),
  css = require('./require/require-css')
  ;


$.extend(true, quasar, {
  require: {
    script: script.require
  },
  inject: {
    css: function(url) {
      css.inject(url);
    }
  },
  clear: {
    require: {
      cache: script.clearCache
    },
    css: function() {
      css.clear();
    }
  }
});
