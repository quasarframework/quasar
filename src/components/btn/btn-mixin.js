import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'

const sizes = {
  rectangle: {
    xs: '.571em', sm: '.785em', md: '1em', lg: '1.214em', xl: '1.428em'
  },
  round: {
    xs: '.666em', sm: '.833em', md: '1em', lg: '1.166em', xl: '1.333em'
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
    mini: Boolean,
    noRipple: Boolean
  },
  computed: {
    style () {
      if (typeof this.size !== 'string' || ['', 'dense', 'mini'].includes(this.size)) {
        return {}
      }

      const def = sizes[this.round ? 'round' : 'rectangle']

      return {
        fontSize: this.size in def ? def[this.size] : this.size
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

      if (this.round) {
        (this.mini || this.size === 'mini') && cls.push('q-btn-mini')
      }
      else {
        this.compact && cls.push('q-btn-compact')
        this.size === 'dense' && cls.push('q-btn-dense')
        this.rounded && cls.push('q-btn-rounded')
      }

      this.noCaps && cls.push('q-btn-no-uppercase')
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
