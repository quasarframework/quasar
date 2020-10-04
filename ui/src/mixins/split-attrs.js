const listenerRE = /^on[A-Z]/

export default {
  computed: {
    qSplit () {
      const acc = {
        attrs: {},
        listeners: {}
      }

      Object.keys(this.$attrs).forEach(key => {
        const group = listenerRE.test(key) === true
          ? 'listeners' : 'attrs'

        acc[group][key] = this.$attrs[key]
      })

      return acc
    }
  }
}