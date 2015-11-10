'use strict';

function getRoute(pageName, pageManifest) {
  var
    scope,
    route = {path: '#/' + (pageName != 'index' ? pageName : '')}
    ;

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
      exports.prepare.call({
        params: self.params,
        query: self.query,
        name: pageName,
        done: function(data) {
          if (exports.scope) {
            scope = exports.scope.call({
              params: self.params,
              query: self.query,
              name: pageName,
              data: data
            });
          }
          self.next([exports, data, scope]);
        }
      });
    }
    else {
      if (exports.scope) {
        scope = exports.scope.call({
          params: self.params,
          query: self.query,
          name: pageName,
          data: {}
        });
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
      exports.render.call({
        params: self.params,
        query: self.query,
        name: pageName,
        data: data,
        scope: scope,
        vm: new Vue({
          el: '#quasar-view',
          data: scope
        }),
        manifest: pageManifest
      });
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
