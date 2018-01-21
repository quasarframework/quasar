import { QIcon } from '../components/icon'
import { stopAndPrevent } from '../utils/event'

const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i)
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
    warning: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    hideUnderline: Boolean,
    align: {
      type: String,
      default: 'left',
      validator: v => ['left', 'center', 'right'].includes(v)
    },
    clearValue: {
      default: null
    }
  },
  computed: {
    labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    alignClass () {
      return `justify-${align[this.align]}`
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    clear (evt) {
      if (!this.editable) {
        return
      }
      stopAndPrevent(evt)
      const val = this.clearValue
      if (this.__setModel) {
        this.__setModel(val, true)
      }
      else {
        this.$emit('input', val)
      }
      this.$emit('clear', val)
    }
  }
}
