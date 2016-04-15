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
            field: 'isodate'
          },
          {
            label: 'Source',
            field: 'source'
          },
          {
            label: 'Serviceable',
            field: 'serviceable'
          },
          {
            label: 'Log Number',
            field: 'log_number'
          },
          {
            label: 'Message',
            field: 'message'
          }
        ]
      }
    });
  });
};
