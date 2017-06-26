import { QIcon } from '../icon'

const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i && 'handler' in i)
}

const align = {
  left: 'start',
  center: 'center',
  right: 'end'
}

export default {
  components: {
    QIcon
  },
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
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    alignClass () {
      return `justify-${align[this.align]}`
    }
  }
}
