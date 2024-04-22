export default function () {
  let cache = Object.create(null)

  return {
    getCache: __QUASAR_SSR_SERVER__
      ? (_, defaultValue) => (
          typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue
        )
      : (key, defaultValue) => (
          cache[ key ] === void 0
            ? (
                cache[ key ] = (
                  typeof defaultValue === 'function'
                    ? defaultValue()
                    : defaultValue
                )
              )
            : cache[ key ]
        ),

    setCache (key, obj) {
      cache[ key ] = obj
    },

    hasCache (key) {
      return Object.hasOwnProperty.call(cache, key)
    },

    clearCache (key) {
      if (key !== void 0) {
        delete cache[ key ]
      }
      else {
        cache = Object.create(null)
      }
    }
  }
}
