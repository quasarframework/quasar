import Vue from 'vue'
export default Vue.extend({
  name: 'QSelect',

  render (h) {
    return h('div', this.$slots.default)
  }
})
