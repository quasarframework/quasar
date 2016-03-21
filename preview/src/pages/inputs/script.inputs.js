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
    text: '',
    textarea: '',
    number: 10
  }
};
