'use strict';

/* istanbul ignore next */
module.exports = function(url) {
  if (q.runs.on.cordova) {
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
      // TODO alert
      //m.alert("Please allow popups first, then please try again.");
    }
  }
};
