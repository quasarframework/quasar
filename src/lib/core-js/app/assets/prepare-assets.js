'use strict';

function parseVue(context, asset, done) {
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
}

module.exports.layout = function(context, asset, done) {
  parseVue({}, asset, done);
};
module.exports.page = parseVue;
