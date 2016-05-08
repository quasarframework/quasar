'use strict';

var template = require('raw!./state.html');

Vue.component('state', {
  template: template,
  props: {
    model: {
      type: Boolean,
      required: true,
      twoWay: true
    }
  }
});
