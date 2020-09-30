import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'
import OptionSizeMixin from '../../mixins/option-size.js'
import FormMixin from '../../mixins/form.js'
import RefocusTargetMixin from '../../mixins/refocus-target.js'

import { stopAndPrevent } from '../../utils/event.js'
import { slot, mergeSlot } from '../../utils/slot.js'

const svg = h('svg', {
  class: 'q-radio__bg absolute non-selectable',
  focusable: 'false' /* needed for IE11 */,
  viewBox: '0 0 24 24',
  'aria-hidden': 'true'
}, [
  h('path', {
    d: 'M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12'
  }),

  h('path', {
    class: 'q-radio__check',
    d: 'M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6'
  })
])

export default defineComponent({
  name: 'QRadio',

  mixins: [ DarkMixin, OptionSizeMixin, FormMixin, RefocusTargetMixin ],

  props: {
    modelValue: {
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

  emits: [ 'update:modelValue' ],

  computed: {
    isTrue () {
      return this.modelValue === this.val
    },

    classes () {
      return 'q-radio cursor-pointer no-outline row inline no-wrap items-center' +
        (this.disable === true ? ' disabled' : '') +
        (this.isDark === true ? ' q-radio--dark' : '') +
        (this.dense === true ? ' q-radio--dense' : '') +
        (this.leftLabel === true ? ' reverse' : '')
    },

    innerClass () {
      const color = this.color !== void 0 && (
        this.keepColor === true ||
        this.isTrue === true
      )
        ? ` text-${this.color}`
        : ''

      return `q-radio__inner relative-position ` +
        `q-radio__inner--${this.isTrue === true ? 'truthy' : 'falsy'}${color}`
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    },

    formAttrs () {
      const prop = { type: 'radio' }

      this.name !== void 0 && Object.assign(prop, {
        name: this.name,
        value: this.val
      })

      return prop
    },

    formDomProps () {
      if (this.name !== void 0 && this.isTrue === true) {
        return { checked: true }
      }
    }
  },

  methods: {
    set (e) {
      if (e !== void 0) {
        stopAndPrevent(e)
        this.__refocusTarget(e)
      }

      if (this.disable !== true && this.isTrue !== true) {
        this.$emit('update:modelValue', this.val, e)
      }
    },

    __onKeydown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
      }
    },

    __onKeyup (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.set(e)
      }
    }
  },

  render () {
    const content = [ svg ]

    this.disable !== true && this.__injectFormInput(
      content,
      'unshift',
      ' q-radio__native q-ma-none q-pa-none'
    )

    const child = [
      h('div', {
        class: this.innerClass,
        style: this.sizeStyle
      }, content)
    ]

    if (this.__refocusTargetEl !== void 0) {
      child.push(this.__refocusTargetEl)
    }

    const label = this.label !== void 0
      ? mergeSlot([ this.label ], this, 'default')
      : slot(this, 'default')

    label !== void 0 && child.push(
      h('div', {
        class: 'q-radio__label q-anchor--skip'
      }, label)
    )

    return h('div', {
      class: this.classes,
      tabindex: this.computedTabindex,
      role: 'radio',
      'aria-label': this.label,
      'aria-checked': this.isTrue === true ? 'true' : 'false',
      'aria-disabled': this.disable === true ? 'true' : void 0,
      onClick: this.set,
      onKeydown: this.__onKeydown,
      onKeyup: this.__onKeyup
    }, child)
  }
})
