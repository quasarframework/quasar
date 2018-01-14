import Mixin from '../../mixins/checkbox'
import OptionGroupMixin from '../../mixins/option'
import { QIcon } from '../icon'

export default {
  name: 'q-checkbox',
  mixins: [Mixin, OptionGroupMixin],
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
          props: { name: this.uncheckedIcon || this.$q.icon.checkbox.unchecked[__THEME__] },
          style: this.uncheckedStyle
        }),
        h(QIcon, {
          staticClass: 'q-checkbox-icon cursor-pointer absolute-full',
          props: { name: this.indeterminateIcon || this.$q.icon.checkbox.indeterminate[__THEME__] },
          style: this.indeterminateStyle
        }),
        h(QIcon, {
          staticClass: 'q-checkbox-icon cursor-pointer absolute-full',
          props: { name: this.checkedIcon || this.$q.icon.checkbox.checked[__THEME__] },
          style: this.checkedStyle
        }),
        __THEME__ === 'mat'
          ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
          : null
      ]
    }
  }
}
