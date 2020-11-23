import { h } from 'vue'

import DarkMixin from './dark.js'
import { stopAndPrevent } from '../utils/event.js'

import FormMixin from './form.js'
import OptionSizeMixin from './option-size.js'
import RefocusTargetMixin from './refocus-target.js'

import { hSlot, hMergeSlot } from '../utils/render.js'

export default {
  mixins: [ DarkMixin, OptionSizeMixin, FormMixin, RefocusTargetMixin ],

  props: {
    modelValue: {
      required: true,
      default: null
    },
    val: {},

    trueValue: { default: true },
    falseValue: { default: false },
    indeterminateValue: { default: null },

    toggleOrder: {
      type: String,
      validator: v => v === 'tf' || v === 'ft'
    },
    toggleIndeterminate: Boolean,

    label: String,
    leftLabel: Boolean,
    fontSize: String,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  emits: [ 'update:modelValue' ],

  computed: {
    isTrue () {
      return this.modelIsArray === true
        ? this.index > -1
        : this.modelValue === this.trueValue
    },

    isFalse () {
      return this.modelIsArray === true
        ? this.index === -1
        : this.modelValue === this.falseValue
    },

    isIndeterminate () {
      return this.isTrue === false && this.isFalse === false
    },

    index () {
      if (this.modelIsArray === true) {
        return this.modelValue.indexOf(this.val)
      }
    },

    modelIsArray () {
      return this.val !== void 0 && Array.isArray(this.modelValue)
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

      return `q-${this.type}__inner relative-position non-selectable q-${this.type}__inner--${state}${color}`
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
          : (this.isTrue === true ? 'true' : 'false')
      }

      if (this.disable === true) {
        attrs['aria-disabled'] = 'true'
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

      if (this.disable !== true) {
        this.$emit('update:modelValue', this.__getNextValue(), e)
      }
    },

    __getNextValue () {
      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          const val = this.modelValue.slice()
          val.splice(this.index, 1)
          return val
        }

        return this.modelValue.concat([ this.val ])
      }

      if (this.isTrue === true) {
        if (this.toggleOrder !== 'ft' || this.toggleIndeterminate === false) {
          return this.falseValue
        }
      }
      else if (this.isFalse === true) {
        if (this.toggleOrder === 'ft' || this.toggleIndeterminate === false) {
          return this.trueValue
        }
      }
      else {
        return this.toggleOrder !== 'ft'
          ? this.trueValue
          : this.falseValue
      }

      return this.indeterminateValue
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

  render () {
    const inner = this.__getInner()

    this.disable !== true && this.__injectFormInput(
      inner,
      'unshift',
      ` q-${this.type}__native absolute q-ma-none q-pa-none`
    )

    const child = [
      h('div', {
        class: this.innerClass,
        style: this.sizeStyle
      }, inner)
    ]

    if (this.__refocusTargetEl !== void 0) {
      child.push(this.__refocusTargetEl)
    }

    const label = this.label !== void 0
      ? hMergeSlot(this, 'default', [ this.label ])
      : hSlot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        class: `q-${this.type}__label q-anchor--skip`
      }, label)
    )

    return h('div', {
      class: this.classes,
      ...this.attrs,
      onClick: this.toggle,
      onKeydown: this.__onKeydown,
      onKeyup: this.__onKeyup
    }, child)
  }
}
