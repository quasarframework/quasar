
export default {
  name: 'q-app',
  render (h) {
    return h('div', { staticClass: 'q-app' }, [
      this.$slots.default
    ])
  }
}
