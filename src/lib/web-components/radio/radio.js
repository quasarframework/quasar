'use strict';

var template = require('raw!./radio.html');

Vue.component('radio', {
  template: template,
  props: ['options', 'model']
});
