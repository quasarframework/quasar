import { computed } from 'vue'

const listenerRE = /^on[A-Z]/
const nonAttrsRE = /(^on[A-Z]|^class$|^style$)/

// TODO vue3 - verify reactivity
export default function (attrs) {
  return {
    qAttrs: computed(() => {
      const acc = {}

      Object.keys(attrs).forEach(key => {
        if (nonAttrsRE.test(key) === false) {
          acc[ key ] = this.$attrs[ key ]
        }
      })

      return acc
    }),

    qListeners: computed(() => {
      const acc = {}

      Object.keys(attrs).forEach(key => {
        if (listenerRE.test(key) === true) {
          acc[ key ] = this.$attrs[ key ]
        }
      })

      return acc
    })
  }
}
