const listenerRE = /^on[A-Z]/

export default {
  computed: {
    qAttrs () {
      const acc = {}

      Object.keys(this.$attrs).forEach(key => {
        if (listenerRE.test(key) === false) {
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