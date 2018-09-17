export default {
  name: 'QSeparator',
  props: {
    dark: Boolean,
    inset: Boolean,
    vertical: Boolean,
    color: String
  },
  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        'q-separator--dark': this.dark,
        'q-separator--inline': this.inline,
        'q-separator--inset': this.inset,
        [`q-separator--${this.vertical ? 'vertical self-stretch' : 'horizontal col-grow'}`]: true
      }
    }
  },
  render (h) {
    return h('hr', {
      staticClass: 'q-separator',
      'class': this.classes
    })
  }
}
