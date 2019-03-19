import Vue from 'vue'

import QBtn from './QBtn.js'
import QBtnGroup from './QBtnGroup.js'

export default Vue.extend({
  name: 'QBtnToggle',

  props: {
    value: {
      required: true
    },

    options: {
      type: Array,
      required: true,
      validator: v => v.every(opt => ('label' in opt || 'icon' in opt) && 'value' in opt)
    },

    // To avoid seeing the active raise shadow through the transparent button, give it a color (even white).
    color: String,
    textColor: String,
    toggleColor: {
      type: String,
      default: 'primary'
    },
    toggleTextColor: String,

    outline: Boolean,
    flat: Boolean,
    unelevated: Boolean,
    rounded: Boolean,
    push: Boolean,
    glossy: Boolean,

    size: String,

    noCaps: Boolean,
    noWrap: Boolean,
    dense: Boolean,
    readonly: Boolean,
    disable: Boolean,

    stack: Boolean,
    stretch: Boolean,

    spread: Boolean,

    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  computed: {
    val () {
      return this.options.map(opt => opt.value === this.value)
    }
  },

  methods: {
    set (value, opt) {
      if (this.readonly === false && value !== this.value) {
        this.$emit('input', value, opt)
      }
    }
  },

  render (h) {
    return h(QBtnGroup, {
      staticClass: 'q-btn-toggle',
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push,
        stretch: this.stretch,
        unelevated: this.unelevated,
        glossy: this.glossy,
        spread: this.spread
      },
      on: this.$listeners
    },
    this.options.map(
      (opt, i) => h(QBtn, {
        key: i,
        on: { click: () => this.set(opt.value, opt) },
        props: {
          disable: this.disable || opt.disable,
          label: opt.label,
          // Colors come from the button specific options first, then from general props
          color: this.val[i] === true ? opt.toggleColor || this.toggleColor : opt.color || this.color,
          textColor: this.val[i] === true ? opt.toggleTextColor || this.toggleTextColor : opt.textColor || this.textColor,
          icon: opt.icon,
          iconRight: opt.iconRight,
          noCaps: this.noCaps === true || opt.noCaps === true,
          noWrap: this.noWrap === true || opt.noWrap === true,
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push,
          unelevated: this.unelevated,
          size: this.size,
          dense: this.dense,
          ripple: this.ripple || opt.ripple,
          stack: this.stack === true || opt.stack === true,
          tabindex: opt.tabindex,
          stretch: this.stretch
        }
      })
    ))
  }
})
