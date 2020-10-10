const listenerRE = /^on[A-Z]/
const nonAttrsRE = /(^on[A-Z]|^class$|^style$)/

export default {
  computed: {
    qAttrs () {
      const acc = {}

      Object.keys(this.$attrs).forEach(key => {
        if (nonAttrsRE.test(key) === false) {
          acc[key] = this.$attrs[key]
        }
      })

      return acc
    },

    qListeners () {
      const acc = {}

      Object.keys(this.$attrs).forEach(key => {
        if (listenerRE.test(key) === true) {
          acc[key] = this.$attrs[key]
        }
      })

      return acc
    }
  }
}
