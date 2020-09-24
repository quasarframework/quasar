import { h, defineComponent, withDirectives } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/Ripple.js'

import DarkMixin from '../../mixins/dark.js'
import RippleMixin from '../../mixins/ripple.js'
import { getSizeMixin } from '../../mixins/size.js'

import { stopAndPrevent } from '../../utils/event.js'
import { mergeSlotSafely } from '../../utils/slot.js'

export default defineComponent({
  name: 'QChip',

  mixins: [
    RippleMixin,
    DarkMixin,
    getSizeMixin({
      xs: 8,
      sm: 10,
      md: 14,
      lg: 20,
      xl: 24
    })
  ],

  // TODO vue3
  model: {
    event: 'remove'
  },

  props: {
    dense: Boolean,

    icon: String,
    iconRight: String,
    iconRemove: String,
    label: [String, Number],

    color: String,
    textColor: String,

    value: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: null
    },

    square: Boolean,
    outline: Boolean,
    clickable: Boolean,
    removable: Boolean,

    tabindex: [String, Number],
    disable: Boolean
  },

  computed: {
    classes () {
      const text = this.outline === true
        ? this.color || this.textColor
        : this.textColor

      return 'q-chip row inline no-wrap items-center' +
        (this.outline === false && this.color !== void 0 ? ` bg-${this.color}` : '') +
        (text ? ` text-${text} q-chip--colored` : '') +
        (this.disable === true ? ' disabled' : '') +
        (this.dense === true ? ' q-chip--dense' : '') +
        (this.outline === true ? ' q-chip--outline' : '') +
        (this.selected === true ? ' q-chip--selected' : '') +
        (this.isClickable === true ? ' q-chip--clickable cursor-pointer non-selectable q-hoverable' : '') +
        (this.square === true ? ' q-chip--square' : '') +
        (this.isDark === true ? ' q-chip--dark q-dark' : '')
    },

    hasLeftIcon () {
      return this.selected === true || this.icon !== void 0
    },

    isClickable () {
      return this.disable === false && (this.clickable === true || this.selected !== null)
    },

    attrs () {
      return this.disable === true
        ? { tabindex: -1, 'aria-disabled': 'true' }
        : { tabindex: this.tabindex || 0 }
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

    __onRemove (e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e)
        !this.disable && this.$emit('remove', false)
      }
    },

    __getContent () {
      const child = []

      this.isClickable === true && child.push(
        h('div', { staticClass: 'q-focus-helper' })
      )

      this.hasLeftIcon === true && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--left',
          name: this.selected === true ? this.$q.iconSet.chip.selected : this.icon
        })
      )

      const label = this.label !== void 0
        ? [ h('div', { class: 'ellipsis' }, [ this.label ]) ]
        : void 0

      child.push(
        h('div', {
          class: 'q-chip__content col row no-wrap items-center q-anchor--skip'
        }, mergeSlotSafely(label, this, 'default'))
      )

      this.iconRight && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--right',
          name: this.iconRight
        })
      )

      this.removable === true && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--remove cursor-pointer',
          name: this.iconRemove || this.$q.iconSet.chip.remove,
          ...this.attrs,
          onClick: this.__onRemove,
          onKeyup: this.__onRemove
        })
      )

      return child
    }
  },

  render () {
    if (this.value === false) { return }

    const data = {
      class: this.classes,
      style: this.sizeStyle
    }

    this.isClickable === true && Object.assign(
      data,
      this.attrs,
      onClick: this.__onClick,
      onKeyup: this.__onKeyup
    )

    return withDirectives(
      h('div', data, this.__getContent()),
      [[ Ripple, this.ripple ]]
    )
  }
})
