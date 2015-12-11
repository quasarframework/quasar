'use strict';

var html = require('raw!../html/view.second.html');

module.exports = function(done) {
  console.log('called exports()');
  quasar.nextTick(function() {
    done({
      template: html,
      ready: function() {
        console.log('Page second ready');
      },
      destroyed: function() {
        console.log('Page second destroyed');
      }
    });
  });
};
