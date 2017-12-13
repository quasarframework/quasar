import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

const sizes = {
  rectangle: {
    xs: 8, sm: 11, md: 14, lg: 17, xl: 20
  },
  round: {
    xs: 24, sm: 40, md: 56, lg: 72, xl: 88
  }
}

export default {
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    disable: Boolean,
    label: [Number, String],
    noCaps: Boolean,
    noWrap: Boolean,
    icon: String,
    iconRight: String,
    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    size: String,
    color: String,
    glossy: Boolean,
    compact: Boolean,
    noRipple: Boolean
  },
  computed: {
    style () {
      const def = sizes[this.round ? 'round' : 'rectangle']

      return {
        fontSize: this.size
          ? (this.size in def ? `${def[this.size]}px` : this.size)
          : `${def.md}px`
      }
    },
    shape () {
      return `q-btn-${this.round ? 'round' : 'rectangle'}`
    },
    isDisabled () {
      return this.disable || this.loading
    },
    hasRipple () {
      return __THEME__ === 'mat' && !this.noRipple && !this.isDisabled
    },
    classes () {
      const
        cls = [ this.shape ],
        color = this.toggled ? this.toggleColor : this.color

      if (this.toggled) {
        cls.push('q-btn-toggle-active')
      }
      if (this.compact) {
        cls.push('q-btn-compact')
      }

      if (this.flat) {
        cls.push('q-btn-flat')
      }
      else if (this.outline) {
        cls.push('q-btn-outline')
      }
      else if (this.push) {
        cls.push('q-btn-push')
      }

      this.isDisabled && cls.push('disabled')
      this.noCaps && cls.push('q-btn-no-uppercase')
      this.rounded && cls.push('q-btn-rounded')
      this.glossy && cls.push('glossy')

      if (color) {
        if (this.flat || this.outline) {
          cls.push(`text-${color}`)
        }
        else {
          cls.push(`bg-${color}`)
          cls.push(`text-white`)
        }
      }

      return cls
    }
  },
  methods: {
    removeFocus (e) {
      // if is touch enabled and focus was received from pointer
      if (this.$q.platform.has.touch && e.detail) {
        this.$el.blur()
      }
    }
  }
}
