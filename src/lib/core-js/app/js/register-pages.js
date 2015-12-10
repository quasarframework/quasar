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

function injectVueReadyMethod(vue, readyFunction) {
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

function startLayout(layout, context, vm) {
  quasar.global.events.trigger('app:layout:post-vue app:layout:start', context);
  if (layout.start) {
    layout.start.call({vm: vm, $data: vm.$data});
  }
  quasar.global.events.trigger('app:layout:post-start app:layout:ready', context);
}

function injectLayout(layout, layoutName) {
  var
    rootElement = '#quasar-view',
    context = {
      name: layoutName,
      layout: layout
    };

  /* istanbul ignore next */
  if (!layout.html) {
    throw new Error('Layout HTML cannot be empty. Otherwise it\'s useless.');
  }

  quasar.global.events.trigger('app:layout:post-require app:layout:html', context);

  $(rootElement).html(layout.html);
  currentLayoutName = layoutName;

  quasar.global.events.trigger('app:layout:post-html app:layout:vue', context);

  /* istanbul ignore next */
  if (
    layout.html.indexOf('<quasar-content>') === -1 ||
    layout.html.indexOf('</quasar-content>') === -1
  ) {
    return; // <<< EARLY-EXIT
  }

  quasar.global.layout = new Vue(injectVueReadyMethod(
    _.merge({}, layout.vue || {}, {el: rootElement}),
    function() {
      startLayout(layout, context, this);
    }
  ));
}

function loadLayout(exports, done) {
  if (!exports.config.layout) {
    // reset global layout object
    quasar.global.layout = null;
    currentLayoutName = null;
    done();
    return; // <<< EARLY EXIT
  }

  if (currentLayoutName === exports.config.layout) {
    done();
    return; // <<< EARLY EXIT
  }

  quasar.global.events.trigger('app:layout:require', {
    name: exports.config.layout
  });

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

function getUserVueParams(exports, self) {
  if (!exports.vue) {
    return {}; // <<< EARLY EXIT
  }

  if (_.isFunction(exports.vue)) {
    return exports.vue.call(self); // <<< EARLY EXIT
  }

  return exports.vue;
}

function getPageMethodContext(self, routeConfig, properties) {
  return _.merge(
    {},
    {
      params: self.params,
      query: self.query,
      name: routeConfig.pageName,
      manifest: routeConfig.pageManifest,
      route: routeConfig.hash
    },
    properties
  );
}

function getRouteBefore(routeConfig) {
  return function() {
    var
      self = this,
      context = getPageMethodContext(self, routeConfig)
      ;

    $(currentLayoutName ? '.quasar-content' : '#quasar-view').html('Loading page...');
    quasar.global.events.trigger('app:page:require', context);

    quasar.require.script('pages/' + routeConfig.pageName + '/js/script.' + routeConfig.pageName)
      .fail(
        /* istanbul ignore next */
        function() {
          throw new Error('[page:require] Cannot load script file.');
        }
      ).done(function(exports) {
        exports.config = exports.config || {};

        quasar.global.events.trigger('app:page:post-require app:page:dispose', context);
        if (quasar.global.page && quasar.global.page.dispose) {
          quasar.global.page.dispose();
        }

        quasar.global.events.trigger('app:page:post-dispose', context);
        loadLayout(exports, function() {
          self.next(exports);
        });
      });
  };
}

function getRouteOn(routeConfig) {
  return function(exports) {
    var self = this;

    quasar.clear.page.css();

    if (exports.config.css) {
      quasar.inject.page.css(exports.config.css);
    }

    quasar.global.events.trigger('app:page:prepare', getPageMethodContext(self, routeConfig));

    if (!exports.prepare) {
      this.next(exports);
      return; // <<< EARLY EXIT
    }

    exports.prepare.call(getPageMethodContext(self, routeConfig, {
      done: function(prepared) {
        self.next(exports, prepared);
      }
    }));
  };
}

function getRouteAfter(routeConfig) {
  return function(exports, prepared) {
    var
      self = this,
      rootElement = exports.config.layout ? '.quasar-content' : '#quasar-view',
      $rootElement = $(rootElement),
      context = getPageMethodContext(self, routeConfig, {prepared: prepared})
      ;

    /* istanbul ignore next */
    if ($rootElement.length === 0) {
      throw new Error(
        exports.config.layout ?
        'Layout HTML must include a <quasar-content>...</quasar-content> tag.' :
        '#quasar-view NOT found'
      );
    }

    quasar.global.events.trigger('app:page:post-prepare app:page:vue', context);

    $rootElement.html(exports.config.html || '');

    var vm = new Vue(injectVueReadyMethod(
      _.merge({}, getUserVueParams(exports, context), {el: rootElement}),
      function() {
        var vm = this;

        var context = getPageMethodContext(self, routeConfig, {
          prepared: prepared,
          vm: vm,
          $data: vm.$data,
          $el: $rootElement
        });

        quasar.global.events.trigger('app:page:post-vue app:page:start', context);
        quasar.global.page = {
          vm: vm,
          $data: vm.$data,
          $el: $rootElement,
          dispose: exports.dispose
        };

        if (exports.start) {
          exports.start.call(context);
        }

        quasar.global.events.trigger('app:page:post-start app:page:ready', context);
      }
    ));
  };
}

function getHashes(pageHashes) {
  return !pageHashes ? ['$'] : pageHashes;
}

function registerRoutes(appManifest) {
  var routeConfig;

  _.forEach(appManifest.pages, function(pageManifest, pageName) {
    _.forEach(getHashes(pageManifest.hashes), function(hash) {
      routeConfig = {
        pageName: pageName,
        hash: hash,
        pageManifest: pageManifest
      };
      quasar.add.route({
        path: getPath(pageName, hash),
        before: getRouteBefore(routeConfig),
        on: getRouteOn(routeConfig),
        after: getRouteAfter(routeConfig)
      });
    });
  });
}


module.exports = registerRoutes;
