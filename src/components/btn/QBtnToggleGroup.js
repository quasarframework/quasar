import QBtnGroup from './QBtnGroup'
import QBtnToggle from './QBtnToggle'

export default {
  name: 'q-btn-toggle-group',
  props: {
    value: {
      required: true
    },
    color: String,
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
      if (value !== this.value) {
        this.$emit('input', value)
        this.$emit('change', value, opt)
      }
    }
  },
  render (h) {
    return h(QBtnGroup, {
      staticClass: 'q-btn-toggle-group',
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push
      }
    },
    this.options.map(
      (opt, i) => h(QBtnToggle, {
        key: `${opt.label}${opt.icon}${opt.iconRight}`,
        attrs: {
          tabindex: opt.tabindex || 0
        },
        on: { change: () => this.set(opt.value, opt) },
        props: {
          toggled: this.val[i],
          label: opt.label,
          color: opt.color || this.color,
          toggleColor: opt.toggleColor || this.toggleColor,
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
          waitForRipple: this.waitForRipple
        }
      })
    ))
  }
}
