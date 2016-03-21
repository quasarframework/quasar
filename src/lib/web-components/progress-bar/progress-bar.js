'use strict';

var template = require('raw!./progress-bar.html');

Vue.component('progress-bar', {
  template: template,
  props: {
    model: {
      type: Number,
      default: 0
    }
  }
});
