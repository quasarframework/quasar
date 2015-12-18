'use strict';

Vue.component('quasar-icon', {
  template: '<i class="quasar-icon non-selectable">{{name}}</i>',
  props: ['name'],
  compiled: function() {
    var el = $(this.$el);
    var manager = el.getAttributesManager();
    var icon = manager.getEmpty();

    if (icon.length > 0) {
      this.name = icon[0];
      manager.removeEmpty();
    }
  }
});
