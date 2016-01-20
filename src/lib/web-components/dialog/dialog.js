'use strict';

var
  dialogsNode = $('<div id="__quasar_dialogs">'),
  template = require('raw!./dialog.html')
  ;

$('body').append(dialogsNode);

function Dialog(options) {
  this.vm = new Vue(options.vm);

  var
    el = $(this.vm.$el),
    header = el.find('.quasar-dialog-header'),
    body = $(this.vm.$el).find('.quasar-dialog-body'),
    footer = el.find('.quasar-dialog-footer')
    ;

  this.scroll = function() {
    var
      offset = body.scrollTop(),
      hasScroll = body.prop('scrollHeight') + 25 > body.height()
      ;

    if (!hasScroll) {
      console.log('NO SCROLL');
      header.removeClass('shadow');
      footer.removeClass('shadow');
      return;
    }

    console.log(offset > 0 ? 'header shadow' : '');
    console.log(offset, body.height(), offset + body.height() + 25, body.prop('scrollHeight'), offset + body.height() < body.prop('scrollHeight') ? 'footer shadow' : '');
    console.log('---');
    header[offset > 0 ? 'addClass' : 'removeClass']('z-2');
    footer[offset + body.height() + 25 < body.prop('scrollHeight') ? 'addClass' : 'removeClass']('z-2-up');
  };
  this.open();

  body.scroll(this.scroll);
}

Dialog.prototype.open = function() {
  $('body').addClass('inactive');
  setTimeout(function() {
    $(this.vm.$el).addClass('active');
    this.scroll();
  }.bind(this), 1);
};

Dialog.prototype.close = function() {
  $('body').removeClass('inactive');

  $(this.vm.$el)
  .removeClass('active')
  .find('> .quasar-dialog-body').off('scroll', this.scroll);

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
