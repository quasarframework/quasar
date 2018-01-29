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
    },
    // Display an icon to open an additional display for selection, the click will emit a details event.
    detailsIcon: {
      type: [Boolean, String],
      default: undefined
    }
  },
  data () {
    return {
      defaultDetailsIconSuggestion: this.$q.icon.input.details
    }
  },
  computed: {
    labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    editable () {
      return !this.disable && !this.readonly
    },
    defaultDetailsIconInternal () {
      // Only for Input Frame
      return this.defaultDetailsIconSuggestion
    },
    computedDetailsIcon () {
      // TODO Click specifically on icon is blocked
      if (typeof this.defaultDetailsIcon === 'undefined') {
        // If defaultDetailsIcon is not defined, the component does not want an icon unless it is explicitly requested
        if (this.detailsIcon === true || this.detailsIcon === '') return this.defaultDetailsIconInternal // Default internal
        else if (this.detailsIcon) return this.detailsIcon // Icon specified
        return this.defaultDetailsIcon
      }
      else {
        // Details icon by default
        if (this.detailsIcon === false) return false // Explicitly force no details icon
        if (this.detailsIcon === true || typeof this.detailsIcon === 'undefined' || this.detailsIcon === '') return this.defaultDetailsIcon // True, undefined or empty string: use default icon
        return this.detailsIcon // Icon specified
      }
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
