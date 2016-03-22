'use strict';

var
  matTemplate = require('raw!./action-sheet-material.html'),
  iosTemplate = require('raw!./action-sheet-ios.html')
  ;

function parseButtons(buttons) {
  if (!Array.isArray(buttons)) {
    throw new Error('Action Sheet buttons parameter must be an array.');
  }

  if (buttons.length <= 1) {
    throw new Error('Action Sheet requires at least one button');
  }

  if (buttons.some(function(button) {
    return Object(button) !== button || !button.label || !button.handler;
  })) {
    throw new Error('At least one of Action Sheet\'s button parameter is not an object or missing label and/or handler.');
  }

  return buttons.map(function(button) {
    if (button.classes) {
      if (Array.isArray(button.classes)) {
        button.classes = button.classes.split(' ');
      }
      else if (typeof button.classes !== 'string') {
        throw new Error('Action Sheet button "classes" parameter must be either an array or string');
      }
    }
    return button;
  });
}

function getCSS() {
  if (quasar.runs.on.ios) {
    return {
      maxHeight: '80vh',
      height: 'auto',
      backgroundColor: 'transparent',
      boxShadow: 'none'
    };
  }

  return {
    maxHeight: '80vh',
    height: 'auto'
  };
}

function actionSheet(options) {
  var data = $.extend({}, options);

  data.buttons = parseButtons(data.buttons);
  data.dismissButton = data.buttons.pop();

  var modal = new quasar.Modal({
    template: quasar.runs.on.ios ? iosTemplate : matTemplate,
    data: data
  })
  .css(getCSS())
  .set({
    transitionIn: {translateY: [0, '101%']},
    transitionOut: {translateY: ['101%', 0]}
  });

  modal.$el.removeClass('items-center').addClass('items-end');
  modal.$backdrop.click(function() {
    modal.close();
  });
  modal.show();
}

$.extend(true, quasar, {
  action: {
    sheet: actionSheet
  }
});
