const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i && 'handler' in i)
}

export default {
  props: {
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    align: {
      type: String,
      default: 'left',
      validator: v => ['left', 'center', 'right'].includes(v)
    }
  },
  computed: {
    labelIsAbove () {
      return this.focused || this.length || this.stackLabel
    }
  }
}
