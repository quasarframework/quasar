'use strict';

var
  defaultTemplate = require('raw!./html/default.html'),
  parameterizedTemplate = require('raw!./html/parameterized.html')
  ;

module.exports = function(done) {
  var
    self = this,
    parameterized = this.parameterized
    ;

  done({
    template: parameterized ? parameterizedTemplate : defaultTemplate,
    data: {
      query: self.query,
      params: self.params,
      self: self
    },
    methods: {
      navigate: function(type) {
        var route = '#/' + self.name;

        if (!parameterized) {
          switch (type) {
          case 'query':
            route += '?g=true&quasar=framework';
            break;
          case 'param':
            route += '/6';
            break;
          default:
            route += '/6?some=query';
            break;
          }
        }

        quasar.navigate.to.route(route);
      }
    }
  });
};
