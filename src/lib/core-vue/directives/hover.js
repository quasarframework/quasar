'use strict';

Vue.directive('hover', {
  update: function(handler) {
    if (!quasar.runs.on.desktop) {
      return;
    }

    this.container = $(this.el);
    this.onHover = function() {
      handler(true);
    };
    this.onBlur = function() {
      handler(false);
    };

    this.container.hover(this.onHover, this.onBlur);
  },
  unbind: function() {
    if (!quasar.runs.on.desktop) {
      return;
    }

    this.container.off('hover');
  }
});
