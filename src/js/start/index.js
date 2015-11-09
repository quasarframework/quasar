'use strict';

var
  loadPages = require('./register/pages')
  ;

function startApp() {
  quasar.make.a.get.request({url: 'app.json', local: true})
    .done(function(appManifest) {
      loadPages(appManifest);
      quasar.start.router();
    });
};

module.exports = {
  start: {
    app: startApp
  }
};
