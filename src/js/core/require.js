var
  js = require('./require/script'),
  css = require('./require/css')
  ;


module.exports = {
  require: {
    js: js.load
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
      js: {
        cache: js.clear
      }
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
};
