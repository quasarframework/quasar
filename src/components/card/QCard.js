export default {
  name: 'QCard',
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean,
    color: String,
    textColor: String
  },
  computed: {
    classes () {
      const cls = [{
        'no-border-radius': this.square,
        'no-shadow': this.flat,
        'inline-block': this.inline
      }]

      if (this.color) {
        cls.push(`bg-${this.color}`)
        cls.push(`q-card-dark`)
        cls.push(`text-${this.textColor || 'white'}`)
      }
      else if (this.textColor) {
        cls.push(`text-${this.textColor}`)
      }

      return cls
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card',
      'class': this.classes
    }, this.$slots.default)
  }
}
