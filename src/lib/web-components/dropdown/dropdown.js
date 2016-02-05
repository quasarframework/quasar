'use strict';

var template = require('raw!./dropdown.html');

Vue.component('quasar-dropdown', {
  template: template,
  props: ['model', 'options', 'placeholder'],
  data: function() {
    return {
      active: false
    };
  },
  methods: {
    select: function(value) {
      this.model = value;
    }
  }
});
