export default {
  name: 'q-tr',
  props: {
    props: Object
  },
  render (h) {
    return h('tr',
      !this.props || this.props.header ? {} : { 'class': this.props.__trClass },
      [ this.$slots.default ]
    )
  }
}
