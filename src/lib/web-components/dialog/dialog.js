'use strict';

var template = require('raw!./dialog.html');

function parseButtons(buttons) {
  if (!Array.isArray(buttons)) {
    throw new Error('Dialog buttons parameter must be an array.');
  }

  if (buttons.some(function(button) {
    return typeof button !== 'string' && (Object(button) !== button || !button.label || !button.handler);
  })) {
    throw new Error('At least one of Dialog\'s button parameter is neither a string nor an object with both label handler.');
  }

  return buttons.map(function(button) {
    if (typeof button === 'string') {
      return {
        label: button,
        handler: $.noop
      };
    }

    return button;
  });
}

function parseInputs(inputs) {
  if (!Array.isArray(inputs)) {
    throw new Error('Dialog inputs parameter must be an array.');
  }

  return inputs.map(function(input) {
    input.model = input.model || '';
    return input;
  });
}

function parseRadios(radios) {
  if (!Array.isArray(radios)) {
    throw new Error('Dialog radios parameter must be an array.');
  }

  if (radios.some(function(radio) {
    return !radio.label || !radio.value;
  })) {
    throw new Error('One of Dialog\'s radio parameter is missing either label or value');
  }

  var selectedValue = radios.filter(function(radio) {
    return radio.selected;
  });

  if (!selectedValue) {
    return radios[0].value;
  }

  if (selectedValue.length > 1) {
    throw new Error('Multiple Dialog radio parameters are selected.');
  }

  return selectedValue[0].value;
}

function parseCheckboxes(checkboxes) {
  if (!Array.isArray(checkboxes)) {
    throw new Error('Dialog checkboxes parameter must be an array.');
  }

  if (checkboxes.some(function(checkbox) {
    return !checkbox.label || !checkbox.value;
  })) {
    throw new Error('One of Dialog\'s checkbox parameter is missing either label or value');
  }

  return checkboxes.map(function(checkbox) {
    checkbox.checked = checkbox.checked || false;
    return checkbox;
  });
}

quasar.dialog = function(options) {
  var data = $.extend({}, options);

  if (!data.buttons) {
    data.buttons = [{label: 'Ok', handler: $.noop}];
  }
  else {
    data.buttons = parseButtons(data.buttons);
  }

  if (data.inputs) {
    data.inputs = parseInputs(data.inputs);
  }
  if (data.radios) {
    data.radioModel = parseRadios(data.radios);
  }
  if (data.checkboxes) {
    data.checkboxes = parseCheckboxes(data.checkboxes);
  }

  new quasar.Modal({
    template: template,
    data: data,
    methods: {
      getData: function() {
        if (this.inputs) {
          return this.inputs.map(function(input) {
            return {
              name: input.name,
              value: input.model
            };
          });
        }
        if (this.radios) {
          return this.radioModel;
        }
        if (this.checkboxes) {
          return this.checkboxes.filter(function(checkbox) {
            return checkbox.checked;
          }).map(function(checkbox) {
            return checkbox.value;
          });
        }
      }
    }
  }).set({
    minimized: true
  }).show();
};
