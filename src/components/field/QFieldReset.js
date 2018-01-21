export default {
  name: 'q-field-reset',
  provide () {
    return {
      __field: undefined
    }
  },
  render (h) {
    return h('div', [
      this.$slots.default
    ])
  }
}
