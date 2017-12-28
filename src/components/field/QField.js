import { QIcon } from '../icon'

export default {
  name: 'q-field',
  props: {
    labelWidth: {
      type: Number,
      default: 5,
      validator (val) {
        return val >= 1 && val < 12
      }
    },
    inset: {
      type: String,
      validator (val) {
        return ['icon', 'label', 'full'].includes(val)
      }
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
    dark: Boolean
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
      return !this.input.$options || this.input.__needsBottom
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
        'q-field-floating': this.childHasLabel,
        'q-field-no-label': !this.label && !this.$slots.label,
        'q-field-with-error': this.hasError,
        'q-field-with-warning': this.hasWarning,
        'q-field-dark': this.isDark
      }
    }
  },
  provide () {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput (vm, needsBottom) {
      vm.__needsBottom = needsBottom
      this.input = vm
    },
    __unregisterInput () {
      this.input = {}
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
          props: { name: this.icon },
          staticClass: 'q-field-icon q-field-margin'
        })
        : (this.insetIcon ? h('div', { staticClass: 'q-field-icon' }) : null),

      h('div', { staticClass: 'row col' }, [
        this.hasLabel
          ? h('div', {
            staticClass: 'q-field-label col-xs-12 q-field-margin',
            'class': `col-sm-${this.labelWidth}`
          }, [
            h('div', { staticClass: 'q-field-label-inner row items-center' }, [
              this.label,
              this.$slots.label
            ])
          ])
          : null,

        h('div', { staticClass: 'q-field-content col-xs-12 col-sm' }, [
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
