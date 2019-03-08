import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QRadio',

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
    dark: Boolean,
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
        'q-radio--dark': this.dark,
        'q-radio--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      if (this.isTrue) {
        return `q-radio__inner--active${this.color ? ' text-' + this.color : ''}`
      }
      else if (this.keepColor) {
        return 'text-' + this.color
      }
    },

    computedTabindex () {
      return this.disable ? -1 : this.tabindex || 0
    }
  },

  methods: {
    set (e) {
      if (!this.disable && !this.isTrue) {
        e !== void 0 && stopAndPrevent(e)
        this.$emit('input', this.val)
      }
    },

    __keyDown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
        this.set()
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-radio cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.set,
        keydown: this.__keyDown
      }
    }, [
      h('div', {
        staticClass: 'q-radio__inner relative-position',
        class: this.innerClass
      }, [
        this.disable !== true
          ? h('input', {
            staticClass: 'q-radio__native q-ma-none q-pa-none invisible',
            attrs: { type: 'checkbox' },
            on: { change: this.set }
          })
          : null,

        h('div', {
          staticClass: 'q-radio__bg absolute'
        }, [
          h('div', { staticClass: 'q-radio__outer-circle absolute-full' }),
          h('div', { staticClass: 'q-radio__inner-circle absolute-full' })
        ])
      ]),

      this.label !== void 0 || this.$scopedSlots.default !== void 0
        ? h('div', {
          staticClass: 'q-radio__label q-anchor--skip'
        }, (this.label !== void 0 ? [ this.label ] : []).concat(slot(this, 'default')))
        : null
    ])
  }
})
