'use strict';

module.exports = function(context, asset, done) {
  if (_.isFunction(asset.exports)) {
    asset.exports.call(
      context,
      function(vue) {
        q.nextTick(function() {
          done(vue);
        });
      }
    );
    return; // <<< EARLY EXIT
  }

  q.nextTick(function() {
    done(asset.exports);
  });
};
