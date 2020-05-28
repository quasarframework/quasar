import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import ListenersMixin from '../../mixins/listeners.js'

const insetMap = {
  true: 'inset',
  item: 'item-inset',
  'item-thumbnail': 'item-thumbnail-inset'
}

export default Vue.extend({
  name: 'QSeparator',

  mixins: [ DarkMixin, ListenersMixin ],

  props: {
    spaced: Boolean,
    inset: [ Boolean, String ],
    vertical: Boolean,
    color: String,
    size: String
  },

  computed: {
    orientation () {
      return this.vertical === true
        ? 'vertical'
        : 'horizontal'
    },

    classPrefix () {
      return ` q-separator--${this.orientation}`
    },

    insetClass () {
      return this.inset !== false
        ? `${this.classPrefix}-${insetMap[this.inset]}`
        : ''
    },

    classes () {
      return `q-separator${this.classPrefix}${this.insetClass}` +
        (this.spaced === true ? `${this.classPrefix}-spaced` : '') +
        (this.color !== void 0 ? ` bg-${this.color}` : '') +
        (this.isDark === true ? ' q-separator--dark' : '')
    },

    style () {
      if (this.size !== void 0) {
        return {
          [ this.vertical === true ? 'width' : 'height' ]: this.size
        }
      }
    },

    attrs () {
      return {
        role: 'separator',
        'aria-orientation': this.orientation
      }
    }
  },

  render (h) {
    return h('hr', {
      staticClass: 'q-separator',
      class: this.classes,
      style: this.style,
      attrs: this.attrs,
      on: { ...this.qListeners }
    })
  }
})
