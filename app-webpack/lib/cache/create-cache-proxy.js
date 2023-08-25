module.exports.createCacheProxy = function createCacheProxy (ctx) {
  const runtimeCache = {}
  const moduleCache = {}

  return {
    getRuntime: (key, getInitialValue) => {
      const value = runtimeCache[ key ]
      return value !== void 0
        ? value
        : (runtimeCache[ key ] = getInitialValue())
    },

    setRuntime: (key, value) => {
      runtimeCache[ key ] = value
    },

    getModule: key => {
      const value = moduleCache[ key ]
      if (value !== void 0) return value

      const { createInstance } = require(`./module.${ key }.js`)
      const newValue = createInstance(ctx)
      moduleCache[ key ] = newValue
      return newValue
    }
  }
}
