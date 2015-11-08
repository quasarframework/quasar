'use strict';

window.expect = chai.expect;
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

  window.testing.app = {
    reset: function() {
      quasar.stop.router();
      window.location.hash = '';
      if (server) {
        server.restore();
      }
      quasar.clear.requests.cache();
      quasar.clear.require.cache();
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
        this.registerFile('/pages/' + name + '/' + file.url, file.content);
      }.bind(this));
    },

    registerFile: function(url, content) {
      server.respondWith('GET', url, [200, {'Content-Type': 'application/json'}, content]);
    },
  };

  window.testing.done = function() {
    if (callback) {
      callback();
    }
  };
  window.testing.done.set = function(done) {
    callback = done;
  };

}());
