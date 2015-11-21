'use strict';

var
  script = require('./js/script'),
  css = require('./js/css')
  ;


_.merge(q, {
  require: {
    script: script.require
  },
  inject: {
    global: {
      css: function(url) {
        css.inject('global', url);
      }
    },
    page: {
      css: function(url) {
        css.inject('page', url);
      }
    }
  },
  clear: {
    require: {
      cache: script.clearCache
    },
    global: {
      css: function() {
        css.emptyNode('global');
      }
    },
    page: {
      css: function() {
        css.emptyNode('page');
      }
    }
  }
});
