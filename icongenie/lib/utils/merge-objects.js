module.exports = function mergeObjects () {
  const base = {}

  for (var i = 0; i < arguments.length; i++) {
    const obj = arguments[i]

    Object.keys(obj).forEach(key => {
      if (obj[key] !== void 0) {
        base[key] = obj[key]
      }
    })
  }

  return base
}
