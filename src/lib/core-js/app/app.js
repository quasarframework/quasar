'use strict';

require('../events/events');
require('../router/router');
require('../debug/debug');
require('./assets/initialize');

var
  request = require('./assets/request-assets'),
  prepare = require('./assets/prepare-assets'),
  validate = require('./assets/validate-assets'),
  render = require('./assets/render-assets'),
  injectCSS = require('./assets/inject-css')
  ;

function renderVue(context, pageVue, layoutVue, done) {
  injectCSS('page', context.manifest);

  // if layout hasn't changed...
  if (layoutVue === false) {
    q.global.events.trigger('app:page:post-prepare app:page:render', context);
    render('page', pageVue, function() {
      q.global.events.trigger('app:page:post-render app:page:ready', context);
    });

    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  injectCSS('layout', q.global.manifest.layouts[context.manifest.layout]);
  q.global.events.trigger('app:layout:post-prepare app:layout:render app:page:post-prepare', context);
  render('layout', layoutVue, function() {
    q.global.events.trigger('app:layout:post-render app:layout:ready app:page:render', context);
    render('page', pageVue, function() {
      q.global.events.trigger('app:page:post-render app:page:ready', context);
    });
  });
}

function prepareRoute(context, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  var layoutVue, pageVue;

  if (!q.layout.name || q.layout.name !== layout.name) {
    q.global.events.trigger('app:layout:post-require app:layout:prepare', context);
    prepare(q.global.manifest.layouts[context.manifest.layout], layout, function(vue) {
      validate.layout(vue);
      layoutVue = vue;
      q.layout.name = layout.name;
      renderVue(context, pageVue, layoutVue);
    });
    q.global.events.trigger('app:page:post-require app:page:prepare', context);
    prepare(context, page, function(vue) {
      pageVue = vue;
      q.page.name = page.name;
      renderVue(context, pageVue, layoutVue);
    });
    return;
  }

  q.global.events.trigger('app:page:post-require app:page:prepare', context);
  prepare(context, page, function(vue) {
    renderVue(context, vue, false);
  });
}

function startRoute(manifest, pageName, context) {
  var layout, page;

  q.global.events.trigger('app:layout:require', context);
  request.layout(manifest.layout, function(asset) {
    layout = asset;
    prepareRoute(context, layout, page);
  });

  q.global.events.trigger('app:page:require', context);
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
    _.forEach(parseHashes(pageManifest.hashes), function(hash) {
      q.add.route({
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
  registerRoutes(quasar.global.manifest);
  q.start.router();
}

/* istanbul ignore next */
function bootApp(callback) {
  callback = callback || $.noop;

  if (q.runs.on.cordova) {
    $.getScript('cordova.js', function() {
      document.addEventListener('deviceready', callback, false);
    });
    return; // <<< EARLY EXIT
  }

  callback();
}

_.merge(q, {
  start: {
    app: startApp
  },
  boot: bootApp
});
