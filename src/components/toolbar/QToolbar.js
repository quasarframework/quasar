import Vue from 'vue'

export default Vue.extend({
  name: 'QToolbar',

  props: {
    inset: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center relative-position',
      class: this.inset ? 'q-toolbar--inset' : null
    }, this.$slots.default)
  }
})
