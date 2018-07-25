export default {
  name: 'QTimeline',
  provide () {
    return {
      __timeline: this
    }
  },
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean
  },
  render (h) {
    return h('ul', {
      staticClass: 'q-timeline',
      'class': { 'q-timeline-dark': this.dark }
    }, this.$slots.default)
  }
}
