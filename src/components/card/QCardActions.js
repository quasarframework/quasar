export default {
  name: 'QCardActions',
  props: {
    vertical: Boolean,
    align: {
      type: String,
      default: 'start',
      validator: v => ['start', 'center', 'end', 'around', 'between'].includes(v)
    }
  },
  computed: {
    classes () {
      return `q-card-actions-${this.vertical ? 'vert column justify-start' : 'horiz row'} ` +
        `${this.vertical ? 'items' : 'justify'}-${this.align}`
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card-actions',
      'class': this.classes
    }, this.$slots.default)
  }
}
