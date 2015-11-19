'use strict';

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

    $('#quasar-view').html('Loading page...');
    quasar.global.events.trigger('app:page:requiring', extend(self));

    quasar.require.script('pages/' + pageName + '/js/script.' + pageName)
      .fail(
      /* istanbul ignore next */
      function() {
        throw new Error('[page:require] Cannot load script file.');
      }).done(function(exports) {
        exports.config = exports.config || {};
        self.next(exports);
      });
  };

  route.on = function(exports) {
    quasar.clear.page.css();

    if (exports.config.css) {
      quasar.inject.page.css(exports.config.css);
    }

    var
      scope = {},
      extender,
      self = this
      ;

    quasar.global.events.trigger('app:page:preparing', extend(self));

    if (exports.prepare) {
      exports.prepare.call(extend(self, {
        done: function(data) {
          extender = extend(self, {data: data});

          quasar.global.events.trigger('app:page:scoping', extender);
          if (exports.scope) {
            scope = exports.scope.call(extender);
          }
          self.next([exports, data, scope]);
        }
      }));
    }
    else {
      extender = extend(self, {data: {}});

      quasar.global.events.trigger('app:page:scoping', extender);
      if (exports.scope) {
        scope = exports.scope.call(extender);
      }
      this.next([exports, {}, scope]);
    }
  };

  route.after = function(args) {
    var
      self = this,
      exports = args[0],
      data = args[1] || {},
      scope = args[2]
      ;

    var extender = extend(self, {
      data: data,
      scope: scope,
      vm: new Vue({
        el: '#quasar-view',
        data: scope
      })
    });

    $('#quasar-view').html(exports.config.html || '');
    quasar.global.events.trigger('app:page:starting', extender);

    if (exports.start) {
      exports.start.call(extender);
    }

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
