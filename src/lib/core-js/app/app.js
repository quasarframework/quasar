'use strict';

require('../events/events');
require('../router/router');
require('../debug/debug');
require('./js/initialize');

var
  request = require('./js/request-assets'),
  prepare = require('./js/prepare-assets'),
  render = require('./js/render-assets')
  ;

function renderVue(context, pageVue, layoutVue, done) {
  if (layoutVue === false) {
    quasar.global.events.trigger('app:page:render', context);
    render.page(pageVue, function() {
      quasar.global.events.trigger('app:page:post-render app:page:ready', context);
    });
    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  quasar.global.events.trigger('app:layout:post-prepare app:layout:render app:page:post-prepare', context);
  console.log('ZZ here', $('#quasar-app').html());
  render.layout(layoutVue, function() {
    console.log('X here', $('#quasar-app').html());
    quasar.global.events.trigger('app:layout:post-render app:layout:ready app:page:render', context);
    render.page(pageVue, function() {
      console.log('X here 2');
      quasar.global.events.trigger('app:page:post-render app:page:ready', context);
    });
  });
}

function prepareRoute(context, layout, page) {
  if (!layout || !page) {
    // not ready yet...
    return;
  }

  quasar.clear.page.css();

  if (context.manifest.css) {
    quasar.inject.page.css(context.manifest.css);
  }

  var layoutVue, pageVue;

  console.log('prepare');
  if (!quasar.global.layout.name || quasar.global.layout.name !== layout.name) {
    quasar.global.events.trigger('app:layout:post-require app:layout:prepare', context);
    prepare.layout(context, layout, function(vue) {
      layoutVue = vue;
      renderVue(context, layoutVue, pageVue);
      quasar.global.layout.name = layout.name;
    });
    quasar.global.events.trigger('app:page:post-require app:page:prepare', context);
    prepare.page(context, page, function(vue) {
      pageVue = vue;
      renderVue(context, pageVue, layoutVue);
      quasar.global.page.name = page.name;
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
