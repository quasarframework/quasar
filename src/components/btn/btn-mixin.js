import Ripple from '../../directives/ripple.js'
import AlignMixin from '../../mixins/align.js'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  form: 14.777,
  'form-label': 21.777,
  'form-hide-underline': 9.333,
  'form-label-hide-underline': 16.333
}

export default {
  mixins: [AlignMixin],
  directives: {
    Ripple
  },
  props: {
    type: String,
    loading: {
      type: Boolean,
      default: null
    },
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
    noRipple: Boolean,
    tabindex: Number,
    to: [Object, String],
    replace: Boolean
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
      return process.env.THEME === 'mat' && !this.noRipple && !this.isDisabled
    },
    computedTabIndex () {
      return this.isDisabled ? -1 : this.tabindex || 0
    },
    isLink () {
      return this.type === 'a' || this.to !== void 0
    },
    attrs () {
      const att = { tabindex: this.computedTabIndex }
      if (this.type !== 'a') {
        att.type = this.type || 'button'
      }
      if (this.to !== void 0) {
        att.href = this.$router.resolve(this.to).href
      }
      return att
    },
    classes () {
      const cls = [ this.shape ]

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
        this.active && cls.push('active')
      }

      if (this.color) {
        if (this.flat || this.outline) {
          cls.push(`text-${this.textColor || this.color}`)
        }
        else {
          cls.push(`bg-${this.color}`)
          cls.push(`text-${this.textColor || 'white'}`)
        }
      }
      else if (this.textColor) {
        cls.push(`text-${this.textColor}`)
      }

      cls.push({
        'q-btn-no-uppercase': this.noCaps,
        'q-btn-rounded': this.rounded,
        'q-btn-dense': this.dense,
        'glossy': this.glossy
      })

      return cls
    },
    innerClasses () {
      const classes = [ this.alignClass ]
      this.noWrap === true && classes.push('no-wrap', 'text-no-wrap')
      this.repeating === true && classes.push('non-selectable')
      this.loading === true && classes.push('q-btn-inner--hidden')
      return classes
    }
  }
}
