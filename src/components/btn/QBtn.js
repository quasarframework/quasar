import BtnMixin from './btn-mixin'
import { QSpinner } from '../spinner'
import { between } from '../../utils/format'

export default {
  name: 'q-btn',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean,
    waitForRipple: Boolean
  },
  data () {
    return {
      loading: this.value || false
    }
  },
  watch: {
    value (val) {
      if (this.loading !== val) {
        this.loading = val
      }
    }
  },
  computed: {
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    }
  },
  methods: {
    click (e) {
      this.$el.blur()

      if (this.isDisabled) {
        return
      }

      clearTimeout(this.timer)
      const trigger = () => {
        if (this.loader !== false || this.$slots.loading) {
          this.loading = true
          this.$emit('input', true)
        }
        this.$emit('click', e, () => {
          this.loading = false
          this.$emit('input', false)
        })
      }

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350)
      }
      else {
        trigger()
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  render (h) {
    return h('button', {
      staticClass: 'q-btn row inline flex-center q-focusable q-hoverable relative-position',
      'class': this.classes,
      on: { click: this.click },
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      h('div', { staticClass: 'desktop-only q-focus-helper' }),

      this.loading && this.hasPercentage
        ? h('div', {
          staticClass: 'q-btn-progress absolute-full',
          'class': { 'q-btn-dark-progress': this.darkPercentage },
          style: { width: this.width }
        })
        : null,

      h('span', {
        staticClass: 'q-btn-inner row col flex-center',
        'class': {
          'no-wrap': this.noWrap,
          'text-no-wrap': this.noWrap
        }
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [
          this.icon
            ? h('q-icon', {
              'class': { 'on-left': this.label && !this.round },
              props: { name: this.icon }
            })
            : null,

          this.label && !this.round ? h('span', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && !this.round
            ? h('q-icon', {
              staticClass: 'on-right',
              props: { name: this.iconRight }
            })
            : null
        ]
      )
    ])
  }
}
