/* eslint-disable no-extend-native */

function assign (target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object')
  }

  var to = Object(target)
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i]
    if (nextSource === undefined || nextSource === null) {
      continue
    }

    var keysArray = Object.keys(Object(nextSource))
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex]
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey]
      }
    }
  }
  return to
}

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: assign
  })
}

import * as Promise from 'es6-promise-shim'

if (window && !window.Promise) {
  window.Promise = Promise
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
