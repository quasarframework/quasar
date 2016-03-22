'use strict';

var html = require('raw!./view.buttons.html');

module.exports = {
  template: html,
  data: {
    icon: 'alarm',
    sizes: ['small', 'medium', 'big'],
    colors: [
      'primary', 'secondary', 'tertiary', 'positive', 'negative', 'warning', 'info', 'light', 'dark',
      'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
      'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'
    ],
    extras: ['glossy', 'raised', 'clear', 'outline', 'round']
  }
};
