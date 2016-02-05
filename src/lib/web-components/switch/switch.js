'use strict';

var template = require('raw!./switch.html');

Vue.component('quasar-switch', {
  template: template,
  props: ['model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('layout inline');
    });
  }
});
