'use strict';

function startApp() {
  quasar.load.app.manifest(function(appManifest) {
    require('./register-pages')(appManifest);
    quasar.start.router();
  });
};

module.exports = {
  start: {
    app: startApp
  }
};
