'use strict';

var html = require('raw!./view.notify.html');

module.exports = {
  template: html,
  data: {
    types: ['positive', 'negative', 'info', 'warning'],
    notifyShowing: false
  },
  methods: {
    basicNotify: function() {
      quasar.notify('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
    },
    basicNotifyWithLongMessage: function() {
      quasar.notify('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
    },
    notifyWithType: function(type) {
      quasar.notify[type]({
        html: quasar.capitalize(type) + ' notify'
      });
    },
    noTimeoutNotify: function() {
      quasar.notify({
        html: 'This notify won\'t timeout. User must acknowledge it.',
        timeout: 0
      });
    },
    notifyWithIcon: function() {
      quasar.notify({
        html: 'Notify with an icon',
        icon: 'camera_enhance'
      });
    },
    notifyWithButton: function() {
      quasar.notify({
        html: 'Notify with an action button',
        button: {
          label: 'Undo',
          handler: function() {
            quasar.notify.positive('Undone!');
          }
        }
      });
    },
    showNotify: function() {
      if (this.notifyShowing) {
        return;
      }

      var self = this;

      this.notify = quasar.notify({
        html: 'Dismiss this notify with nearby Dissmiss Notify button',
        timeout: 0,
        onDismiss: function() {
          self.notifyShowing = false;
        }
      });
      this.notifyShowing = true;
    },
    dismissNotify: function() {
      this.notify.dismiss();
      this.notifyShowing = false;
    },
    showMultipleNotifiers: function() {
      this.types.forEach(function(type) {
        this.notifyWithType(type);
      }.bind(this));
    }
  }
};
