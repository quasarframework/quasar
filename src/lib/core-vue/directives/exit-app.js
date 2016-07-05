'use strict';

Vue.directive('exit-app', {
  bind: function() {
    this.container = $(this.el);

    if (!quasar.runs.on.android) {
      this.container.addClass('hidden');
      return;
    }

    this.container.click(function() {
      navigator.app.exitApp();
    });
  },
  unbind: function() {
    if (!quasar.runs.on.android) {
      return;
    }

    this.container.off('click');
  }
});
