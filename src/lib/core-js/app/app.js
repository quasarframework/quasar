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
    q.global.events.trigger('app:page:render', context);
    render.page(context, pageVue, function() {
      q.global.events.trigger('app:page:post-render app:page:ready', context);
    });
    return;
  }

  if (!layoutVue || !pageVue) {
    // not ready yet...
    return;
  }

  q.global.events.trigger('app:layout:post-prepare app:layout:render app:page:post-prepare', context);
  render.layout(layoutVue, function() {
    q.global.events.trigger('app:layout:post-render app:layout:ready app:page:render', context);
    render.page(context, pageVue, function() {
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
    prepare.layout(context, layout, function(vue) {
      layoutVue = vue;
      q.layout.name = layout.name;
      renderVue(context, pageVue, layoutVue);
    });
    q.global.events.trigger('app:page:post-require app:page:prepare', context);
    prepare.page(context, page, function(vue) {
      pageVue = vue;
      q.page.name = page.name;
      renderVue(context, pageVue, layoutVue);
    });
    return;
  }

  q.global.events.trigger('app:page:post-require app:page:prepare', context);
  prepare.page(context, page, function(vue) {
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
      q.add.route({
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
  q.make.a.get.request({url: 'app.json', local: true})
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Could not load App Manifest.');
    })
    .done(function(appManifest) {
      q.global.manifest = appManifest;
      registerRoutes(appManifest);
      q.start.router();
    });
}

_.merge(q, {
  start: {
    app: startApp
  }
});
