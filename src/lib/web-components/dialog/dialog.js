'use strict';

var
  dialogsNode = $('<div id="__quasar_dialogs">'),
  template = require('raw!./dialog.html')
  ;

$('body').append(dialogsNode);

function Dialog(options) {
  this.vm = new Vue(options.vm);
  this.open();
}

Dialog.prototype.open = function() {
  $('body').addClass('inactive');
  setTimeout(function() {
    $(this.vm.$el).addClass('active');
  }.bind(this), 1);
};

Dialog.prototype.close = function() {
  $('body').removeClass('inactive');
  $(this.vm.$el).removeClass('active');
  setTimeout(function() {
    this.vm.$destroy(true);
  }.bind(this), 200);
};

function createDialog(options) {
  if (!options) {
    throw new Error('Dialog options missing');
  }
  if (!options.html) {
    throw new Error('Dialog html missing');
  }

  var node = $(template).appendTo(dialogsNode);

  node.find('.quasar-dialog-body').html(options.html);

  var config = _.merge(
    {
      title: 'Dialog',
      buttons: [],
      vm: {
        el: node[0],
        data: {
          icon: options.icon,
          title: options.title,
          buttons: options.buttons
        },
        methods: {
          dismiss: function() {
            dialog.close();
          }
        }
      }
    },
    options
  );

  var dialog = new Dialog(config);

  return dialog;
}

q.dialog = createDialog;
