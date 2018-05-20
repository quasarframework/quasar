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
    readonly: Boolean,
    clearable: Boolean,
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
    invertedLight: Boolean,
    hideUnderline: Boolean,
    clearValue: {
      default: null
    },
    noParentField: Boolean
  },
  computed: {
    inputPlaceholder () {
      if ((!this.floatLabel && !this.stackLabel) || this.labelIsAbove) {
        return this.placeholder
      }
    },
    isInverted () {
      return this.inverted || this.invertedLight
    },
    isInvertedLight () {
      return (this.invertedLight && !this.hasError) || (this.inverted && this.hasWarning)
    },
    labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    editable () {
      return !this.disable && !this.readonly
    },
    hasError () {
      return !!((!this.noParentField && this.field && this.field.error) || this.error)
    },
    hasWarning () {
      // error is the higher priority
      return !!(!this.hasError && ((!this.noParentField && this.field && this.field.warning) || this.warning))
    },
    fakeInputValue () {
      return this.actualValue || this.actualValue === 0
        ? this.actualValue
        : this.placeholder
    },
    fakeInputClasses () {
      const hasValue = this.actualValue || this.actualValue === 0
      return [this.alignClass, {
        invisible: (this.stackLabel || this.floatLabel) && !this.labelIsAbove && !hasValue,
        'q-input-target-placeholder': !hasValue && this.inputPlaceholder
      }]
    }
  },
  methods: {
    clear (evt) {
      if (!this.editable) {
        return
      }
      evt && stopAndPrevent(evt)
      const val = this.clearValue
      if (this.__setModel) {
        this.__setModel(val, true)
      }
      this.$emit('clear', val)
    }
  }
}
