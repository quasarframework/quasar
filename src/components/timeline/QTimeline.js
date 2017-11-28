export default {
  name: 'q-timeline',
  provide () {
    return {
      __timeline: this
    }
  },
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  },
  render (h) {
    return h('ul', {
      staticClass: 'q-timeline'
    }, [
      this.$slots.default
    ])
  }
}
