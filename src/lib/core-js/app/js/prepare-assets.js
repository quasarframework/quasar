'use strict';

function parseVue(route, asset, done, manifest) {
  if (_.isFunction(asset.exports)) {
    asset.exports.call(
      {
        params: route.params,
        query: route.query,
        name: asset.name,
        route: route.hash,
        manifest: manifest
      },
      function(vue) {
        done(vue);
      }
    );
    return; // <<< EARLY EXIT
  }

  quasar.nextTick(function() {
    done(asset.exports);
  });
}

module.exports.layout = function(route, asset, done) {
  parseVue(route, asset, done);
};

module.exports.page = function(route, manifest, asset, done) {
  parseVue(route, asset, done, manifest);
};
