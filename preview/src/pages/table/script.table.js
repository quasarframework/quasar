'use strict';

var html = require('raw!./view.table.html');

module.exports = {
  template: html,
  data: {
    styles: [
      '',
      'inner-delimiter',
      'bordered',
      'striped',
      'highlight',
      'centered',
      'compact'
    ]
  }
};
