export default {
  name: 'q-toolbar',
  props: {
    color: String,
    inverted: Boolean,
    glossy: Boolean
  },
  computed: {
    classes () {
      return [
        `q-toolbar-${this.inverted ? 'inverted' : 'normal'}`,
        this.color ? ` ${this.inverted ? 'text' : 'bg'}-${this.color}` : '',
        this.glossy ? 'glossy' : ''
      ]
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
