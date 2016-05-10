'use strict';

/* istanbul ignore next */
module.exports = function(url) {
  if (quasar.runs.on.cordova) {
    navigator.app.loadUrl(url, {
      openExternal: true
    });
  }
  else {
    var win = window.open(url, '_blank');

    if (win) {
      win.focus();
    }
    else {
      quasar.dialog({
        title: 'Cannot Open Window',
        message: 'Please allow popups first, then please try again.'
      });
    }
  }
};
