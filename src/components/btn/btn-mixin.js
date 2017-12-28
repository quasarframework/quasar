import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

const sizes = {
  xs: 8, sm: 10, md: 14, lg: 20, xl: 24
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
    fab: Boolean,
    fabMini: Boolean,
    color: String,
    textColor: String,
    glossy: Boolean,
    dense: Boolean,
    noRipple: Boolean
  },
  computed: {
    style () {
      if (this.size && !this.fab && !this.fabMini) {
        return {
          fontSize: this.size in sizes ? `${sizes[this.size]}px` : this.size
        }
      }
    },
    isRectangle () {
      return !this.isRound
    },
    isRound () {
      return this.round || this.fab || this.fabMini
    },
    shape () {
      return `q-btn-${this.isRound ? 'round' : 'rectangle'}`
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

      if (this.fab) {
        cls.push('q-btn-fab')
      }
      else if (this.fabMini) {
        cls.push('q-btn-fab-mini')
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

      if (this.isDisabled) {
        cls.push('disabled')
      }
      else {
        cls.push('q-focusable q-hoverable')
      }

      if (color) {
        if (this.flat || this.outline) {
          cls.push(`text-${this.textColor || color}`)
        }
        else {
          cls.push(`bg-${color}`)
          cls.push(`text-${this.textColor || 'white'}`)
        }
      }

      cls.push({
        'q-btn-no-uppercase': this.noCaps,
        'q-btn-rounded': this.rounded,
        'q-btn-dense': this.dense,
        'q-btn-toggle-active': this.toggled,
        'glossy': this.glossy
      })

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
