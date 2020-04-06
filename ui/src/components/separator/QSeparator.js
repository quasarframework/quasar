import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'

export default Vue.extend({
  name: 'QSeparator',

  mixins: [ DarkMixin ],

  props: {
    spaced: Boolean,
    inset: [Boolean, String],
    vertical: Boolean,
    color: String
  },

  computed: {
    insetClass () {
      switch (this.inset) {
        case true:
          return ' q-separator--inset'
        case 'item':
          return ' q-separator--item-inset'
        case 'item-thumbnail':
          return ' q-separator--item-thumbnail-inset'
        default:
          return ''
      }
    },

    classes () {
      return 'q-separator' + this.insetClass +
        ` q-separator--${this.vertical === true ? 'vertical self-stretch' : 'horizontal col-grow'}` +
        (this.color !== void 0 ? ` bg-${this.color}` : '') +
        (this.isDark === true ? ' q-separator--dark' : '') +
        (this.spaced === true ? ' q-separator--spaced' : '')
    },

    attrs () {
      return {
        role: 'separator',
        'aria-orientation': this.vertical === true ? 'vertical' : 'horizontal'
      }
    }
  },

  render (h) {
    return h('hr', {
      staticClass: 'q-separator',
      class: this.classes,
      attrs: this.attrs,
      on: this.$listeners
    })
  }
})
