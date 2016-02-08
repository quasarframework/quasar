'use strict';

var html = require('raw!./view.css.html');

module.exports = {
  template: html,
  data: {
    progress: 10
  },
  methods: {
    randomize: function() {
      this.progress = Math.round(Math.random() * 100);
    }
  }
};
