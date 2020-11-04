import { isSSR } from '../plugins/Platform.js'

export default function cache (vm, key, obj) {
  if (isSSR === true) return obj

  const k = `__qcache_${key}`
  return vm[k] === void 0
    ? (vm[k] = obj)
    : vm[k]
}

export function cacheWithFn (vm, key, fn) {
  if (isSSR === true) return fn()

  const k = `__qcache_${key}`
  return vm[k] === void 0
    ? (vm[k] = fn())
    : vm[k]
}

export function getPropCacheMixin (propName, proxyPropName) {
  return {
    data () {
      const target = {}
      const source = this[propName]

      for (const prop in source) {
        target[prop] = source[prop]
      }

      return { [proxyPropName]: target }
    },

    watch: {
      [propName] (newObj, oldObj) {
        const target = this[proxyPropName]

        if (oldObj !== void 0) {
          // we first delete obsolete events
          for (const prop in oldObj) {
            if (newObj[prop] === void 0) {
              this.$delete(target, prop)
            }
          }
        }

        for (const prop in newObj) {
          // we then update changed events
          if (target[prop] !== newObj[prop]) {
            this.$set(target, prop, newObj[prop])
          }
        }
      }
    }
  }
}
