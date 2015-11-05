'use strict';

var
  loadRoutes = require('./load/routes')
  ;

function startApp() {
  quasar.make.a.get.request({url: 'app.json', local: true})
    .done(function(appManifest) {
      loadRoutes(appManifest);
      quasar.start.router();
    });
};

module.exports = {
  start: {
    app: startApp
  }
};
