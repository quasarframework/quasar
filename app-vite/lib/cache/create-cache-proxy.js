/**
 * @param {import('../../types/configuration/context').InternalQuasarContext} ctx
 *
 * @returns {import('../../types/configuration/context').CacheProxy}
 */
export function createCacheProxy(ctx) {
  const runtimeCache = {}
  const moduleCache = {}

  return {
    getRuntime: (key, getInitialValue) => {
      const value = runtimeCache[key]
      return value !== void 0 ? value : (runtimeCache[key] = getInitialValue())
    },

    getAsyncRuntime: async (key, getInitialValue) => {
      const value = runtimeCache[key]
      return value !== void 0
        ? value
        : (runtimeCache[key] = await getInitialValue())
    },

    setRuntime: (key, value) => {
      runtimeCache[key] = value
    },

    getModule: key => {
      const value = moduleCache[key]
      if (value !== void 0) return value

      // cache the in-flight promise too, so concurrent
      // calls do not instantiate the module twice
      const pendingModule = import(`./module.${key}.js`)
        .then(({ createInstance }) => createInstance(ctx))
        .then(val => {
          moduleCache[key] = val
          return val
        })
        .catch(err => {
          // a failure must not be cached (allows a retry)
          delete moduleCache[key]
          throw err
        })

      moduleCache[key] = pendingModule
      return pendingModule
    }
  }
}
