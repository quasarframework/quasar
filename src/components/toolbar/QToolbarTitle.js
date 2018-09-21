export default {
  name: 'QToolbarTitle',
  props: {
    shrink: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'q-toolbar__title text-h6 ellipsis',
      'class': this.shrink ? 'col-auto' : null
    }, [
      this.$slots.default,
      this.$slots.subtitle
        ? h('div', { staticClass: 'q-toolbar__subtitle text-subtitle2 ellipsis' }, this.$slots.subtitle)
        : null
    ])
  }
}
