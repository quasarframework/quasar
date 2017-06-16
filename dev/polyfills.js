/* eslint-disable no-extend-native */

require('es6-promise').polyfill()

if (!Object.values) {
  require('object.values').shim()
}

if (!Number.isInteger) {
  Number.isInteger = function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  }
}

(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove () {
        return this.parentNode ? this.parentNode.removeChild(this) : this
      }
    })
  })
})([Element.prototype, CharacterData.prototype, DocumentType.prototype])

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value (predicate) {
      'use strict'
      if (this == null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined')
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }
      var list = Object(this)
      var length = list.length >>> 0
      var thisArg = arguments[1]

      for (var i = 0; i < length; i++) {
        if (predicate.call(thisArg, list[i], i, list)) {
          return i
        }
      }
      return -1
    }
  })
}
