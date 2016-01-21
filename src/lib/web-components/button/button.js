'use strict';

var
  colors = ['neutral', 'primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info'],
  sizes = ['small', 'big']
  ;

Vue.component('quasar-button', {
  template: '<div class="quasar-button non-selectable"><slot></slot></a>',
  compiled: function() {
    var
      el = $(this.$el),
      manager = el.getAttributesManager()
      ;

    manager.withEmpty(colors, function(color) {
      el.addClass(color);
    });

    manager.withEmpty(sizes, function(size) {
      el.addClass(size);
    });

    _.forEach(['circular', 'raised', 'disabled', 'inverted', 'cornered', 'fluid'], function(type) {
      manager.withEmpty(type, function() {
        el.addClass(type);
      });
    });
  }
});

Vue.component('quasar-button-group', {
  template: '<div class="buttons"><slot></slot></div>'
});
