import Mixin from '../../mixins/checkbox'
import OptionMixin from '../../mixins/option'
import { QIcon } from '../icon'

export default {
  name: 'q-toggle',
  mixins: [Mixin, OptionMixin],
  props: {
    icon: String
  },
  computed: {
    currentIcon () {
      return (this.isActive ? this.checkedIcon : this.uncheckedIcon) || this.icon
    },
    iconColor () {
      return __THEME__ === 'ios'
        ? 'dark'
        : (this.isTrue ? 'white' : 'dark')
    },
    baseClass () {
      if (__THEME__ === 'ios' && this.dark) {
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
          __THEME__ === 'mat'
            ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
            : null
        ])
      ]
    }
  }
}
