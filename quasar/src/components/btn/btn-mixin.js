import AlignMixin from '../../mixins/align.js'
import RippleMixin from '../../mixins/ripple.js'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export default {
  mixins: [ RippleMixin, AlignMixin ],

  props: {
    type: String,
    to: [Object, String],
    replace: Boolean,

    label: [Number, String],
    icon: String,
    iconRight: String,

    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    unelevated: Boolean,
    rounded: Boolean,
    push: Boolean,
    glossy: Boolean,

    size: String,
    fab: Boolean,
    fabMini: Boolean,

    color: String,
    textColor: String,
    noCaps: Boolean,
    noWrap: Boolean,
    dense: Boolean,

    tabindex: [Number, String],

    align: { default: 'center' },
    stack: Boolean,
    stretch: Boolean,
    loading: {
      type: Boolean,
      default: null
    },
    disable: Boolean
  },

  computed: {
    style () {
      if (this.size && !this.fab && !this.fabMini) {
        return {
          fontSize: this.size in sizes ? `${sizes[this.size]}px` : this.size
        }
      }
    },

    isRound () {
      return this.round === true || this.fab === true || this.fabMini === true
    },

    isDisabled () {
      return this.disable === true || this.loading === true
    },

    computedTabIndex () {
      return this.isDisabled === true ? -1 : this.tabindex || 0
    },

    hasRouterLink () {
      return this.disable !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    isLink () {
      return this.type === 'a' || this.hasRouterLink === true
    },

    design () {
      if (this.flat === true) return 'flat'
      if (this.outline === true) return 'outline'
      if (this.push === true) return 'push'
      if (this.unelevated === true) return 'unelevated'
      return 'standard'
    },

    attrs () {
      const att = { tabindex: this.computedTabIndex }
      if (this.type !== 'a') {
        att.type = this.type || 'button'
      }
      if (this.hasRouterLink === true) {
        att.href = this.$router.resolve(this.to).href
      }
      if (this.isDisabled === true) {
        att.disabled = true
      }
      return att
    },

    classes () {
      let colors

      if (this.color !== void 0) {
        if (this.flat === true || this.outline === true) {
          colors = `text-${this.textColor || this.color}`
        }
        else {
          colors = `bg-${this.color} text-${this.textColor || 'white'}`
        }
      }
      else if (this.textColor) {
        colors = `text-${this.textColor}`
      }

      return `q-btn--${this.design} q-btn--${this.isRound === true ? 'round' : 'rectangle'}` +
        (colors !== void 0 ? ' ' + colors : '') +
        (this.isDisabled !== true ? ' q-focusable q-hoverable' : '') +
        (this.fab === true ? ' q-btn--fab' : (this.fabMini === true ? ' q-btn--fab-mini' : '')) +
        (this.noCaps === true ? ' q-btn--no-uppercase' : '') +
        (this.rounded === true ? ' q-btn--rounded' : '') +
        (this.dense === true ? ' q-btn--dense' : '') +
        (this.stretch === true ? ' no-border-radius self-stretch' : '') +
        (this.glossy === true ? ' glossy' : '')
    },

    innerClasses () {
      return this.alignClass + (this.stack === true ? ' column' : ' row') +
        (this.noWrap === true ? ' no-wrap text-no-wrap' : '') +
        (this.loading === true ? ' q-btn__content--hidden' : '')
    }
  }
}
