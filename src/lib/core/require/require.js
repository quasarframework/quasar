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
      css.inject('global', url);
    },
    page: {
      css: function(url) {
        css.inject('page', url);
      }
    },
    layout: {
      css: function(url) {
        css.inject('layout', url);
      }
    }
  },
  clear: {
    require: {
      cache: script.clearCache
    },
    css: function() {
      css.emptyNode('global');
    },
    page: {
      css: function() {
        css.emptyNode('page');
      }
    },
    layout: {
      css: function() {
        css.emptyNode('layout');
      }
    }
  }
});
