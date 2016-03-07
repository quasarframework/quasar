'use strict';

var template = require('raw!./screen.html');

Vue.component('screen', {
  template: template
});

Vue.component('page', {
  template: '<div class="quasar-pages"></div>'
});
