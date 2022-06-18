export default function () {
  const cache = new Map()

  return {
    getCache: __QUASAR_SSR_SERVER__
      ? function (_, obj) { return obj }
      : function (key, obj) {
        return cache[ key ] === void 0
          ? (cache[ key ] = obj)
          : cache[ key ]
      },

    getCacheWithFn: __QUASAR_SSR_SERVER__
      ? function (_, fn) { return fn() }
      : function (key, fn) {
        return cache[ key ] === void 0
          ? (cache[ key ] = fn())
          : cache[ key ]
      }
  }
}
