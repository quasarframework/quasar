import QBtn from './QBtn'
import QBtnGroup from './QBtnGroup'

export default {
  name: 'q-btn-toggle',
  props: {
    value: {
      required: true
    },
    color: String,
    textColor: String,
    toggleColor: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: v => v.every(opt => ('label' in opt || 'icon' in opt) && 'value' in opt)
    },
    disable: Boolean,
    noCaps: Boolean,
    noWrap: Boolean,
    outline: Boolean,
    flat: Boolean,
    dense: Boolean,
    rounded: Boolean,
    push: Boolean,
    size: String,
    glossy: Boolean,
    noRipple: Boolean,
    waitForRipple: Boolean
  },
  computed: {
    val () {
      return this.options.map(opt => opt.value === this.value)
    }
  },
  methods: {
    set (value, opt) {
      this.$emit('input', value, opt)
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value, opt)
        }
      })
    }
  },
  render (h) {
    return h(QBtnGroup, {
      staticClass: 'q-btn-toggle',
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push
      }
    },
    this.options.map(
      (opt, i) => h(QBtn, {
        key: `${opt.label}${opt.icon}${opt.iconRight}`,
        on: { click: () => this.set(opt.value, opt) },
        props: {
          disable: this.disable,
          label: opt.label,
          color: this.val[i] ? opt.toggleColor || this.toggleColor : opt.color || this.color,
          textColor: opt.textColor || this.textColor,
          icon: opt.icon,
          iconRight: opt.iconRight,
          noCaps: this.noCaps,
          noWrap: this.noWrap,
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push,
          glossy: this.glossy,
          size: this.size,
          dense: this.dense,
          noRipple: this.noRipple,
          waitForRipple: this.waitForRipple,
          tabindex: opt.tabindex
        }
      })
    ))
  }
}
