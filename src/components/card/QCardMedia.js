export default {
  name: 'QCardMedia',
  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'bottom', 'full'].includes(v)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card-media relative-position'
    }, [
      this.$slots.default,
      this.$slots.overlay
        ? h('div', {
          staticClass: 'q-card-media-overlay',
          'class': `absolute-${this.overlayPosition}`
        }, [
          this.$slots.overlay
        ])
        : null
    ])
  }
}
