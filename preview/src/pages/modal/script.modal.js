'use strict';

var
  html = require('raw!./view.modal.html'),
  modalTemplate = require('raw!./html/modal_template.html')
  ;

var number = 0;

module.exports = {
  template: html,
  methods: {
    openModal: function() {
      var self = this;

      var modal = new quasar.Modal({
        template: modalTemplate,
        data: {
          number: ++number
        },
        methods: {
          openModal: self.openModal
        }
      });

      modal.show();
    },
    openSimpleModal: function() {
      new quasar.Modal({
        template: '<h1>Simple Modal</h1><button class="secondary" @click="close()">Close Me</button>'
      })
      .onShow(function() {
        quasar.notify('Opened a simple modal');
      })
      .onClose(function() {
        quasar.notify('Closed the simple modal');
      })
      .show();
    },
    openSimpleFullscreenModal: function() {
      new quasar.Modal({
        template: '<h1>Simple Modal</h1><p>This one is fullscreen on bigger screens too.</p><button class="tertiary" @click="close()">Close Me</button>'
      }).fullscreen().show();
    }
  },
};
