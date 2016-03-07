'use strict';

var html = require('raw!./view.buttons.html');

module.exports = {
  template: html,
  data: {
    icon: 'alarm',
    types: ['rectangle', 'circular'],
    sizes: ['small', 'medium', 'big'],
    colors: ['primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info', 'light', 'dark'],
    extras: ['glossy', 'raised', 'disabled', 'clear', 'outline', 'round']
  },
  ready: function() {
    quasar.add.fab({
      icon: 'cloud',
      label: 'FAB',
      class: 'tertiary',
      buttons: [
        {
          icon: 'alarm',
          class: 'positive',
          fn: function() {
            alert('1');
          }
        },
        {
          icon: 'mail',
          class: 'warning',
          fn: function() {
            alert('2');
          }
        }
      ]
    });
  }
};
