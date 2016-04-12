'use strict';

var html = require('raw!./view.tree.html');

module.exports = {
  template: html,
  data: {
    treeModel: [
      {
        title: 'item 1',
        expanded: true,
        children: [
          {
            title: 'item 1.1',
            expanded: false,
            children: [
              {
                title: 'item 1.1.1',
                expanded: false,
                children: [
                  {
                    title: 'item 1.1.1.1',
                    expanded: false,
                    children: []
                  }
                ]
              },
              {
                title: 'item 1.1.2',
                expanded: false,
                children: []
              }
            ]
          },
          {
            title: 'item 1.2',
            expanded: false,
            children: []
          },
          {
            title: 'item 1.3',
            expanded: false,
            handler: function() { quasar.notify('Tapped on item 1.3'); },
            children: []
          }
        ]
      },
      {
        title: 'item 2',
        expanded: false,
        children: [
          {
            title: 'item 2.1',
            expanded: false,
            children: [
              {
                title: 'item 2.1.1',
                expanded: false,
                children: []
              },
              {
                title: 'item 2.1.2',
                expanded: false,
                children: [
                  {
                    title: 'item 2.1.2.1',
                    expanded: false,
                    children: []
                  },
                  {
                    title: 'item 2.1.2.2',
                    expanded: false,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            title: 'item 2.2',
            expanded: false,
            children: []
          },
          {
            title: 'item 2.3',
            expanded: false,
            children: []
          }
        ]
      }
    ]
  }
};
