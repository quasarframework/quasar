import Vue from 'vue'

export default Vue.extend({
  name: 'QContextMenu',

  render (h) {
    return h('div', this.$slots.default)
  }
})
