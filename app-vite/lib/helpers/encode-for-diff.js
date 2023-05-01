
module.exports = function encodeCfg (obj) {
  return JSON.stringify(obj, (_, value) => {
    return typeof value === 'function'
      ? `/fn(${ value.toString() })`
      : (
          Object.prototype.toString.call(value) === '[object RegExp]'
            ? value.source
            : value
        )
  })
}
