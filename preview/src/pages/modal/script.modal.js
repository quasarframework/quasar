'use strict';

var
  html = require('raw!./view.modal.html'),
  modalTemplate = require('raw!./html/modal_template.html')
  ;

var number = 0;

module.exports = {
  template: html,
  methods: {
    openScreenModal: function() {
      var self = this;

      new quasar.Modal({
        template: modalTemplate,
        data: {
          number: ++number
        },
        methods: {
          openModal: self.openScreenModal
        }
      }).css({
        minWidth: '80vw',
        minHeight: '80vh'
      }).show();
    },
    openSimpleModal: function() {
      new quasar.Modal({
        template: '<h1 v-for="n in 10">Simple Modal</h1><button class="secondary" @click="close()">Close Me</button>'
      })
      .onShow(function() {
        quasar.notify('Opened a simple modal');
      })
      .onClose(function() {
        quasar.notify('Closed the simple modal');
      })
      .css({
        padding: '50px',
        minWidth: '50vw'
      })
      .show();
    },
    openMinimizedModal: function() {
      new quasar.Modal({
        template: '<h1>Simple Modal</h1><p>This one has backdrop on small screens too.</p>' +
                  '<button class="tertiary" @click="close()">Close Me</button>'
      }).set({
        minimized: true
      }).css({
        padding: '50px'
      }).show();
    },
    openMaximizedModal: function() {
      new quasar.Modal({
        template: '<h1>Simple Modal</h1><p>This one is maximized on bigger screens too.</p>' +
                  '<button class="tertiary" @click="close()">Close Me</button>'
      }).set({
        maximized: true
      }).css({
        padding: '50px'
      }).show();
    }
  },
};
