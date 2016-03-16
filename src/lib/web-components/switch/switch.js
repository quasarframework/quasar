'use strict';

var template = require('raw!./switch.html');

Vue.component('switch', {
  template: template,
  props: ['model']
});
