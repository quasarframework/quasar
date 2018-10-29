export function isDeepEqual (a, b) {
  if (a === b) {
    return true
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (a !== Object(a) || b !== Object(b)) {
    return false
  }

  const props = Object.keys(a)

  if (props.length !== Object.keys(b).length) {
    return false
  }

  return props.every(prop => isDeepEqual(a[prop], b[prop]))
}

export function isPrintableChar (v) {
  return (v > 47 && v < 58) || // number keys
    v === 32 || v === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (v > 64 && v < 91) || // letter keys
    (v > 95 && v < 112) || // numpad keys
    (v > 185 && v < 193) || // ;=,-./` (in order)
    (v > 218 && v < 223)
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
