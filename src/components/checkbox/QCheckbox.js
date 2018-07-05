import CheckboxMixin from '../../mixins/checkbox.js'
import OptionMixin from '../../mixins/option.js'
import QIcon from '../icon/QIcon.js'

export default {
  name: 'QCheckbox',
  mixins: [CheckboxMixin, OptionMixin],
  props: {
    toggleIndeterminate: Boolean,
    indeterminateValue: { default: null },
    indeterminateIcon: String
  },
  computed: {
    isIndeterminate () {
      return this.value === void 0 || this.value === this.indeterminateValue
    },
    checkedStyle () {
      return this.isTrue
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    indeterminateStyle () {
      return this.isIndeterminate
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    uncheckedStyle () {
      return this.isFalse
        ? {opacity: 1}
        : {transition: 'opacity 650ms cubic-bezier(0.23, 1, 0.32, 1) 150ms', opacity: 0}
    }
  },
  methods: {
    __getContent (h) {
      return [
        h(QIcon, {
          staticClass: 'q-checkbox-icon cursor-pointer',
          props: { name: this.uncheckedIcon || this.$q.icon.checkbox.unchecked[process.env.THEME] },
          style: this.uncheckedStyle
        }),
        h(QIcon, {
          staticClass: 'q-checkbox-icon cursor-pointer absolute-full',
          props: { name: this.indeterminateIcon || this.$q.icon.checkbox.indeterminate[process.env.THEME] },
          style: this.indeterminateStyle
        }),
        h(QIcon, {
          staticClass: 'q-checkbox-icon cursor-pointer absolute-full',
          props: { name: this.checkedIcon || this.$q.icon.checkbox.checked[process.env.THEME] },
          style: this.checkedStyle
        }),
        process.env.THEME === 'mat'
          ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
          : null
      ]
    }
  },
  beforeCreate () {
    this.__kebabTag = 'q-checkbox'
  }
}
