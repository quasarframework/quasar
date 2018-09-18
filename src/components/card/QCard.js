export default {
  name: 'QCard',
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean
  },
  computed: {
    classes () {
      return {
        'no-border-radius': this.square,
        'no-shadow': this.flat,
        'inline-block': this.inline
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card generic-border-radius',
      'class': this.classes
    }, this.$slots.default)
  }
}
