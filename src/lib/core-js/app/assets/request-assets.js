'use strict';

function requestAsset(type, assetName, done) {
  var url;

  if (type === 'page') {
    url = 'pages/' + assetName + '/script.' + assetName;
  }
  else {
    url = 'layouts/' + assetName + '/layout.' + assetName;
  }

  quasar.require.script(url)
    .done(function(asset) {
      quasar.nextTick(function() {
        done({
          name: assetName,
          exports: asset
        });
      });
    })
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Cannot load ' + type + '.');
    });
}

module.exports.layout = function(layoutName, done) {
  if (!layoutName) {
    quasar.nextTick(function() {
      done({
        name: '__default',
        exports: {
          template: '<quasar-layout><quasar-page></quasar-page></quasar-layout>'
        }
      });
    });
    return; // <<< EARLY EXIT
  }

  requestAsset('layout', layoutName, done);
};

module.exports.page = function(pageName, done) {
  requestAsset('page', pageName, done);
};
