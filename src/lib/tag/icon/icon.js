'use strict';

Vue.component('quasar-icon', {
  template: '<i class="icon" :class="[name]"></i>',
  props: ['name'],
  compiled: function() {
    var el = $(this.$el);
    var manager = el.getAttributesManager();
    var icon = manager.getEmpty();

    if (icon.length > 0) {
      icon = icon.join(' ');

      el.addClass(icon);
      manager.removeEmpty();
    }
  }
});
