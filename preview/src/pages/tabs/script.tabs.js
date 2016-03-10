'use strict';

var html = require('raw!./view.tabs.html');

module.exports = {
  template: html,
  data: {
    tabs: [
      {
        label: 'Tab 1',
        icon: 'message',
        target: '#tab-1'
      },
      {
        label: 'Disabled',
        icon: 'fingerprint',
        disabled: true
      },
      {
        label: 'Tab 2',
        icon: 'alarm',
        target: '#tab-2'
      },
      {
        label: 'Tab 3',
        icon: 'accessibility',
        target: '#tab-3'
      },
      {
        label: 'Tab 4',
        icon: 'accessibility',
        target: '#tab-4',
        hidden: true
      }
    ]
  }
};
