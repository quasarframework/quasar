import Vue from 'vue'

export default Vue.extend({
  name: 'QTr',

  props: {
    props: Object
  },

  render (h) {
    return h(
      'tr',
      !this.props || this.props.header
        ? {}
        : { class: this.props.__trClass },
      this.$slots.default
    )
  }
})
