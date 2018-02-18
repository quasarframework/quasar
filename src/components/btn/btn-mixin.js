import Ripple from '../../directives/ripple'
import { QIcon } from '../icon'
import AlignMixin from '../../mixins/align'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  form: 12.446,
  'form-label': 17.11,
  'form-hide-underline': 9.335,
  'form-label-hide-underline': 14,
  'form-inverted': 15.555,
  'form-label-inverted': 20.22
}

export default {
  mixins: [AlignMixin],
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    loading: Boolean,
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
    tabindex: Number
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
    computedTabIndex () {
      return this.isDisabled ? -1 : this.tabindex || 0
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
      this.noWrap && classes.push('no-wrap', 'text-no-wrap')
      this.repeating && classes.push('non-selectable')
      return classes
    }
  }
}
