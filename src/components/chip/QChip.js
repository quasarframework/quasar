import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple.js'
import { stopAndPrevent } from '../../utils/event.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QChip',

  directives: {
    Ripple
  },

  props: {
    dense: Boolean,

    icon: String,
    iconRight: String,
    label: String,

    color: String,
    textColor: String,

    value: {
      type: Boolean,
      default: true
    },
    selected: Boolean,

    floating: Boolean,
    pointing: {
      type: String,
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    square: Boolean,
    outline: Boolean,
    clickable: Boolean,
    closable: Boolean,

    tabindex: {
      type: Number,
      default: 0
    },

    disable: Boolean
  },

  computed: {
    classes () {
      const text = this.outline
        ? this.color || this.textColor
        : this.textColor

      return {
        [`bg-${this.color}`]: !this.outline && this.color,
        [`text-${text} q-chip--colored`]: text,
        disabled: this.disable,
        'q-chip--dense': this.dense || this.floating,
        'q-chip--outline': this.outline,
        'q-chip--floating': this.floating,
        'q-chip--selected': this.selected,
        'q-chip--clickable cursor-pointer non-selectable q-hoverable': this.isClickable,
        'q-chip--square': this.square || this.floating
      }
    },

    hasLeftIcon () {
      return this.selected || this.icon
    },

    isClickable () {
      return !this.disable && this.clickable
    },

    computedTabindex () {
      return this.disable ? -1 : this.tabindex
    }
  },

  methods: {
    __onKeyup (e) {
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    },

    __onClick (e) {
      if (!this.disable) {
        this.$emit('update:selected', !this.selected)
        this.$emit('click', e)
      }
    },

    __onClose (e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e)
        !this.disable && this.$emit('input', false)
      }
    },

    __getContent (h) {
      const child = []

      this.isClickable && child.push(h('div', { staticClass: 'q-focus-helper' }))

      if (this.pointing) {
        child.push(h('div', {
          staticClass: 'q-chip__pointer absolute',
          'class': {
            [`q-chip__pointer--${this.pointing}`]: true,
            [`text-${this.color}`]: this.color
          }
        }))

        this.isClickable && child.push(h('div', {
          staticClass: 'q-chip__pointer q-chip__pointer--hover absolute',
          'class': `q-chip__pointer--${this.pointing}`
        }))
      }

      this.hasLeftIcon && child.push(h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--left',
        props: { name: this.selected ? this.$q.icon.chip.selected : this.icon }
      }))

      child.push(h('div', {
        staticClass: 'q-chip__content row items-center'
      }, this.label ? [ this.label ] : this.$slots.default))

      this.iconRight && child.push(h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--right',
        props: { name: this.iconRight }
      }))

      this.closable && child.push(h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--close cursor-pointer',
        props: { name: this.$q.icon.chip.close },
        attrs: { tabindex: this.computedTabindex },
        nativeOn: {
          click: this.__onClose,
          keyup: this.__onClose
        }
      }))

      return child
    }
  },

  render (h) {
    if (!this.value) { return }

    const data = this.isClickable ? {
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.__onClick,
        keyup: this.__onKeyup
      },
      directives: [{ name: 'ripple' }]
    } : {}

    data.staticClass = 'q-chip row inline no-wrap items-center'
    data['class'] = this.classes

    return h('div', data, this.__getContent(h))
  }
})
