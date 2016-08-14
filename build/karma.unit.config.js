var
  assign = require('object-assign'),
  base = require('./karma.base.config.js')

module.exports = function (config) {
  config.set(assign(base, {
    browsers: ['Chrome', 'Firefox'],
    reporters: ['progress']
  }))
}
