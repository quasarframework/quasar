'use strict';

require('../events/events');
require('../router/router');
require('../debug/debug');
require('./assets/initialize');

var
  request = require('./assets/request-assets'),
  prepare = require('./assets/prepare-assets'),
  render = require('./assets/render-assets'),
  injectCSS = require('./assets/inject-css')
  ;

function renderVue(context, pageVue, layoutVue) {
  injectCSS('page', context.manifest);

  // if layout hasn't changed...
  if (layoutVue === false) {
    quasar.events.trigger('app:page:post-prepare app:page:render', context);
    render('page', pageVue, function() {
      quasar.events.trigger('app:page:post-render app:page:ready', context);
    });

    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  injectCSS('layout', quasar.data.manifest.layouts[context.manifest.layout]);
  quasar.events.trigger('app:layout:post-prepare app:layout:render app:page:post-prepare', context);
  render('layout', layoutVue, function() {
    quasar.events.trigger('app:layout:post-render app:layout:ready app:page:render', context);
    render('page', pageVue, function() {
      quasar.events.trigger('app:page:post-render app:page:ready', context);
    });
  });
}

function prepareRoute(context, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  var layoutVue, pageVue;

  if (!quasar.layout.name || quasar.layout.name !== context.manifest.layout) {
    quasar.events.trigger('app:layout:post-require app:layout:prepare', context);
    prepare(quasar.data.manifest.layouts[context.manifest.layout], layout, function(vue) {
      layoutVue = vue;
      quasar.layout.name = context.manifest.layout;
      renderVue(context, pageVue, layoutVue);
    });
    quasar.events.trigger('app:page:post-require app:page:prepare', context);
    prepare(context, page, function(vue) {
      pageVue = vue;

      quasar.page.name = page.name;
      quasar.page.manifest = context.manifest;

      renderVue(context, pageVue, layoutVue);
    });
    return;
  }

  quasar.events.trigger('app:page:post-require app:page:prepare', context);
  prepare(context, page, function(vue) {
    renderVue(context, vue, false);
  });
}

function startRoute(manifest, pageName, context) {
  var layout, page;

  quasar.events.trigger('app:layout:require', context);
  request.layout(manifest.layout, function(asset) {
    layout = asset;
    prepareRoute(context, layout, page);
  });

  quasar.events.trigger('app:page:require', context);
  request.page(pageName, function(asset) {
    page = asset;
    prepareRoute(context, layout, page);
  });
}

function parseHashes(pageHashes) {
  return !pageHashes ? ['$'] : pageHashes;
}

function getHash(pageName, hash) {
  if (hash !== '$') {
    return '#/' + pageName + '/' + hash;
  }

  return '#/' + (pageName !== 'index' ? pageName : '');
}

function registerRoutes(appManifest) {
  _.forEach(appManifest.pages, function(pageManifest, pageName) {
    pageManifest.name = pageName;
    _.forEach(parseHashes(pageManifest.hashes), function(hash) {
      quasar.add.route({
        hash: getHash(pageName, hash),
        trigger: function() {
          var route = this;

          startRoute(pageManifest, pageName, {
            params: route.params,
            query: route.query,
            name: pageName,
            route: hash,
            manifest: pageManifest
          });
        }
      });
    });
  });
}

function startApp() {
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

_.merge(quasar, {
  start: {
    app: startApp
  },
  boot: bootApp
});
