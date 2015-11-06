'use strict';

function getRoute(pageName, pageManifest) {
  var route = {path: '#/' + (pageName != 'index' ? pageName : '')};

  route.before = function() {
    var self = this;

    $('#quasar-view').html('Loading page...');
    console.log('[page:require]', pageName);

    quasar.require.script('pages/' + pageName + '/js/script.' + pageName)
      .fail(function(err) {
        //TODO: report error
      }).done(function(exports) {
        console.log('[page:process]', pageName);
        exports.config = exports.config || {};
        self.next(exports);
      });
  };

  route.on = function(exports) {
    var response, self = this;

    quasar.clear.page.css();

    if (exports.config.css) {
      quasar.inject.page.css(exports.config.css);
    }

    if (exports.prepare) {
      exports.prepare(
        {
          params: self.params,
          query: self.query
        },
        function(data) {
          self.next([exports, data]);
        }
      );
    }
    else {
      this.next([exports]);
    }
  };

  route.after = function(args) {
    var
      self = this,
      exports = args[0],
      data = args[1]
      ;

    $('#quasar-view').html(exports.config.html || '');

    if (exports.render) {
      exports.render(
        pageManifest,
        {
          params: self.params,
          query: self.query
        },
        data
      );
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
