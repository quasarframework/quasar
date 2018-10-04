import Vue from 'vue'

export default Vue.extend({
  name: 'QEditor',

  render (h) {
    return h('div', this.$slots.default)
  }
})
