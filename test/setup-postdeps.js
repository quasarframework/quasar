'use strict';

(function() {

  var
    server,
    callback
    ;

  if ($('.screen').length === 0) {
    $('<div id="quasar-app">').appendTo($('body'));
  }

  window.testing.isAllVisible = function($this) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $this.offset().top;
    var elemBottom = elemTop + $this.height();

    return $this.is(':visible') && elemBottom <= docViewBottom && elemTop >= docViewTop;
  };

  window.testing.isPartVisible = function($this) {
    var docViewTop = $(window).scrollTop();

    var elemTop = $this.offset().top;
    var elemBottom = elemTop + $this.height();

    return $this.is(':visible') && elemTop < docViewTop && elemBottom > docViewTop;
  };

  window.testing.line = function(strip, fn) {
    if (typeof strip === 'function') {
      fn = strip;
      strip = false;
    }
    else if (typeof fn !== 'function') {
      throw new TypeError('line() expects a function');
    }
    else if (typeof strip !== 'boolean') {
      throw new TypeError('line() expects a boolean');
    }

    var match = /\/\*[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//.exec(fn.toString());

    if (!match) {
      throw new TypeError('line() expects a function with comment; check syntax');
    }

    return strip ? match[1].replace(/(\s)*\n(\s)*/g, '').trim() : match[1];
  };

  window.testing.app = {
    reset: function() {
      if (quasar.current.layout && quasar.current.layout.vm && quasar.current.layout.vm.$destroy) {
        quasar.current.layout.vm.$destroy();
      }
      if (quasar.current.page && quasar.current.page.vm && quasar.current.page.vm.$destroy) {
        quasar.current.page.vm.$destroy();
      }
      $('#quasar-app').html('');
      quasar.stop.router();
      window.location.hash = '';
      if (server) {
        server.restore();
      }
      quasar.clear.requests.cache();
      quasar.clear.require.cache();
      quasar.clear.css();
      quasar.data.manifest = {pages: {}, layouts: {}};
      quasar.current = {};
      testing.app.var = {};
    },
    prepare: function() {
      callback = null;
      server = sinon.fakeServer.create();
      server.autoRespond = true;
    },
    start: function() {
      quasar.start.app();
    },

    addIndex: function(js, files, manifest) {
      this.addPage('index', [
        {
          url: 'script.index.js',
          content: js
        }
      ].concat(files || []), manifest);
    },
    addPage: function(name, files, manifest) {
      quasar.data.manifest.pages[name] = manifest || {};

      files.forEach(function(file) {
        if (typeof file.content === 'function') {
          file.content = '(' + file.content.toString() + '());';
        }
        this.registerFile('/pages/' + name + '/' + file.url, file.content, file.code);
      }.bind(this));
    },

    addLayout: function(name, content, manifest) {
      quasar.data.manifest.layouts[name] = manifest || {};

      if (typeof content === 'function') {
        content = '(' + content.toString() + '());';
      }
      this.registerFile('/layouts/' + name + '/layout.' + name + '.js', content);
    },

    registerFile: function(url, content, code) {
      server.respondWith('GET', url, [code || 200, {'Content-Type': 'application/json'}, content]);
    },

    tag: function(template, fn) {
      testing.app.addIndex(
        '(function() {module.exports = { template: \'' + template + '\',' +
        'ready: function() { var _html = $(\'#quasar-app\').html();(' + fn.toString() + '());}};}());'
      );
      testing.app.start();
    },

    html: function() {
      return $('#quasar-app').html();
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
    css: function(type, href) {
      var cssNode = $('#__quasar_' + type + '_css');

      expect(cssNode).to.have.length(1);
      expect(cssNode.children()).to.have.length(1);
      var css = cssNode.html();

      expect(css).to.contain('<link');
      expect(css).to.contain('type="text/css"');
      expect(css).to.contain('href="' + href + '"');
      expect(css).to.contain('rel="stylesheet"');
    }
  };


  var testingNodeID = 'testing-node-id';

  window.testing.node = {
    id: testingNodeID,
    inject: function(content, attributes, callback) {
      this.remove();
      content = content || '';
      attributes = attributes || '';
      callback && quasar.nextTick(function() {
        callback();
      });
      return $('<div id="' + testingNodeID + '" ' + attributes + '>' + content + '</div>').appendTo($('body'));
    },
    remove: function() {
      $(testingNodeID).remove();
    }
  };


  window.testing.scope = {};

}());
