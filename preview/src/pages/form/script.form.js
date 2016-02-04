'use strict';

var html = require('raw!./view.form.html');

module.exports = {
  template: html,
  data: {
    dropdown: {
      model: '',
      options: {
        one: 'One',
        two: 'Two',
        three: 'Three'
      }
    }
  }
};
