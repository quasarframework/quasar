'use strict';

Vue.component('quasar-video', {
  template: '<div class="video"><iframe :src="source" frameborder="0" allowfullscreen></iframe></div>',
  props: ['source']
});
