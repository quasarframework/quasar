'use strict';

var html = require('raw!./view.action-sheet.html');

module.exports = {
  template: html,
  methods: {
    showActionSheet: function(gallery) {
      quasar.action.sheet({
        title: 'Actions',
        gallery: gallery,
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
            classes: 'text-primary',
            handler: function() {
              console.log('Cancelled...');
            }
          }
        ]
      });
    },
    showActionSheetWithAvatar: function(gallery) {
      quasar.action.sheet({
        title: 'Share to',
        gallery: gallery,
        buttons: [
          {
            label: 'Joe',
            avatar: 'assets/linux-avatar.png',
            handler: function() {
              console.log('Joe');
            }
          },
          {
            label: 'John',
            avatar: 'assets/boy-avatar.png',
            handler: function() {
              console.log('John');
            }
          },
          {
            label: 'Jim',
            avatar: 'assets/linux-avatar.png',
            handler: function() {
              console.log('Jim');
            }
          },
          {
            label: 'Jack',
            avatar: 'assets/guy-avatar.png',
            handler: function() {
              console.log('Jack');
            }
          },
          {
            label: 'Cancel',
            icon: 'cancel',
            classes: 'text-primary',
            handler: function() {
              console.log('Cancelled...');
            }
          }
        ]
      });
    }
  }
};
