import Vue from 'vue'

export default Vue.extend({
  name: 'QTabPane',

  props: {
    name: {
      type: String,
      required: true
    },
    disable: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'q-tab-pane',
      attrs: { role: 'tabpanel' }
    }, this.$slots.default)
  }
})
