/**
 * Quasar runtime for auto-importing
 * components or directives.
 *
 * Warning! This file does NOT gets transpiled by Babel
 * but is included into the UI code.
 *
 * @param {component} Vue Component object
 * @param {type}      One of 'components' or 'directives'
 * @param {items}     Object containing components or directives
 */
module.exports = function (component, type, items) {
  var opt = component.options

  if (opt[type] === void 0) {
    opt[type] = items
  }
  else {
    var target = opt[type]
    for (var i in items) {
      if (target[i] === void 0) {
        target[i] = items[i]
      }
    }
  }
}
