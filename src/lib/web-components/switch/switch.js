'use strict';

var template = require('raw!./switch.html');

Vue.component('switch', {
  template: template,
  props: ['model'],
  methods: {
    toggle: function(event) {
      if (
        event.isFinal &&
        (this.model && event.deltaX < 0 || !this.model && event.deltaX > 0)
      ) {
        $(this.$el).find('input').click();
      }
    }
  }
});
