'use strict';

var template = require('raw!./progress.html');

Vue.component('quasar-progress', {
  template: template,
  props: ['model']
});
