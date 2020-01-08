import Vue from 'vue'

import CheckboxMixin from '../../mixins/checkbox.js'

import { slot, mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QCheckbox',

  mixins: [ CheckboxMixin ],

  props: {
    toggleIndeterminate: Boolean,
    indeterminateValue: { default: null }
  },

  computed: {
    isIndeterminate () {
      return this.value === void 0 || this.value === this.indeterminateValue
    },

    classes () {
      return {
        'disabled': this.disable,
        'q-checkbox--dark': this.isDark,
        'q-checkbox--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      if (this.isTrue === true) {
        return 'q-checkbox__inner--active' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.isIndeterminate === true) {
        return 'q-checkbox__inner--indeterminate' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.keepColor === true && this.color !== void 0) {
        return 'text-' + this.color
      }
    }
  },

  render (h) {
    const content = [
      h('div', {
        staticClass: 'q-checkbox__bg absolute'
      }, [
        h('svg', {
          staticClass: 'q-checkbox__check fit absolute-full',
          attrs: { focusable: 'false' /* needed for IE11 */, viewBox: '0 0 24 24' }
        }, [
          h('path', {
            attrs: {
              fill: 'none',
              d: 'M1.73,12.91 8.1,19.28 22.79,4.59'
            }
          })
        ]),

        h('div', { staticClass: 'q-checkbox__check-indet absolute' })
      ])
    ]

    this.disable !== true && content.unshift(
      h('input', {
        staticClass: 'q-checkbox__native q-ma-none q-pa-none invisible',
        attrs: { type: 'checkbox' }
      })
    )

    const child = [
      h('div', {
        staticClass: 'q-checkbox__inner relative-position no-pointer-events',
        class: this.innerClass
      }, content)
    ]

    const label = this.label !== void 0
      ? mergeSlot([ this.label ], this, 'default')
      : slot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        staticClass: 'q-checkbox__label q-anchor--skip'
      }, label)
    )

    return h('div', {
      staticClass: 'q-checkbox cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: cache(this, 'inpExt', {
        click: this.toggle,
        keydown: this.__onKeydown,
        keyup: this.__onKeyup
      })
    }, child)
  }
})
