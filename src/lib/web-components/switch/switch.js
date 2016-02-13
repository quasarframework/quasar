'use strict';

var template = require('raw!./switch.html');

Vue.component('quasar-switch', {
  template: template,
  props: ['model']
});
