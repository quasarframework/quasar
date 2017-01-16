export default {
  props: {
    collapsibleAccordion: {
      type: Boolean,
      default: true
    }
  },
  render (h, context) {
    return h(
      'div',
      {
        class: {
          'q-collapsible-accordion': true
        }
      },
      this.$slots.default
    )
  }
}
