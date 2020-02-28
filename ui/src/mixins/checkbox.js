import DarkMixin from './dark.js'
import { stopAndPrevent } from '../utils/event.js'

import FormMixin from './form.js'
import OptionSizeMixin from './option-size.js'
import RefocusTargetMixin from './refocus-target.js'

import { slot, mergeSlot } from '../utils/slot.js'
import { cache } from '../utils/vm.js'

export default {
  mixins: [ DarkMixin, OptionSizeMixin, FormMixin, RefocusTargetMixin ],

  props: {
    value: {
      required: true,
      default: null
    },
    val: {},

    trueValue: { default: true },
    falseValue: { default: false },

    toggleIndeterminate: Boolean,
    indeterminateValue: { default: null },

    label: String,
    leftLabel: Boolean,
    fontSize: String,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  computed: {
    isTrue () {
      return this.modelIsArray === true
        ? this.index > -1
        : this.value === this.trueValue
    },

    isFalse () {
      return this.modelIsArray === true
        ? this.index === -1
        : this.value === this.falseValue
    },

    isIndeterminate () {
      return this.value === this.indeterminateValue &&
        this.value !== this.falseValue
    },

    index () {
      if (this.modelIsArray === true) {
        return this.value.indexOf(this.val)
      }
    },

    modelIsArray () {
      return this.val !== void 0 && Array.isArray(this.value)
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    },

    labelStyle () {
      if (this.fontSize !== void 0) {
        return { fontSize: this.fontSize }
      }
    },

    classes () {
      return `q-${this.type} cursor-pointer no-outline row inline no-wrap items-center` +
        (this.disable === true ? ' disabled' : '') +
        (this.isDark === true ? ` q-${this.type}--dark` : '') +
        (this.dense === true ? ` q-${this.type}--dense` : '') +
        (this.leftLabel === true ? ' reverse' : '')
    },

    innerClass () {
      const state = this.isTrue === true ? 'truthy' : (this.isFalse === true ? 'falsy' : 'indet')
      const color = this.color !== void 0 && (
        this.keepColor === true ||
        (this.type === 'toggle' ? this.isTrue === true : this.isFalse !== true)
      )
        ? ` text-${this.color}`
        : ''

      return `q-${this.type}__inner--${state}${color}`
    },

    formAttrs () {
      const prop = { type: 'checkbox' }

      this.name !== void 0 && Object.assign(prop, {
        checked: this.isTrue,
        name: this.name,
        value: this.modelIsArray === true
          ? this.val
          : this.trueValue
      })

      return prop
    },

    attrs () {
      const attrs = {
        tabindex: this.computedTabindex,
        role: 'checkbox',
        'aria-label': this.label,
        'aria-checked': this.isIndeterminate === true
          ? 'mixed'
          : this.isTrue === true ? 'true' : 'false'
      }

      if (this.disable === true) {
        attrs['aria-disabled'] = ''
      }

      return attrs
    }
  },

  methods: {
    toggle (e) {
      if (e !== void 0) {
        stopAndPrevent(e)
        this.__refocusTarget(e)
      }

      if (this.disable === true) {
        return
      }

      let val

      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          val = this.value.slice()
          val.splice(this.index, 1)
        }
        else {
          val = this.value.concat([ this.val ])
        }
      }
      else if (this.isTrue === true) {
        val = this.toggleIndeterminate === true
          ? this.indeterminateValue
          : this.falseValue
      }
      else if (this.isFalse === true) {
        val = this.trueValue
      }
      else {
        val = this.falseValue
      }

      this.$emit('input', val)
    },

    __onKeydown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
      }
    },

    __onKeyup (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.toggle(e)
      }
    }
  },

  render (h) {
    const inner = this.__getInner(h)

    this.disable !== true && this.__injectFormInput(
      inner,
      'unshift',
      `q-${this.type}__native absolute q-ma-none q-pa-none invisible`
    )

    const child = [
      h('div', {
        staticClass: `q-${this.type}__inner relative-position no-pointer-events`,
        class: this.innerClass,
        style: this.sizeStyle
      }, inner)
    ]

    if (this.__refocusTargetEl !== void 0) {
      child.push(this.__refocusTargetEl)
    }

    const label = this.label !== void 0
      ? mergeSlot([ this.label ], this, 'default')
      : slot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        staticClass: `q-${this.type}__label q-anchor--skip`
      }, label)
    )

    return h('div', {
      class: this.classes,
      attrs: this.attrs,
      on: cache(this, 'inpExt', {
        click: this.toggle,
        keydown: this.__onKeydown,
        keyup: this.__onKeyup
      })
    }, child)
  }
}
