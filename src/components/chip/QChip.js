import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple.js'
import { stopAndPrevent } from '../../utils/event.js'

export default {
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
        [`q-chip--pointing q-chip--pointing-${this.pointing}`]: this.pointing,
        disabled: this.disable,
        'q-chip--dense': this.dense || this.floating,
        'q-chip--outline': this.outline,
        'q-chip--floating': this.floating,
        'q-chip--selected': this.selected,
        'q-chip--clickable cursor-pointer non-selectable': this.isClickable,
        'q-chip--square': this.square || this.floating
      }
    },
    hasLeftIcon () {
      return this.selected || this.icon
    },
    isClickable () {
      return !this.disable && this.clickable
    }
  },
  methods: {
    __onKeydown (e) {
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    },
    __onClick (e) {
      if (!this.disable) {
        this.$emit('update:selected', !this.selected)
        this.$emit('click', e)
      }
    },
    __onClose (e) {
      stopAndPrevent(e)
      !this.disable && this.$emit('input', false)
    }
  },
  render (h) {
    if (!this.value) { return }

    const data = this.isClickable ? {
      attrs: {
        tabindex: this.disable ? -1 : this.tabindex
      },
      on: {
        click: this.__onClick,
        keydown: this.__onKeydown
      },
      directives: [{ name: 'ripple' }]
    } : {}

    data.staticClass = 'q-chip row inline no-wrap items-center'
    data['class'] = this.classes

    return h('div', data, [
      (this.hasLeftIcon && h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--left',
        props: { name: this.selected ? this.$q.icon.chip.selected : this.icon }
      })) || void 0,

      h('div', {
        staticClass: 'q-chip__content row items-center'
      }, this.label ? [ this.label ] : this.$slots.default),

      (this.iconRight && h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--right',
        props: { name: this.iconRight }
      })) || void 0,

      (this.closable && h(QIcon, {
        staticClass: 'q-chip__icon q-chip__icon--close cursor-pointer',
        props: { name: this.$q.icon.chip.close },
        nativeOn: {
          click: this.__onClose
        }
      })) || void 0
    ])
  }
}
