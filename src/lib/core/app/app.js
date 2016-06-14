'use strict';

var
  request = require('./assets/request-assets'),
  prepare = require('./assets/prepare-assets'),
  render = require('./assets/render-assets')
  ;

function injectCSS(manifest) {
  if (manifest && manifest.css) {
    quasar.inject.css(manifest.css);
  }
}

function preparePage(context, page) {
  quasar.events.trigger('app:page:prepare', context);
  prepare(context, page, function(pageVue) {
    quasar.events.trigger('app:page:render', context);
    render.page(pageVue, context, function() {
      quasar.events.trigger('app:page:ready', context);
    });
  });
}

function loadRoute(context, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  injectCSS(context.manifest);

  if (
    !quasar.current.layout ||
    !quasar.current.layout.name ||
    quasar.current.layout.name !== context.manifest.layout
  ) {
    injectCSS(quasar.data.manifest.layouts[context.manifest.layout]);
    quasar.events.trigger('app:layout:prepare', context);
    prepare(quasar.data.manifest.layouts[context.manifest.layout], layout, function(layoutVue) {
      quasar.events.trigger('app:layout:render', context);
      render.layout(layoutVue, context, function() {
        quasar.events.trigger('app:layout:ready', context);
        preparePage(context, page);
      });
    });

    return;
  }

  preparePage(context, page);
}

function prepareAssets(manifest, context) {
  var layout, page;

  quasar.events.trigger('app:layout:require', context);
  request.layout(manifest.layout, function(asset) {
    layout = asset;
    loadRoute(context, layout, page);
  });

  quasar.events.trigger('app:page:require', context);
  request.page(context.name, function(asset) {
    page = asset;
    loadRoute(context, layout, page);
  });
}

function validateRoutes(appManifest) {
  if (!appManifest.pages.index) {
    throw new Error('Missing "index" Page.');
  }
  if (appManifest.pages.index.routes) {
    delete appManifest.pages.index.routes;
    console.warn('Routes are disabled for "index" Page.');
  }
}

function registerRoutes(appManifest) {
  Object.keys(appManifest.pages).forEach(function(pageName) {
    var
      pageManifest = appManifest.pages[pageName],
      hash = '#/' + (pageName !== 'index' ? pageName : '')
      ;

    pageManifest.name = pageName;

    (pageManifest.routes || ['$']).forEach(function(route) {
      quasar.add.route({
        hash: hash + (route === '$' ? '' : '/' + route),
        trigger: function() {
          var self = this;

          prepareAssets(pageManifest, {
            params: self.params,
            query: self.query,
            name: pageName,
            route: route,
            hash: self.hash,
            parameterized: Object.keys(self.params).length > 0 || Object.keys(self.query).length > 0,
            manifest: pageManifest
          });
        }
      });
    });
  });
}

function startApp() {
  validateRoutes(quasar.data.manifest);
  registerRoutes(quasar.data.manifest);

  quasar.start.router();
}

/* istanbul ignore next */
function bootApp(callback) {
  callback = callback || $.noop;

  if (quasar.runs.on.cordova) {
    $.getScript('cordova.js', function() {
      document.addEventListener('deviceready', callback, false);
    });
    return; // <<< EARLY EXIT
  }

  callback();
}

$.extend(true, quasar, {
  start: {
    app: startApp
  },
  boot: bootApp
});
