'use strict';

Vue.component('quasar-icon', {
  template: '<i class="quasar-icon non-selectable"><slot></slot></i>',
  ready: function() {
    var
      el = $(this.$el),
      manager = el.getAttributesManager()
      ;

    manager.withEmpty('tiny small medium large', function(size) {
      el.addClass(size);
    });
  }
});
