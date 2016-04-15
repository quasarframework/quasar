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
            name: 'Date',
            field: 'isodate'
          },
          {
            name: 'Source',
            field: 'source'
          },
          {
            name: 'Serviceable',
            field: 'serviceable'
          },
          {
            name: 'Log Number',
            field: 'log_number'
          },
          {
            name: 'Message',
            field: 'message'
          }
        ]
      }
    });
  });
};
