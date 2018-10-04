import Vue from 'vue'

export default Vue.extend({
  name: 'QUploader',

  render (h) {
    return h('div', this.$slots.default)
  }
})
