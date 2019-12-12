import Vue from 'vue'

import CheckboxMixin from '../../mixins/checkbox.js'
import QIcon from '../icon/QIcon.js'
import { slot, mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QToggle',

  mixins: [ CheckboxMixin ],

  props: {
    icon: String,
    checkedIcon: String,
    uncheckedIcon: String
  },

  computed: {
    classes () {
      return {
        'disabled': this.disable,
        'q-toggle--dark': this.isDark,
        'q-toggle--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      if (this.isTrue === true) {
        return 'q-toggle__inner--active' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.keepColor === true && this.color !== void 0) {
        return 'text-' + this.color
      }
    },

    computedIcon () {
      return (this.isTrue === true ? this.checkedIcon : this.uncheckedIcon) || this.icon
    }
  },

  render (h) {
    const inner = [
      h('div', { staticClass: 'q-toggle__track' }),

      h('div', { staticClass: 'q-toggle__thumb-container absolute' }, [
        h('div', {
          staticClass: 'q-toggle__thumb row flex-center'
        }, this.computedIcon !== void 0
          ? [ h(QIcon, { props: { name: this.computedIcon } }) ]
          : void 0
        )
      ])
    ]

    this.disable !== true && inner.unshift(
      h('input', {
        staticClass: 'q-toggle__native absolute q-ma-none q-pa-none invisible',
        attrs: { type: 'checkbox' }
      })
    )

    const child = [
      h('div', {
        staticClass: 'q-toggle__inner relative-position no-pointer-events',
        class: this.innerClass
      }, inner)
    ]

    const label = this.label !== void 0
      ? mergeSlot([ this.label ], this, 'default')
      : slot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        staticClass: 'q-toggle__label q-anchor--skip'
      }, label)
    )

    return h('div', {
      staticClass: 'q-toggle cursor-pointer no-outline row inline no-wrap items-center',
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
