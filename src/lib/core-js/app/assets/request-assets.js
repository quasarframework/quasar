'use strict';

module.exports.layout = function(layoutName, done) {
  if (!layoutName) {
    q.nextTick(function() {
      done({
        name: '__default',
        exports: {
          template: '<quasar-layout><quasar-page></quasar-page></quasar-layout>'
        }
      });
    });
    return; // <<< EARLY EXIT
  }

  q.require.script('layouts/' + layoutName + '/layout.' + layoutName)
    .done(function(layout) {
      q.nextTick(function() {
        done({
          name: layoutName,
          exports: layout
        });
      });
    })
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Cannot load layout ' + exports.config.layout + '.');
    });
};

module.exports.page = function(pageName, done) {
  q.require.script('pages/' + pageName + '/script.' + pageName)
    .done(function(page) {
      q.nextTick(function() {
        done({
          name: pageName,
          exports: page
        });
      });
    })
    .fail(/* istanbul ignore next */ function() {
      throw new Error('Cannot load layout ' + exports.config.layout + '.');
    });
};
