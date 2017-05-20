export default {
  props: {
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    disable: Boolean,
    color: String,
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
