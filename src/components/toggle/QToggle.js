import CheckboxMixin from '../../mixins/checkbox.js'
import OptionMixin from '../../mixins/option.js'
import QIcon from '../icon/QIcon.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QToggle',

  mixins: [ CheckboxMixin, OptionMixin ],

  props: {
    icon: String
  },

  computed: {
    currentIcon () {
      return (this.isTrue ? this.checkedIcon : this.uncheckedIcon) || this.icon
    },

    iconColor () {
      return this.isTrue ? 'white' : 'dark'
    }
  },

  methods: {
    __swipe (evt) {
      if (evt.direction === 'left') {
        if (this.isTrue) {
          this.toggle()
        }
      }
      else if (evt.direction === 'right') {
        if (this.isFalse) {
          this.toggle()
        }
      }
    },

    __getContent (h) {
      return [
        h('div', { staticClass: 'q-toggle-base' }),
        h('div', { staticClass: 'q-toggle-handle row flex-center' }, [
          this.currentIcon
            ? h(QIcon, {
              staticClass: 'q-toggle-icon',
              props: { name: this.currentIcon, color: this.iconColor }
            })
            : null,
          h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
        ])
      ]
    }
  },

  beforeCreate () {
    this.__kebabTag = 'q-toggle'
  }
})
