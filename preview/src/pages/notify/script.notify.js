'use strict';

var html = require('raw!./view.notify.html');

module.exports = {
  template: html,
  methods: {
    notify: function() {
      quasar.notify({
        html: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
        icon: 'alarm', timeout: 0
      });
      ['positive', 'negative', 'info', 'warning'].forEach(function(type) {
        quasar.notify[type]({html: type + ' message', timeout: 0});
      });
    }
  }
};
