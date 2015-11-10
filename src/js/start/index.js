'use strict';

function startApp() {
  $(function() {
    /*eslint-disable no-undef */
    FastClick.attach(document.body);
    /*eslint-enable no-undef */
  });

  quasar.load.app.manifest(function(err, appManifest) {
    if (err) {
      throw new Error('Could not load App manifest.');
    }
    require('./register-pages')(appManifest);
    quasar.start.router();
  });
}

module.exports = {
  start: {
    app: startApp
  }
};
