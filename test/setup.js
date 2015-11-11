'use strict';

window.testing = {
  phantomjs: (function() {
    return navigator.userAgent.indexOf('PhantomJS') > -1;
  }())
};

// Immediately throw error when using Sinon.
// The default behavior is to throw error in a setTimeout().
window.sinon.logError.useImmediateExceptions = true;

if (typeof Function.prototype.bind != 'function') {
  /*eslint-disable no-extend-native*/
  Function.prototype.bind = function bind(obj) {
    var
      args = Array.prototype.slice.call(arguments, 1),
      self = this,
      Nop = function() {},
      bound = function() {
        return self.apply(
          this instanceof Nop ? this : obj || {}, args.concat(
            Array.prototype.slice.call(arguments)
          )
        );
      };

    Nop.prototype = this.prototype || {};
    bound.prototype = new Nop();
    return bound;
  };
}

(function() {

  var
    server,
    appManifest,
    callback
    ;

  if ($('#quasar-view').length === 0) {
    $('<div id="quasar-view">').appendTo($('body'));
  }

  window.testing.app = {
    reset: function() {
      $('#quasar-view').html('');
      quasar.stop.router();
      window.location.hash = '';
      if (server) {
        server.restore();
      }
      quasar.clear.requests.cache();
      quasar.clear.require.cache();
      quasar.clear.global.css();
      quasar.clear.page.css();
    },
    prepare: function() {
      callback = null;
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      appManifest = {
        pages: {}
      };
    },
    start: function() {
      this.registerFile('app.json', JSON.stringify(appManifest));
      quasar.start.app();
    },

    addIndex: function(js, files, manifest) {
      this.addPage('index', [
        {
          url: 'js/script.index.js',
          content: js
        }
      ].concat(files || []), manifest);
    },
    addPage: function(name, files, manifest) {
      appManifest.pages[name] = manifest || {};

      _.forEach(files, function(file) {
        if (_.isFunction(file.content)) {
          file.content = '(' + file.content.toString() + '());';
        }
        this.registerFile('/pages/' + name + '/' + file.url, file.content, file.code);
      }.bind(this));
    },

    registerFile: function(url, content, code) {
      server.respondWith('GET', url, [code || 200, {'Content-Type': 'application/json'}, content]);
    }
  };

  window.testing.done = function() {
    if (callback) {
      callback();
    }
  };
  window.testing.done.set = function(done) {
    callback = done;
  };

  window.testing.assert = {
    pageCSS: function(href) {
      var css = $('#__quasar_page_css').html();

      expect(css).to.contain('<link');
      expect(css).to.contain('type="text/css"');
      expect(css).to.contain('href="' + href + '"');
      expect(css).to.contain('rel="stylesheet"');
      expect($('#__quasar_page_css').children().length == 1);
    }
  };

}());
