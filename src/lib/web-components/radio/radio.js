'use strict';

var template = require('raw!./radio.html');

Vue.component('radio', {
  template: template,
  props: {
    model: {
      type: String,
      twoWay: true,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
});
