'use strict';

var html = require('raw!./view.grid.html');

module.exports = function(done) {
  quasar.make.a.get.request({
    url: 'pages/grid/assets/grid-data.json',
    local: true
  }).done(function(data) {
    done({
      template: html,
      data: {
        data: data,
        columns: [
          {
            label: 'Date',
            field: 'isodate',
            style: 'width: 10%',
            formatter: function(value) {
              return new Date(value).toLocaleString();
            }
          },
          {
            label: 'Source',
            field: 'source'
          },
          {
            label: 'Service',
            field: 'serviceable',
            formatter: function(value) {
              if (value === 'Informational') {
                return '<i>info</i>';
              }
              return value;
            },
            style: 'color: green;',
            classes: 'text-center'
          },
          {
            label: 'Log Number',
            field: 'log_number'
          },
          {
            label: 'Message',
            field: 'message',
            style: 'width: 400px'
          }
        ],
        selection: {
          mode: 'multiple',
          actions: [
            {
              label: 'View 1',
              handler: function(selectedRows) {
                console.dir(selectedRows);
              }
            },
            {
              label: 'View 2',
              handler: function(selectedRows) {
                console.dir(selectedRows);
              }
            }
          ]
        }
      }
    });
  });
};
