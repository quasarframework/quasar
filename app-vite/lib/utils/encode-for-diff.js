export function encodeForDiff(obj) {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'function'
      ? `/fn(${value.toString()})`
      : Object.prototype.toString.call(value) === '[object RegExp]'
        ? value.source
        : value
  )
}
