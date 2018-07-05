/* eslint-disable no-extend-native, one-var, no-self-compare */
import { isSSR } from './plugins/platform.js'

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

if (!Number.isInteger) {
  Number.isInteger = function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchEl, startFrom) {
    'use strict'

    let O = Object(this)
    let len = parseInt(O.length, 10) || 0
    if (len === 0) {
      return false
    }
    let n = parseInt(startFrom, 10) || 0
    let k
    if (n >= 0) {
      k = n
    }
    else {
      k = len + n
      if (k < 0) { k = 0 }
    }
    let curEl
    while (k < len) {
      curEl = O[k]
      if (searchEl === curEl ||
         (searchEl !== searchEl && curEl !== curEl)) { // NaN !== NaN
        return true
      }
      k++
    }
    return false
  }
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str, position) {
    position = position || 0
    return this.substr(position, str.length) === str
  }
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str, position) {
    let subjectString = this.toString()

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= str.length

    let lastIndex = subjectString.indexOf(str, position)

    return lastIndex !== -1 && lastIndex === position
  }
}

if (!isSSR) {
  if (typeof Element.prototype.matches !== 'function') {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches (selector) {
      let
        element = this,
        elements = (element.document || element.ownerDocument).querySelectorAll(selector),
        index = 0

      while (elements[index] && elements[index] !== element) {
        ++index
      }

      return Boolean(elements[index])
    }
  }

  if (typeof Element.prototype.closest !== 'function') {
    Element.prototype.closest = function closest (selector) {
      let el = this
      while (el && el.nodeType === 1) {
        if (el.matches(selector)) {
          return el
        }
        el = el.parentNode
      }
      return null
    }
  }

  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function (arr) {
    arr.forEach(item => {
      if (item.hasOwnProperty('remove')) { return }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value () {
          if (this.parentNode !== null) {
            this.parentNode.removeChild(this)
          }
        }
      })
    })
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype])
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value (predicate) {
      'use strict'
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined')
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      let value
      const
        list = Object(this),
        length = list.length >>> 0,
        thisArg = arguments[1]

      for (let i = 0; i < length; i++) {
        value = list[i]
        if (predicate.call(thisArg, value, i, list)) {
          return value
        }
      }
      return undefined
    }
  })
}
