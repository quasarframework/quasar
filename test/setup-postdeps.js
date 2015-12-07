'use strict';

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
      testing.app.var = {};
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
    },

    tag: function(template, fn) {
      testing.app.addIndex(
        '(function() {module.exports.config = { html: \'' + template + '\'};' +
        'module.exports.start = function() {var _html = $(\'#quasar-view\').html();(' + fn.toString() + '());}}());'
      );
      testing.app.start();
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
