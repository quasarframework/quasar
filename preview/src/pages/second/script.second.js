'use strict';

var html = require('raw!./view.second.html');

module.exports = function(done) {
  quasar.nextTick(function() {
    done({
      template: html,
      ready: function() {
      },
      destroyed: function() {
      }
    });
  });
};
