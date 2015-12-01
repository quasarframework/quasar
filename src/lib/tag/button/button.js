'use strict';

Vue.component('quasar-button', {
  template: '<button class="ui button"><slot></slot></button>',
  compiled: function() {
    var el = $(this.$el);
    var manager = el.getAttributesManager();
    var attr = manager.getEmpty();

    _.forEach(attr, function(type) {
      manager.withEmpty(type, function() {
        el.addClass(type);
        if (type === 'circular') {
          el.addClass('icon');
        }
        else if (type == 'flat') {
          el.addClass('squared');
        }
      });
    });
  }
});

Vue.component('quasar-button-group', {
  template: '<div class="ui buttons"><slot></slot></div>'
});
