'use strict';

var html = require('raw!./view.fab.html');

module.exports = {
  template: html,
  methods: {
    alert: function() {
      quasar.dialog({
        title: 'FAB',
        message: 'Good job! Keep it going.'
      });
    }
  }
};
