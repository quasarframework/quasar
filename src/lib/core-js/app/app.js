'use strict';

require('../router/router');
require('../debug/debug');
require('./js/initialize');

var
  request = require('./js/request-assets'),
  prepare = require('./js/prepare-assets'),
  render = require('./js/render-assets')
  ;

function renderVue(pageVue, layoutVue, done) {
  if (layoutVue === false) {
    render.page(pageVue);
    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  render.layout(layoutVue, function() {
    render.page(pageVue);
  });
}

function prepareRoute(route, manifest, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  var layoutVue, pageVue;

  if (!quasar.global.layout.name || quasar.global.layout.name !== layout.name) {
    prepare.layout(route, layout, function(vue) {
      layoutVue = vue;
      renderVue(layoutVue, pageVue);
      quasar.global.layout.name = layout.name;
    });
    prepare.page(route, manifest, page, function(vue) {
      quasar.clear.page.css();

      if (manifest.css) {
        quasar.inject.page.css(manifest.css);
      }

      pageVue = vue;
      renderVue(pageVue, layoutVue);
      quasar.global.page.name = page.name;
    });
    return;
  }

  prepare.page(route, manifest, page, function(vue) {
    renderVue(vue, false);
  });
}

function startRoute(route, manifest, pageName) {
  var layout, page;

  request.layout(manifest.layout, function(asset) {
    layout = asset;
    prepareRoute(route, manifest, layout, page);
  });
  request.page(pageName, function(asset) {
    page = asset;
    prepareRoute(route, manifest, layout, page);
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
    var onRoute = function() {
      startRoute(this, pageManifest, pageName);
    };

    _.forEach(getHashes(pageManifest.hashes), function(hash) {
      quasar.add.route({
        path: getPath(pageName, hash),
        on: onRoute
      });
    });
  });
}

function startApp() {
  quasar.make.a.get.request({url: 'app.json', local: true})
    .fail(function() {
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
