export default function useRenderCache() {
  if (__QUASAR_SSR_SERVER__) {
    return {
      getCache: (_, defaultValue) =>
        typeof defaultValue === 'function' ? defaultValue() : defaultValue,
      setCache() {},
      hasCache: () => false,
      clearCache() {}
    }
  }

  let cache = Object.create(null)

  return {
    getCache: (key, defaultValue) =>
      Object.hasOwn(cache, key)
        ? cache[key]
        : (cache[key] =
            typeof defaultValue === 'function' ? defaultValue() : defaultValue),

    setCache(key, obj) {
      cache[key] = obj
    },

    hasCache(key) {
      return Object.hasOwn(cache, key)
    },

    clearCache(key) {
      if (key !== void 0) {
        delete cache[key]
      } else {
        cache = Object.create(null)
      }
    }
  }
}
