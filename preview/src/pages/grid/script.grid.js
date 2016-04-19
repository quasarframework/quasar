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
            formatter: function(value) {
              return new Date(value).toLocaleString();
            }
          },
          {
            label: 'Source',
            field: 'source'
          },
          {
            label: 'Serviceable',
            field: 'serviceable',
            formatter: function(value) {
              if (value === 'Informational') {
                return '<i>info</i>';
              }
              return value;
            }
          },
          {
            label: 'Log Number',
            field: 'log_number'
          },
          {
            label: 'Message',
            field: 'message'
          }
        ],
        selection: {
          mode: 'multiple',
          actions: [
            {
              label: 'View',
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
