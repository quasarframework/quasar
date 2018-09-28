import Ripple from '../../directives/ripple.js'
import AlignMixin from '../../mixins/align.js'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export default {
  mixins: [ AlignMixin ],

  directives: {
    Ripple
  },

  props: {
    type: String,
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
    unelevated: Boolean,
    rounded: Boolean,
    push: Boolean,
    size: String,
    fab: Boolean,
    fabMini: Boolean,
    color: String,
    textColor: String,
    dense: Boolean,
    noRipple: Boolean,
    tabindex: String,
    to: [Object, String],
    replace: Boolean,
    stretch: Boolean,
    stack: Boolean,
    align: { default: 'center' }
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

    isDisabled () {
      return this.disable || this.loading
    },

    hasRipple () {
      return !this.noRipple && !this.isDisabled
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
      let colors

      if (this.color) {
        if (this.flat || this.outline) {
          colors = `text-${this.textColor || this.color}`
        }
        else {
          colors = `bg-${this.color} text-${this.textColor || 'white'}`
        }
      }
      else if (this.textColor) {
        colors = `text-${this.textColor}`
      }

      return {
        [colors]: colors,
        [`q-btn--${this.isRound ? 'round' : 'rectangle'}`]: true,
        'disabled': this.isDisabled,
        'q-focusable q-hoverable': !this.isDisabled,
        'q-btn--fab': this.fab,
        'q-btn--fab-mini': this.fabMini,
        'q-btn--flat': this.flat,
        'q-btn--outline': this.outline,
        'q-btn--push': this.push,
        'q-btn--unelevated': this.unelevated,
        'q-btn--no-uppercase': this.noCaps,
        'q-btn--rounded': this.rounded,
        'q-btn--dense': this.dense,
        'no-border-radius self-stretch': this.stretch
      }
    },

    innerClasses () {
      return {
        [this.alignClass]: true,
        'row': !this.stack,
        'column': this.stack,
        'no-wrap text-no-wrap': this.noWrap
      }
    }
  }
}
