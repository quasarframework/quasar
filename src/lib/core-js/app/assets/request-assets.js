'use strict';

function requestAsset(type, assetName, done) {
  var url;

  if (type === 'page') {
    url = 'pages/' + assetName + '/script.' + assetName;
  }
  else {
    if (!assetName) {
      quasar.nextTick(function() {
        done({});
      });
      return;
    }
    url = 'layouts/' + assetName + '/layout.' + assetName;
  }

  quasar.require.script(url)
    .done(function(asset) {
      quasar.nextTick(function() {
        done(asset);
      });
    })
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Cannot load ' + type + '.');
    });
}

module.exports.layout = function(layoutName, done) {
  requestAsset('layout', layoutName, done);
};

module.exports.page = function(pageName, done) {
  requestAsset('page', pageName, done);
};
