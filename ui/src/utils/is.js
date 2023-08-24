
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

    if (a.constructor === Map) {
      if (a.size !== b.size) {
        return false
      }

      let iter = a.entries()

      i = iter.next()
      while (i.done !== true) {
        if (b.has(i.value[ 0 ]) !== true) {
          return false
        }
        i = iter.next()
      }

      iter = a.entries()
      i = iter.next()
      while (i.done !== true) {
        if (isDeepEqual(i.value[ 1 ], b.get(i.value[ 0 ])) !== true) {
          return false
        }
        i = iter.next()
      }

      return true
    }

    if (a.constructor === Set) {
      if (a.size !== b.size) {
        return false
      }

      const iter = a.entries()

      i = iter.next()
      while (i.done !== true) {
        if (b.has(i.value[ 0 ]) !== true) {
          return false
        }
        i = iter.next()
      }

      return true
    }

    if (a.buffer != null && a.buffer.constructor === ArrayBuffer) {
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

// not perfect, but what we ARE interested is for Arrays not to slip in
// as spread operator will mess things up in various areas
export function isObject (v) {
  return v !== null && typeof v === 'object' && Array.isArray(v) !== true
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

export default {
  deepEqual: isDeepEqual,
  object: isObject,
  date: isDate,
  regexp: isRegexp,
  number: isNumber
}
