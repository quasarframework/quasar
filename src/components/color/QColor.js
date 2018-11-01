import Vue from 'vue'

import QField from '../field/QField.js'
import QMenu from '../menu/QMenu.js'

export default Vue.extend({
  name: 'QColor',

  mixins: [ QField ],

  props: {
    value: {
      required: true
    }
  },

  methods: {
    __onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },

    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },

    __getControl (h) {
      return h('div', {
        staticClass: 'q-field__native row items-center',
        attrs: { tabindex: this.editable === true ? 0 : null },
        on: this.editable === true ? {
          focus: this.__onFocus,
          blur: this.__onBlur
        } : null
      }, this.value ? [
        h('div', {
          staticClass: 'q-color__cube',
          style: {
            backgroundColor: this.value
          }
        })
      ] : null)
    },

    __getPopup (h) {
    },

    __getDefaultSlot (h) {
      if (this.editable === false) { return }

      return h(QMenu, {
        ref: 'menu',
        props: {
          cover: true,
          autoClose: this.multiple !== true
        },
        on: {
          'before-show': this.__onFocus,
          'before-hide': this.__onBlur
        }
      }, this.__getPopup(h))
    }
  },

  created () {
    this.fieldClass = 'q-color'
  }
})
