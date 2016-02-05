'use strict';

var template = require('raw!./radio.html');

Vue.component('quasar-radio', {
  template: template,
  props: ['options', 'model'],
  ready: function() {
    var el = $(this.$el);

    el.getAttributesManager().with('inline', function() {
      el.addClass('layout inline');
    });
  }
});
