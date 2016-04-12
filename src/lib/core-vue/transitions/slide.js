'use strict';

Vue.transition('slide', {
  css: false,
  enter: function(el, done) {
    $(el).velocity('stop').velocity('slideDown', done);
  },
  enterCancelled: function(el) {
    $(el).velocity('stop');
  },

  leave: function(el, done) {
    $(el).velocity('stop').velocity('slideUp', done);
  },
  leaveCancelled: function(el) {
    $(el).velocity('stop');
  }
});
