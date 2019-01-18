import Vue from 'vue'

export default Vue.extend({
  name: 'QBtnGroup',

  props: {
    unelevated: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    stretch: Boolean,
    glossy: Boolean
  },

  computed: {
    classes () {
      return ['unelevated', 'outline', 'flat', 'rounded', 'push', 'stretch', 'glossy']
        .filter(t => this[t] === true)
        .map(t => `q-btn-group--${t}`).join(' ')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-btn-group row no-wrap inline',
      class: this.classes
    }, this.$slots.default)
  }
})
