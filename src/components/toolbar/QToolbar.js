export default {
  name: 'q-toolbar',
  props: {
    color: String,
    textColor: String,
    inverted: Boolean,
    glossy: Boolean
  },
  computed: {
    classes () {
      const cls = [ `q-toolbar-${this.inverted ? 'inverted' : 'normal'}` ]

      this.glossy && cls.push('glossy')

      if (this.color) {
        if (this.inverted) {
          cls.push(`text-${this.textColor || this.color}`)
        }
        else {
          cls.push(`bg-${this.color}`)
          cls.push(`text-${this.textColor || 'white'}`)
        }
      }
      else if (this.textColor) {
        cls.push(`text-${this.textColor}`)
      }

      return cls
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center relative-position',
      'class': this.classes
    }, [
      this.$slots.default
    ])
  }
}
