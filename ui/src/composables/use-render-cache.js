export default function () {
  let cache = {}

  return {
    getCache: __QUASAR_SSR_SERVER__
      ? (_, obj) => obj
      : (key, obj) => (
          cache[ key ] === void 0
            ? (cache[ key ] = obj)
            : cache[ key ]
        ),

    getCacheByFn: __QUASAR_SSR_SERVER__
      ? (_, fn) => fn()
      : (key, fn) => (
          cache[ key ] === void 0
            ? (cache[ key ] = fn())
            : cache[ key ]
        ),

    setCache (key, obj) {
      cache[ key ] = obj
    },

    clearCache (key) {
      if (key !== void 0) {
        delete cache[ key ]
      }
      else {
        cache = {}
      }
    }
  }
}
