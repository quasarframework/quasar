export default {
  name: 'QToolbarTitle',
  props: {
    shrink: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'q-toolbar-title',
      'class': this.shrink ? 'col-auto' : null
    }, [
      this.$slots.default,
      this.$slots.subtitle
        ? h('div', { staticClass: 'q-toolbar-subtitle' }, this.$slots.subtitle)
        : null
    ])
  }
}
