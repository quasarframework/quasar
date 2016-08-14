/* eslint-disable no-extend-native, one-var, no-self-compare */

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, startFrom) {
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
    let currentElement
    while (k < len) {
      currentElement = O[k]
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true
      }
      k++
    }
    return false
  }
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.substr(position, searchString.length) === searchString
  }
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    let subjectString = this.toString()

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= searchString.length

    let lastIndex = subjectString.indexOf(searchString, position)

    return lastIndex !== -1 && lastIndex === position
  }
}

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
    let element = this

    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element
      }

      element = element.parentNode
    }

    return null
  }
}
