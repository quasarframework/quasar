'use strict';

var template = require('raw!./checkbox.html');

Vue.component('quasar-checkbox', {
  template: template,
  props: ['model']
});
