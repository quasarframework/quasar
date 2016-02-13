'use strict';

var template = require('raw!./radio.html');

Vue.component('quasar-radio', {
  template: template,
  props: ['options', 'model']
});
