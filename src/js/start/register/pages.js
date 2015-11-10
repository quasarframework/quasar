'use strict';

function getRoute(pageName, pageManifest) {
  var
    scope,
    route = {path: '#/' + (pageName != 'index' ? pageName : '')}
    ;

  function extend(self, properties) {
    return _.merge(
      {},
      {
        params: self.params,
        query: self.query,
        name: pageName,
        manifest: pageManifest,
      },
      properties
    );
  }

  route.before = function() {
    var self = this;

    $('#quasar-view').html('Loading page...');
    console.log('[page:require]', pageName);

    quasar.require.script('pages/' + pageName + '/js/script.' + pageName)
      .fail(
        /* istanbul ignore next */
      function(err) {
        throw new Error('[page:require] Cannot load script file.');
      }).done(function(exports) {
        console.log('[page:process]', pageName);
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
      self = this
      ;

    if (exports.prepare) {
      exports.prepare.call(extend(self, {
        done: function(data) {
          if (exports.scope) {
            scope = exports.scope.call(extend(self, {data: data}));
          }
          self.next([exports, data, scope]);
        }
      }));
    }
    else {
      if (exports.scope) {
        scope = exports.scope.call(extend(self, {data: {}}));
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

    $('#quasar-view').html(exports.config.html || '');

    if (exports.render) {
      exports.render.call(extend(self, {
        data: data,
        scope: scope,
        vm: new Vue({
          el: '#quasar-view',
          data: scope
        })
      }));
    }

    console.log('[page:ready]', pageName);
  };

  return route;
}

function registerRoutes(appManifest) {
  _.forEach(appManifest.pages, function(pageManifest, name) {
    quasar.add.route(getRoute(name, pageManifest));
  });
}


module.exports = registerRoutes;
