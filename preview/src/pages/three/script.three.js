'use strict';

var html = require('raw!./view.three.html');

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
  }
};
