import { QIcon } from '../icon'

export default {
  name: 'QField',
  props: {
    inset: {
      type: String,
      validator: v => ['icon', 'label', 'full'].includes(v)
    },
    label: String,
    count: {
      type: [Number, Boolean],
      default: false
    },
    error: Boolean,
    errorLabel: String,
    warning: Boolean,
    warningLabel: String,
    helper: String,
    icon: String,
    iconColor: String,
    dark: Boolean,
    orientation: {
      type: String,
      validator: v => ['vertical', 'horizontal'].includes(v)
    },
    labelWidth: {
      type: [Number, String],
      default: 5,
      validator (val) {
        const v = parseInt(val, 10)
        return v > 0 && v < 13
      }
    }
  },
  data () {
    return {
      input: {}
    }
  },
  computed: {
    hasError () {
      return this.input.error || this.error
    },
    hasWarning () {
      return !this.hasError && (this.input.warning || this.warning)
    },
    hasBottom () {
      return (this.hasError && this.errorLabel) ||
        (this.hasWarning && this.warningLabel) ||
        this.helper ||
        this.count
    },
    hasLabel () {
      return this.label || this.$slots.label || ['label', 'full'].includes(this.inset)
    },
    childHasLabel () {
      return this.input.floatLabel || this.input.stackLabel
    },
    isDark () {
      return this.input.dark || this.dark
    },
    insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    hasNoInput () {
      return !this.input.$options || this.input.__needsBorder
    },
    counter () {
      if (this.count) {
        const length = this.input.length || '0'
        return Number.isInteger(this.count)
          ? `${length} / ${this.count}`
          : length
      }
    },
    classes () {
      return {
        'q-field-responsive': !this.isVertical && !this.isHorizontal,
        'q-field-vertical': this.isVertical,
        'q-field-horizontal': this.isHorizontal,
        'q-field-floating': this.childHasLabel,
        'q-field-no-label': !this.label && !this.$slots.label,
        'q-field-with-error': this.hasError,
        'q-field-with-warning': this.hasWarning,
        'q-field-dark': this.isDark
      }
    },
    computedLabelWidth () {
      return parseInt(this.labelWidth, 10)
    },
    isVertical () {
      return this.orientation === 'vertical' || this.computedLabelWidth === 12
    },
    isHorizontal () {
      return this.orientation === 'horizontal'
    },
    labelClasses () {
      return this.isVertical
        ? `col-12`
        : (this.isHorizontal ? `col-${this.labelWidth}` : `col-xs-12 col-sm-${this.labelWidth}`)
    },
    inputClasses () {
      return this.isVertical
        ? `col-xs-12`
        : (this.isHorizontal ? 'col' : 'col-xs-12 col-sm')
    },
    iconProps () {
      const prop = { name: this.icon }
      if (this.iconColor && !this.hasError && !this.hasWarning) {
        prop.color = this.iconColor
      }
      return prop
    }
  },
  provide () {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput (vm) {
      this.input = vm
    },
    __unregisterInput (vm) {
      if (!vm || vm === this.input) {
        this.input = {}
      }
    },
    __getBottomContent (h) {
      if (this.hasError && this.errorLabel) {
        return h('div', { staticClass: 'q-field-error col' }, this.errorLabel)
      }
      if (this.hasWarning && this.warningLabel) {
        return h('div', { staticClass: 'q-field-warning col' }, this.warningLabel)
      }
      if (this.helper) {
        return h('div', { staticClass: 'q-field-helper col' }, this.helper)
      }
      return h('div', { staticClass: 'col' })
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-field row no-wrap items-start',
      'class': this.classes
    }, [
      this.icon
        ? h(QIcon, {
          props: this.iconProps,
          staticClass: 'q-field-icon q-field-margin'
        })
        : (this.insetIcon ? h('div', { staticClass: 'q-field-icon' }) : null),

      h('div', { staticClass: 'row col' }, [
        this.hasLabel
          ? h('div', {
            staticClass: 'q-field-label q-field-margin',
            'class': this.labelClasses
          }, [
            h('div', { staticClass: 'q-field-label-inner row items-center' }, [
              this.label,
              this.$slots.label
            ])
          ])
          : null,

        h('div', {
          staticClass: 'q-field-content',
          'class': this.inputClasses
        }, [
          this.$slots.default,
          this.hasBottom
            ? h('div', {
              staticClass: 'q-field-bottom row no-wrap',
              'class': { 'q-field-no-input': this.hasNoInput }
            }, [
              this.__getBottomContent(h),
              this.counter
                ? h('div', { staticClass: 'q-field-counter col-auto' }, [ this.counter ])
                : null
            ])
            : null
        ])
      ])
    ])
  }
}
