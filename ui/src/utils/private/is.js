const
  hasMap = typeof Map === 'function',
  hasSet = typeof Set === 'function',
  hasArrayBuffer = typeof ArrayBuffer === 'function'

export function isDeepEqual (a, b) {
  if (a === b) {
    return true
  }

  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) {
      return false
    }

    let length, i

    if (a.constructor === Array) {
      length = a.length

      if (length !== b.length) {
        return false
      }

      for (i = length; i-- !== 0;) {
        if (isDeepEqual(a[ i ], b[ i ]) !== true) {
          return false
        }
      }

      return true
    }

    if (hasMap === true && a.constructor === Map) {
      if (a.size !== b.size) {
        return false
      }

      i = a.entries().next()
      while (i.done !== true) {
        if (b.has(i.value[ 0 ]) !== true) {
          return false
        }
        i = i.next()
      }

      i = a.entries().next()
      while (i.done !== true) {
        if (isDeepEqual(i.value[ 1 ], b.get(i.value[ 0 ])) !== true) {
          return false
        }
        i = i.next()
      }

      return true
    }

    if (hasSet === true && a.constructor === Set) {
      if (a.size !== b.size) {
        return false
      }

      i = a.entries().next()
      while (i.done !== true) {
        if (b.has(i.value[ 0 ]) !== true) {
          return false
        }
        i = i.next()
      }

      return true
    }

    if (hasArrayBuffer === true && a.buffer != null && a.buffer.constructor === ArrayBuffer) {
      length = a.length

      if (length !== b.length) {
        return false
      }

      for (i = length; i-- !== 0;) {
        if (a[ i ] !== b[ i ]) {
          return false
        }
      }

      return true
    }

    if (a.constructor === RegExp) {
      return a.source === b.source && a.flags === b.flags
    }

    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf()
    }

    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString()
    }

    const keys = Object.keys(a).filter(key => a[ key ] !== void 0)
    length = keys.length

    if (length !== Object.keys(b).filter(key => b[ key ] !== void 0).length) {
      return false
    }

    for (i = length; i-- !== 0;) {
      const key = keys[ i ]
      if (isDeepEqual(a[ key ], b[ key ]) !== true) {
        return false
      }
    }

    return true
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b // eslint-disable-line no-self-compare
}

export function isPrintableChar (v) {
  return (v > 47 && v < 58) // number keys
    || v === 32 || v === 13 // spacebar & return key(s) (if you want to allow carriage returns)
    || (v > 64 && v < 91) // letter keys
    || (v > 95 && v < 112) // numpad keys
    || (v > 185 && v < 193) // ;=,-./` (in order)
    || (v > 218 && v < 223)
}

export function isObject (v) {
  return Object(v) === v
}

export function isDate (v) {
  return Object.prototype.toString.call(v) === '[object Date]'
}

export function isRegexp (v) {
  return Object.prototype.toString.call(v) === '[object RegExp]'
}

export function isNumber (v) {
  return typeof v === 'number' && isFinite(v)
}

export function isString (v) {
  return typeof v === 'string'
}
