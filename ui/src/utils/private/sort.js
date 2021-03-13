export function sortString (a, b) {
  if (typeof a !== 'string') {
    throw new TypeError('The value for sorting must be a String')
  }
  return a.localeCompare(b)
}

export function sortNumber (a, b) {
  return a - b
}

export function sortDate (a, b) {
  return (new Date(a)) - (new Date(b))
}

export function sortBoolean (a, b) {
  return a && !b
    ? -1
    : (!a && b ? 1 : 0)
}
