import Vue from 'vue'

export default Vue.extend({
  name: 'QTr',

  props: {
    props: Object
  },

  render (h) {
    return h(
      'tr',
      this.props === void 0 || this.props.header === true
        ? {}
        : { class: this.props.__trClass },
      this.$slots.default
    )
  }
})
