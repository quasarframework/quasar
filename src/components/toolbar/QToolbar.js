import Vue from 'vue'
export default Vue.extend({
  name: 'QToolbar',

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center relative-position'
    }, this.$slots.default)
  }
})
