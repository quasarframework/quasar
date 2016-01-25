'use strict';

module.exports = function(context, asset, done) {
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
};
