'use strict';

var html = require('raw!./view.inputs.html');

module.exports = {
  template: html,
  data: {
    check: false,
    radio: 'opt2',
    range: {
      model: 25,
      min: 20,
      max: 50
    },
    select: 'fb',
    multipleSelect: ['goog', 'twtr'],
    selectOptions: [
      {
        label: 'Google',
        value: 'goog'
      },
      {
        label: 'Facebook',
        value: 'fb'
      },
      {
        label: 'Twitter',
        value: 'twtr'
      },
      {
        label: 'Apple Inc.',
        value: 'appl'
      },
      {
        label: 'Oracle',
        value: 'ora'
      }
    ],
    username: '',
    password: '',
    textarea: '',
    number: 4
  }
};
