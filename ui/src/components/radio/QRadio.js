import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { stopAndPrevent } from '../../utils/event.js'
import { slot, mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QRadio',

  mixins: [ DarkMixin ],

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
      if (this.isTrue === true) {
        return 'q-radio__inner--active' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.keepColor === true && this.color !== void 0) {
        return 'text-' + this.color
      }
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    set (e) {
      e !== void 0 && stopAndPrevent(e)
      if (this.disable !== true && this.isTrue !== true) {
        this.$emit('input', this.val)
      }
    }
  },

  render (h) {
    const content = [
      h('div', {
        staticClass: 'q-radio__bg absolute'
      }, [
        h('div', { staticClass: 'q-radio__outer-circle absolute-full' }),
        h('div', { staticClass: 'q-radio__inner-circle absolute-full' })
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
        class: this.innerClass
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
