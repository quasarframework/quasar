export default {
  name: 'QBtnGroup',
  props: {
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    stretch: Boolean
  },
  computed: {
    classes () {
      return ['outline', 'flat', 'rounded', 'push', 'stretch']
        .filter(t => this[t])
        .map(t => `q-btn-group--${t}`).join(' ')
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-btn-group row no-wrap inline',
      'class': this.classes
    }, this.$slots.default)
  }
}
