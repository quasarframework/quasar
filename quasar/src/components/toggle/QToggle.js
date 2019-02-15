import Vue from 'vue'

import CheckboxMixin from '../../mixins/checkbox.js'
import QIcon from '../icon/QIcon.js'
import slot from '../../utils/slot.js'

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
        'q-toggle--dark': this.dark,
        'q-toggle--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      const color = 'text-' + this.color

      if (this.isTrue) {
        return `q-toggle__inner--active${this.color ? ' ' + color : ''}`
      }
      else if (this.keepColor && this.color) {
        return color
      }
    },

    computedIcon () {
      return (this.isTrue ? this.checkedIcon : this.uncheckedIcon) || this.icon
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-toggle cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.toggle,
        keydown: this.__keyDown
      }
    }, [
      h('div', {
        staticClass: 'q-toggle__inner relative-position',
        class: this.innerClass
      }, [
        this.disable ? null : h('input', {
          staticClass: 'q-toggle__native absolute q-ma-none q-pa-none invisible',
          attrs: { type: 'toggle' },
          on: { change: this.toggle }
        }),

        h('div', { staticClass: 'q-toggle__track' }),
        h('div', { staticClass: 'q-toggle__thumb-container absolute' }, [
          h('div', {
            staticClass: 'q-toggle__thumb row flex-center'
          }, this.computedIcon !== void 0
            ? [ h(QIcon, { props: { name: this.computedIcon } }) ]
            : null
          )
        ])
      ]),

      h('div', {
        staticClass: 'q-toggle__label q-anchor--skip'
      }, (this.label !== void 0 ? [ this.label ] : []).concat(slot(this, 'default')))
    ])
  }
})
