'use strict';

Vue.directive('exit-app', {
  bind: function() {
    this.container = $(this.el);

    if (!quasar.runs.on.cordova) {
      this.container.addClass('cordova-only');
      return;
    }

    this.container.click(function() {
      navigator.app.exitApp();
    });
  },
  unbind: function() {
    if (!quasar.runs.on.cordova) {
      return;
    }

    this.container.off('click');
  }
});
