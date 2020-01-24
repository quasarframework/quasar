import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import OptionSizeMixin from '../../mixins/option-size.js'

import { stopAndPrevent } from '../../utils/event.js'
import { slot, mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QRadio',

  mixins: [ DarkMixin, OptionSizeMixin ],

  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  computed: {
    isTrue () {
      return this.value === this.val
    },

    classes () {
      return {
        'disabled': this.disable,
        'q-radio--dark': this.isDark,
        'q-radio--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      const color = this.color !== void 0 && (
        this.keepColor === true ||
        this.isTrue === true
      )
        ? ` text-${this.color}`
        : ''

      return `q-radio__inner--${this.isTrue === true ? 'truthy' : 'falsy'}${color}`
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    set (e) {
      if (e !== void 0) {
        stopAndPrevent(e)
        document.activeElement !== null && document.activeElement.blur()
      }

      if (this.disable !== true && this.isTrue !== true) {
        this.$emit('input', this.val)
      }
    }
  },

  render (h) {
    const content = [
      h('svg', {
        staticClass: 'q-radio__bg absolute',
        attrs: { focusable: 'false' /* needed for IE11 */, viewBox: '0 0 24 24' }
      }, [
        h('path', {
          attrs: {
            d: 'M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12'
          }
        }),

        h('path', {
          staticClass: 'q-radio__check',
          attrs: {
            d: 'M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6'
          }
        })
      ])
    ]

    this.disable !== true && content.unshift(
      h('input', {
        staticClass: 'q-radio__native q-ma-none q-pa-none invisible',
        attrs: { type: 'radio' }
      })
    )

    const child = [
      h('div', {
        staticClass: 'q-radio__inner relative-position no-pointer-events',
        class: this.innerClass,
        style: this.sizeStyle
      }, content)
    ]

    const label = this.label !== void 0
      ? mergeSlot([ this.label ], this, 'default')
      : slot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        staticClass: 'q-radio__label q-anchor--skip'
      }, label)
    )

    return h('div', {
      staticClass: 'q-radio cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: cache(this, 'inpExt', {
        click: this.set,
        keydown: e => {
          if (e.keyCode === 13 || e.keyCode === 32) {
            stopAndPrevent(e)
          }
        },
        keyup: e => {
          if (e.keyCode === 13 || e.keyCode === 32) {
            this.set(e)
          }
        }
      })
    }, child)
  }
})
