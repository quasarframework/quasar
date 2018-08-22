import CheckboxMixin from '../../mixins/checkbox.js'
import OptionMixin from '../../mixins/option.js'
import QIcon from '../icon/QIcon.js'

export default {
  name: 'QToggle',
  mixins: [CheckboxMixin, OptionMixin],
  props: {
    icon: String
  },
  computed: {
    currentIcon () {
      return (this.isTrue ? this.checkedIcon : this.uncheckedIcon) || this.icon
    },
    iconColor () {
      return process.env.THEME === 'ios'
        ? 'dark'
        : (this.isTrue ? 'white' : 'dark')
    },
    baseClass () {
      if (process.env.THEME === 'ios' && this.dark) {
        return `q-toggle-base-dark`
      }
    }
  },
  methods: {
    __swipe (evt) {
      if (evt.direction === 'left') {
        if (this.isTrue) {
          this.toggle()
        }
      }
      else if (evt.direction === 'right') {
        if (this.isFalse) {
          this.toggle()
        }
      }
    },
    __getContent (h) {
      return [
        h('div', { staticClass: 'q-toggle-base', 'class': this.baseClass }),
        h('div', { staticClass: 'q-toggle-handle row flex-center' }, [
          this.currentIcon
            ? h(QIcon, {
              staticClass: 'q-toggle-icon',
              props: { name: this.currentIcon, color: this.iconColor }
            })
            : null,
          process.env.THEME === 'mat'
            ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
            : null
        ])
      ]
    }
  },
  beforeCreate () {
    this.__kebabTag = 'q-toggle'
  }
}
