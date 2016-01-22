'use strict';

var html = require('raw!./view.second.html');

module.exports = {
  template: html,
  data: {
    icon: 'alarm',
    types: ['rectangle', 'circular'],
    sizes: ['small', 'medium', 'big'],
    colors: ['default', 'neutral', 'primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info'],
    extras: ['raised', 'disabled', 'inverted']
  },
  ready: function() {
    quasar.add.fab({
      icon: 'cloud',
      label: 'FAB',
      class: 'secondary',
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
