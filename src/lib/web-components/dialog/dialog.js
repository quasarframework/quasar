'use strict';

var
  dialogsNode = $('<div id="__quasar_dialogs">'),
  template = require('raw!./dialog.html')
  ;

$('body').append(dialogsNode);

function Dialog(vm) {
  this.vm = new Vue(vm);

  var
    el = $(this.vm.$el),
    body = el.find('.quasar-dialog-body'),
    footer = el.find('.quasar-dialog-footer')
    ;

  this.scroll = function() {
    var
      offset = body.scrollTop(),
      hasScroll = body.prop('scrollHeight') + 25 > body.height()
      ;

    if (!hasScroll) {
      footer.removeClass('shadow');
      return;
    }

    footer[offset + body.height() + 25 < body.prop('scrollHeight') ? 'addClass' : 'removeClass']('z-2-up');
  };

  showDialog(this);
  body.scroll(this.scroll);
}

function showDialog(dialog) {
  $('body').addClass('inactive');
  setTimeout(function() {
    $(dialog.vm.$el).addClass('active');
    dialog.scroll();
  }, 30);
};

Dialog.prototype.close = function(onClose) {
  $(this.vm.$el)
  .removeClass('active')
  .find('> .quasar-dialog-body').off('scroll', this.scroll);

  setTimeout(function() {
    $('body').removeClass('inactive');

    if (onClose) {
      onClose();
    }

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

  node.find('.quasar-dialog-content').html(options.html);

  var vm = _.merge({
    el: node[0],
    data: {
      icon: options.icon,
      title: options.title,
      buttons: options.buttons
    },
    methods: {
      ___onClick: function(dismiss, method) {
        if (dismiss) {
          dialog.close(function() {
            if (method) {
              method.call(this);
            }
          }.bind(this));
        }
      }
    }
  }, options.vm || {});

  var dialog = new Dialog(vm);

  return dialog;
}

quasar.dialog = createDialog;
