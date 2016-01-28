'use strict';

var html = require('raw!./view.inputs.html');

module.exports = {
  template: html,
  data: {
    check: false,
    radio: {
      options: [
        {value: 'one', label: 'Option 1'},
        {value: 'two', label: 'Option 2'},
        {value: 'three', label: 'Option 3'}
      ],
      model: 'one'
    },
    range: {
      model: 25,
      min: 20,
      max: 50
    },
    text: '',
    textarea: '',
    number: 10
  },
  ready: function() {
    quasar.add.fab({
      icon: 'pages',
      class: 'light',
      buttons: [
        {
          icon: 'alarm',
          class: 'secondary',
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
        },
        {
          icon: 'mail',
          class: 'positive',
          fn: function() {
            alert('2');
          }
        },
        {
          icon: 'mail',
          class: 'negative',
          fn: function() {
            alert('2');
          }
        }
      ]
    });
    quasar.add.fab({
      icon: 'pages',
      horizontal: true,
      class: 'primary',
      buttons: [
        {
          icon: 'alarm',
          class: 'secondary',
          fn: function() {
            alert('1');
          }
        },
        {
          icon: 'mail',
          class: 'tertiary',
          fn: function() {
            alert('2');
          }
        }
      ]
    });
  }
};
