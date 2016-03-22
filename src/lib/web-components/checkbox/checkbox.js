'use strict';

var template = require('raw!./checkbox.html');

Vue.component('checkbox', {
  template: template,
  props: {
    model: {
      type: Boolean,
      twoWay: true
    }
  }
});
