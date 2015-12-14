'use strict';

require('../events/events');
require('../router/router');
require('../debug/debug');
require('./assets/initialize');

var
  request = require('./assets/request-assets'),
  prepare = require('./assets/prepare-assets'),
  render = require('./assets/render-assets')
  ;

function renderVue(context, pageVue, layoutVue, done) {
  if (layoutVue === false) {
    // layout hasn't changed...
    quasar.global.events.trigger('app:page:render', context);
    render.page(context, pageVue, function() {
      quasar.global.events.trigger('app:page:post-render app:page:ready', context);
    });
    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  quasar.global.events.trigger('app:layout:post-prepare app:layout:render app:page:post-prepare', context);
  render.layout(layoutVue, function() {
    quasar.global.events.trigger('app:layout:post-render app:layout:ready app:page:render', context);
    render.page(context, pageVue, function() {
      quasar.global.events.trigger('app:page:post-render app:page:ready', context);
    });
  });
}

function prepareRoute(context, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  var layoutVue, pageVue;

  if (!quasar.layout.name || quasar.layout.name !== layout.name) {
    quasar.global.events.trigger('app:layout:post-require app:layout:prepare', context);
    prepare.layout(context, layout, function(vue) {
      layoutVue = vue;
      quasar.layout.name = layout.name;
      renderVue(context, pageVue, layoutVue);
    });
    quasar.global.events.trigger('app:page:post-require app:page:prepare', context);
    prepare.page(context, page, function(vue) {
      pageVue = vue;
      quasar.page.name = page.name;
      renderVue(context, pageVue, layoutVue);
    });
    return;
  }

  quasar.global.events.trigger('app:page:post-require app:page:prepare', context);
  prepare.page(context, page, function(vue) {
    renderVue(context, vue, false);
  });
}

function startRoute(manifest, pageName, context) {
  var layout, page;

  quasar.global.events.trigger('app:layout:require', context);
  request.layout(manifest.layout, function(asset) {
    layout = asset;
    prepareRoute(context, layout, page);
  });

  quasar.global.events.trigger('app:page:require', context);
  request.page(pageName, function(asset) {
    page = asset;
    prepareRoute(context, layout, page);
  });
}

function getHashes(pageHashes) {
  return !pageHashes ? ['$'] : pageHashes;
}

function getPath(pageName, hash) {
  if (hash !== '$') {
    return '#/' + pageName + '/' + hash;
  }

  return '#/' + (pageName !== 'index' ? pageName : '');
}

function registerRoutes(appManifest) {
  _.forEach(appManifest.pages, function(pageManifest, pageName) {
    _.forEach(getHashes(pageManifest.hashes), function(hash) {
      quasar.add.route({
        path: getPath(pageName, hash),
        on: function() {
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
  quasar.make.a.get.request({url: 'app.json', local: true})
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Could not load App Manifest.');
    })
    .done(function(appManifest) {
      quasar.global.manifest = appManifest;
      registerRoutes(appManifest);
      quasar.start.router();
    });
}

_.merge(q, {
  start: {
    app: startApp
  }
});
