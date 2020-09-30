import { isSSR } from '../plugins/Platform.js'

export default {
  created () {
    this.__qCache = {}
  },

  methods: {
    __getCache: isSSR === true
      ? function (_, obj) { return obj }
      : function (key, obj) {
        return this.__qCache[key] === void 0
          ? (this.__qCache[key] = obj)
          : this.__qCache[key]
      },

    __getCacheWithFn: isSSR === true
      ? function (_, fn) { return fn() }
      : function (key, fn) {
        return this.__qCache[key] === void 0
          ? (this.__qCache[key] = fn())
          : this.__qCache[key]
      }
  }
}
