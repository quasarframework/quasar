/* eslint-disable no-extend-native */

require('es6-promise').polyfill()

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

if (!Object.values) {
  const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
  const concat = Function.bind.call(Function.call, Array.prototype.concat)
  const keys = Reflect.ownKeys
  Object.values = function values (O) {
    return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}
