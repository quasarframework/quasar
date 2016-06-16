'use strict';

var html = require('raw!./view.global-progress.html');

module.exports = function(done) {
  setTimeout(function() {
    done({
      template: html,
      methods: {
        showBackgroundProgress: function() {
          quasar.show.global.progress();
          setTimeout(function() {
            quasar.hide.global.progress();
          }, 3000);
        }
      }
    });
  }, 3000);
};
