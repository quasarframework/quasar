import { QIcon } from '../components/icon'
import { stopAndPrevent } from '../utils/event'
import AlignMixin from './align'

const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i)
}

export default {
  mixins: [AlignMixin],
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
    align: {
      default: 'left'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    hideUnderline: Boolean,
    clearValue: {
      default: null
    }
  },
  computed: {
    labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
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
