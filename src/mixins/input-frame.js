import { stopAndPrevent } from '../utils/event.js'
import AlignMixin from './align.js'

const marginal = {
  type: Array,
  validator: v => v.every(i => 'icon' in i)
}

export default {
  mixins: [AlignMixin],
  props: {
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    placeholder: String,
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
    clearValue: {},
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
      return this.isInverted && ((this.invertedLight && !this.hasError) || (this.inverted && this.hasWarning))
    },
    isStandard () {
      return !this.isInverted
    },
    isHideUnderline () {
      return this.isStandard && this.hideUnderline
    },
    labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    hasContent () {
      return this.length > 0 || this.additionalLength > 0 || this.placeholder || this.placeholder === 0
    },
    editable () {
      return !this.disable && !this.readonly
    },
    computedClearValue () {
      return this.clearValue === void 0 ? null : this.clearValue
    },
    isClearable () {
      return this.editable && this.clearable && this.computedClearValue !== this.model
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
        : (
          this.placeholder || this.placeholder === 0
            ? this.placeholder
            : ''
        )
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
      const val = this.computedClearValue
      if (this.__setModel) {
        this.__setModel(val, true)
      }
      this.$emit('clear', val)
    }
  }
}
