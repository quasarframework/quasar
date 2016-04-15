'use strict';

var template = require('raw!./radio.html');

Vue.component('radio', {
  template: template,
  props: {
    model: {
      twoWay: true,
      required: true
    },
    value: {
      required: true
    }
  }
});
