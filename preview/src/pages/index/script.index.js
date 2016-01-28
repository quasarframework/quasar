'use strict';

var html = require('raw!./view.index.html');

module.exports = {
  template: html,
  methods: {
    navigate: function() {
      quasar.navigate.to.route('#/typography');
    }
  }
};
