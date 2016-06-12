'use strict';

var html = require('raw!./view.dialog.html');

module.exports = {
  template: html,
  methods: {
    alert: function() {
      quasar.dialog({
        title: 'Alert',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.'
      });
    },
    prompt: function() {
      quasar.dialog({
        title: 'Prompt',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        inputs: [
          {
            name: 'input1',
            label: 'Placeholder 1'
          },
          {
            name: 'input2',
            label: 'Placeholder 2'
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler: function(data) {
              console.log('OK!', data);
            }
          }
        ]
      });
    },
    confirm: function() {
      quasar.dialog({
        title: 'Confirm',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        buttons: [
          {
            label: 'Disagree',
            handler: function() {
              console.log('Disagreed...');
            }
          },
          {
            label: 'Agree',
            handler: function() {
              console.log('Agreed!');
            }
          }
        ]
      });
    },
    radio: function() {
      quasar.dialog({
        title: 'Radios',
        message: 'Message can be used for all types of Dialogs.',
        radios: [
          {
            label: 'Option 1',
            value: 'opt1'
          },
          {
            label: 'Option 2',
            value: 'opt2',
            selected: true
          },
          {
            label: 'Option 3',
            value: 'opt3'
          },
          {
            label: 'Option 4',
            value: 'opt4'
          },
          {
            label: 'Option 5',
            value: 'opt5'
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler: function(data) {
              console.log('OK!', data);
            }
          }
        ]
      });
    },
    checkbox: function(toggles) {
      var options = {
        title: toggles ? 'Toggles' : 'Checkboxes',
        buttons: [
          {
            label: 'Cancel',
            handler: $.noop
          },
          {
            label: 'Ok',
            handler: function(data) {
              console.log('OK!', data);
            }
          }
        ]
      };

      options[toggles ? 'toggles' : 'checkboxes'] = [
        {
          label: 'Option 1',
          value: 'opt1',
          checked: true
        },
        {
          label: 'Option 2',
          value: 'opt2'
        },
        {
          label: 'Option 3',
          value: 'opt3'
        },
        {
          label: 'Option 4',
          value: 'opt4'
        },
        {
          label: 'Option 5',
          value: 'opt5'
        }
      ];

      quasar.dialog(options);
    },
    range: function() {
      quasar.dialog({
        title: 'Ranges',
        ranges: [
          {
            label: 'Volume',
            min: 1,
            max: 5,
            iconMin: 'volume_down',
            iconMax: 'volume_up'
          },
          {
            label: 'Brightness',
            min: 1,
            max: 5,
            value: 2
          },
          {
            label: 'Speed',
            min: 1,
            max: 10,
            value: 6
          },
          {
            label: 'Noise Level',
            min: 4,
            max: 15
          }
        ],
        buttons: [
          'Cancel',
          {
            label: 'Change',
            handler: function(data) {
              console.log('OK!', data);
            }
          }
        ]
      });
    }
  }
};
