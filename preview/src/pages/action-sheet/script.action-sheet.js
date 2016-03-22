'use strict';

var html = require('raw!./view.action-sheet.html');

module.exports = {
  template: html,
  methods: {
    showActionSheet: function() {
      quasar.action.sheet({
        title: 'Actions',
        buttons: [
          {
            label: 'Delete',
            icon: 'delete',
            handler: function() {
              console.log('Deleting');
            }
          },
          {
            label: 'Share',
            icon: 'share',
            handler: function() {
              console.log('Sharing');
            }
          },
          {
            label: 'Play',
            icon: 'gamepad',
            handler: function() {
              console.log('Playing');
            }
          },
          {
            label: 'Favorite',
            icon: 'favorite',
            handler: function() {
              console.log('Added to favorites');
            }
          },
          {
            label: 'Cancel',
            icon: 'cancel',
            classes: 'primary',
            handler: function() {
              console.log('Cancelled...');
            }
          }
        ]
      });
    }
  }
};
