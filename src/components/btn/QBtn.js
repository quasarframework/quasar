import Vue from 'vue'

import BtnMixin from './btn-mixin.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'
// import { isSSR } from '../../plugins/platform.js'

/*
const isIESubmit = isSSR || window.PointerEvent === void 0
  ? () => false
  : e => e instanceof PointerEvent && !e.screenX && !e.screenY
*/

export default Vue.extend({
  name: 'QBtn',

  mixins: [ BtnMixin ],

  props: {
    percentage: Number,
    darkPercentage: Boolean
  },

  computed: {
    hasPercentage () {
      return this.percentage !== void 0
    },

    width () {
      return `${between(this.percentage, 0, 100)}%`
    },

    hasLabel () {
      return this.label && this.isRectangle
    }
  },

  methods: {
    click (e) {
      if (e.defaultPrevented) { return }

      /*
      if (document.activeElement !== this.$el || isIESubmit(e)) {
        stopAndPrevent(e)
        e.preventRipple = true
        this.$el.focus()
        return
      }
      */

      this.to !== void 0 && e && stopAndPrevent(e)

      const go = () => {
        this.$router[this.replace ? 'replace' : 'push'](this.to)
      }

      this.$emit('click', e, go)
      this.to !== void 0 && e.navigate !== false && go()
    },

    __onKeydown (e) {
      const classes = this.$el.classList
      if ([13, 32].includes(e.keyCode)) {
        !this.isLink && e.preventDefault()
        if (!classes.contains('q-btn--active')) {
          classes.add('q-btn--active')
          document.addEventListener('keyup', this.__onKeyupAbort)
        }
      }
      this.$listeners.keydown !== void 0 && this.$emit('keydown', e)
    },

    __onKeyup (e) {
      if ([13, 32].includes(e.keyCode)) {
        stopAndPrevent(e)
        this.$el.classList.remove('q-btn--active')
        this.$el.dispatchEvent(new MouseEvent('click', Object.assign({}, e)))
      }
      this.$listeners.keyup !== void 0 && this.$emit('keyup', e)
    },

    __onKeyupAbort (e) {
      document.removeEventListener('keyup', this.__onKeyupAbort)
      this.$el && this.$el.classList.remove('q-btn--active')
    }
  },

  beforeDestroy () {
    document.removeEventListener('keyup', this.__onKeyupAbort)
  },

  render (h) {
    return h(this.isLink ? 'a' : 'button', {
      staticClass: 'q-btn inline relative-position q-btn-item non-selectable',
      'class': this.classes,
      style: this.style,
      attrs: this.attrs,
      on: this.isDisabled ? {} : {
        ...this.$listeners,
        click: this.click,
        keydown: this.__onKeydown,
        keyup: this.__onKeyup
      },
      directives: this.hasRipple ? [{
        name: 'ripple',
        value: this.ripple,
        modifiers: { center: this.isRound }
      }] : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

      this.loading && this.hasPercentage
        ? h('div', {
          staticClass: 'q-btn__progress absolute-full',
          'class': { 'q-btn__progress--dark': this.darkPercentage },
          style: { width: this.width }
        })
        : null,

      h('div', {
        staticClass: 'q-btn__content text-center col items-center q-menu--skip',
        'class': this.innerClasses
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [

          this.icon
            ? h(QIcon, {
              props: { name: this.icon, left: !this.stack && this.hasLabel }
            })
            : null,

          this.hasLabel ? h('div', [ this.label ]) : null

        ].concat(this.$slots.default).concat([

          this.iconRight && this.isRectangle
            ? h(QIcon, {
              props: { name: this.iconRight, right: !this.stack }
            })
            : null

        ])
      )
    ])
  }
})
