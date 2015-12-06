'use strict';

require('../../router/router');
require('../../events/events');

var currentLayoutName, newLayout;

function getPath(pageName, hash) {
  if (hash !== '$') {
    return '#/' + pageName + '/' + hash;
  }

  return '#/' + (pageName !== 'index' ? pageName : '');
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
      }).done(function(exports) {
        exports.config = exports.config || {};

        quasar.global.events.trigger('app:page:layouting', extend(self));

        if (exports.config.layout && currentLayoutName !== exports.config.layout) {
          quasar.require.script('layouts/layout-' + exports.config.layout)
            .done(function(layout) {
              newLayout = layout;
              self.next(exports);
            });
          return;
        }

        quasar.global.layout = {};
        self.next(exports);
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

      quasar.global.events.trigger('app:page:scoping', extender);
      if (exports.vue) {
        vue = exports.vue.call(extender);
      }
      this.next([exports, {}, vue]);
    }
  };

  route.after = function(args) {
    var
      rootElement = '#quasar-view',
      self = this,
      exports = args[0],
      data = args[1] || {},
      vue = args[2],
      layoutName = exports.config.layout
      ;

    if (layoutName) {
      if (layoutName !== currentLayoutName) {
        $(rootElement).html(newLayout.template);
        quasar.global.layout = new Vue(_.merge({}, newLayout.vue, {el: rootElement}));

        if (newLayout.start) {
          newLayout.start.call({
            vm: quasar.global.layout
          });
        }
      }
      rootElement = '.quasar-content';
    }

    $(rootElement).html(exports.config.html || '');

    var vm = new Vue(_.merge({}, vue, {el: rootElement}));

    var extender = extend(self, {
      data: data,
      vm: vm
    });

    extender.scope = vm.$data;
    quasar.global.events.trigger('app:page:starting', extender);

    if (exports.start) {
      exports.start.call(extender);
    }

    currentLayoutName = exports.config.layout;
    quasar.global.events.trigger('app:page:ready', extender);
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
