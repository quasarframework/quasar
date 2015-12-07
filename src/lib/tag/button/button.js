'use strict';

Vue.component('quasar-button', {
  template: '<button class="ui button"><slot></slot></button>',
  compiled: function() {
    var el = $(this.$el);
    var manager = el.getAttributesManager();
    var attr = manager.getEmpty();

    manager.withEmpty(attr.getEmpty(), function(type) {
      el.addClass(type);
      if (type === 'circular') {
        el.addClass('icon');
      }
      else if (type == 'flat') {
        el.addClass('squared');
      }
    });
  }
});

Vue.component('quasar-button-group', {
  template: '<div class="ui buttons"><slot></slot></div>'
});
