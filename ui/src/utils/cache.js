import { isSSR } from '../plugins/Platform.js'

export default function cache (vm, key, obj) {
  if (isSSR === true) return obj

  const k = `__qcache_${key}`
  return vm[k] === void 0
    ? (vm[k] = obj)
    : vm[k]
}

export function getPropCacheMixin (propName, proxyPropName) {
  return {
    data () {
      return { [proxyPropName]: {} }
    },

    watch: {
      [propName]: {
        immediate: true,
        handler (newObj, oldObj) {
          if (oldObj !== void 0) {
            // we first delete obsolete keys
            for (const prop in oldObj) {
              if (newObj.hasOwnProperty(prop) !== true) {
                this.$delete(this[proxyPropName], prop)
              }
            }
          }

          for (const prop in newObj) {
            this.$set(this[proxyPropName], prop, newObj[prop])
          }
        }
      }
    }
  }
}
