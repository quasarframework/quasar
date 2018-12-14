import Vue from 'vue'

export default Vue.extend({
  name: 'QBar',

  props: {
    dense: Boolean,
    dark: Boolean
  },

  computed: {
    classes () {
      return `q-bar--${this.dense ? 'dense' : 'standard'} q-bar--${this.dark ? 'dark' : 'light'}`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-bar row no-wrap items-center',
      class: this.classes
    }, this.$slots.default)
  }
})
