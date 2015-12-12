'use strict';

function parseVue(context, asset, done) {
  if (_.isFunction(asset.exports)) {
    asset.exports.call(
      context,
      function(vue) {
        quasar.nextTick(function() {
          done(vue);
        });
      }
    );
    return; // <<< EARLY EXIT
  }

  quasar.nextTick(function() {
    done(asset.exports);
  });
}

module.exports.layout = function(context, asset, done) {
  parseVue({}, asset, done);
};
module.exports.page = parseVue;
