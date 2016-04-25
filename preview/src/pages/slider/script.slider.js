'use strict';

var html = require('raw!./view.slider.html');
var modalTemplate = require('raw!./html/page-slider-modal.html');

module.exports = {
  template: html,
  methods: {
    launchModal: function() {
      new quasar.Modal({
        template: modalTemplate
      }).set({
        maximized: true
      }).show();
    }
  }
};
