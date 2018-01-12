export default {
  name: 'q-toolbar-title',
  render (h) {
    return h('div', {
      staticClass: 'q-toolbar-title'
    }, [
      this.$slots.default,
      this.$slots.subtitle
        ? h('div', { staticClass: 'q-toolbar-subtitle' }, this.$slots.subtitle)
        : null
    ])
  }
}
