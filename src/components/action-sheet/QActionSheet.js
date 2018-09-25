import Vue from 'vue'
export default Vue.extend({
  name: 'QActionSheet',

  render (h) {
    return h('div', this.$slots.default)
  }
})
