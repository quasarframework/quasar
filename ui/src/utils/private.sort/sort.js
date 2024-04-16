export function sortDate (a, b) {
  return (new Date(a)) - (new Date(b))
}

export function sortBoolean (a, b) {
  return a && !b
    ? -1
    : (!a && b ? 1 : 0)
}
