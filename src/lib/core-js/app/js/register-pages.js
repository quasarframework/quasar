'use strict';

require('../../router/router');
require('../../events/events');

var currentLayoutName;

function getPath(pageName, hash) {
  if (hash !== '$') {
    return '#/' + pageName + '/' + hash;
  }

  return '#/' + (pageName !== 'index' ? pageName : '');
}

function injectReady(vue, readyFunction) {
  if (!vue.ready) {
    vue.ready = readyFunction;
    return vue; // <<< EARLY EXIT
  }

  var originalReadyFunction = vue.ready;

  vue.ready = function() {
    originalReadyFunction.call(this);
    readyFunction.call(this);
  };

  return vue;
}

function injectLayout(layout, layoutName) {
  var rootElement = '#quasar-view';

  /* istanbul ignore next */
  if (!layout.html) {
    throw new Error('Layout HTML cannot be empty. Otherwise layout is useless.');
  }

  $(rootElement).html(layout.html);

  quasar.global.layout = new Vue(injectReady(
    _.merge({}, layout.vue || {}, {el: rootElement}),
    function() {
      var vm = this;

      currentLayoutName = layoutName;

      if (layout.start) {
        layout.start.call({
          vm: vm,
          scope: vm.$data
        });
      }
    }
  ));
}

function loadLayout(exports, done) {
  if (!exports.config.layout) {
    // reset global layout object
    quasar.global.layout = {};
    currentLayoutName = null;
    done();
    return; // <<< EARLY EXIT
  }

  if (currentLayoutName === exports.config.layout) {
    done();
    return; // <<< EARLY EXIT
  }

  quasar.require.script('layouts/layout.' + exports.config.layout)
    .done(function(layout) {
      injectLayout(layout, exports.config.layout);
      done();
    })
    .fail(
      /* istanbul ignore next */
      function() {
        throw new Error('Cannot load layout ' + exports.config.layout + '.');
      }
    );
}

function getRoute(pageName, hash, pageManifest) {
  var route = {path: getPath(pageName, hash)};

  function extend(self, properties) {
    return _.merge(
      {},
      {
        params: self.params,
        query: self.query,
        name: pageName,
        manifest: pageManifest,
        route: hash
      },
      properties
    );
  }

  route.before = function() {
    var self = this;

    $(currentLayoutName ? '.quasar-content' : '#quasar-view').html('Loading page...');
    quasar.global.events.trigger('app:page:requiring', extend(self));

    quasar.require.script('pages/' + pageName + '/js/script.' + pageName)
      .fail(
        /* istanbul ignore next */
        function() {
          throw new Error('[page:require] Cannot load script file.');
        }
      ).done(function(exports) {
        exports.config = exports.config || {};

        quasar.global.events.trigger('app:page:layouting', extend(self));
        loadLayout(exports, function() {
          self.next(exports);
        });
      });
  };

  route.on = function(exports) {
    quasar.clear.page.css();

    if (exports.config.css) {
      quasar.inject.page.css(exports.config.css);
    }

    var
      vue = {},
      extender,
      self = this
      ;

    quasar.global.events.trigger('app:page:preparing', extend(self));

    if (exports.prepare) {
      exports.prepare.call(extend(self, {
        done: function(data) {
          extender = extend(self, {data: data});

          quasar.global.events.trigger('app:page:vueing', extender);
          if (exports.vue) {
            vue = exports.vue.call(extender);
          }
          self.next([exports, data, vue]);
        }
      }));
    }
    else {
      extender = extend(self, {data: {}});

      quasar.global.events.trigger('app:page:vueing', extender);
      if (exports.vue) {
        vue = exports.vue.call(extender);
      }
      this.next([exports, {}, vue]);
    }
  };

  route.after = function(args) {
    var
      self = this,
      exports = args[0],
      data = args[1] || {},
      vue = args[2],
      rootElement = exports.config.layout ? '.quasar-content' : '#quasar-view'
      ;

    $(rootElement).html(exports.config.html || '');

    var vm = new Vue(injectReady(
      _.merge({}, vue, {el: rootElement}),
      function() {
        var vm = this;

        var extender = extend(self, {
          data: data,
          vm: vm
        });

        extender.scope = vm.$data;
        quasar.global.events.trigger('app:page:starting', extender);

        if (exports.start) {
          exports.start.call(extender);
        }

        quasar.global.events.trigger('app:page:ready', extender);
      }
    ));
  };

  return route;
}

function getHashes(pageHashes) {
  return !pageHashes ? ['$'] : pageHashes;
}

function registerRoutes(appManifest) {
  _.forEach(appManifest.pages, function(pageManifest, pageName) {
    _.forEach(getHashes(pageManifest.hashes), function(hash) {
      quasar.add.route(getRoute(pageName, hash, pageManifest));
    });
  });
}


module.exports = registerRoutes;
