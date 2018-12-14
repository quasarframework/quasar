import Vue from 'vue'

export default Vue.extend({
  name: 'QList',

  props: {
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    dark: Boolean,
    padding: Boolean
  },

  computed: {
    classes () {
      return {
        'q-list--bordered': this.bordered,
        'q-list--dense': this.dense,
        'q-list--separator': this.separator,
        'q-list--dark': this.dark,
        'q-list--padding': this.padding
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-list',
      class: this.classes
    }, this.$slots.default)
  }
})
