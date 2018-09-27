import BtnMixin from './btn-mixin.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

import Vue from 'vue'
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
      if (document.activeElement !== this.$el) {
        stopAndPrevent(e)
        this.$el.focus()
        return
      }

      this.to !== void 0 && e && stopAndPrevent(e)

      const go = () => {
        this.$router[this.replace ? 'replace' : 'push'](this.to)
      }

      this.$emit('click', e, go)
      this.to !== void 0 && e.navigate !== false && go()
    },

    __onKeyDown (e) {
      if ([13, 32].includes(e.keyCode)) {
        stopAndPrevent(e)
        this.$el.classList.add('q-btn--active')
      }
    },
    __onKeyUp (e) {
      if ([13, 32].includes(e.keyCode)) {
        this.$el.classList.remove('q-btn--active')
        this.$el.dispatchEvent(new MouseEvent('click', Object.assign({}, e)))
      }
    }
  },

  render (h) {
    return h(this.isLink ? 'a' : 'button', {
      staticClass: 'q-btn inline relative-position q-btn-item non-selectable',
      'class': this.classes,
      style: this.style,
      attrs: this.attrs,
      on: this.isDisabled ? {} : {
        click: this.click,
        keydown: this.__onKeyDown,
        keyup: this.__onKeyUp
      },
      directives: this.hasRipple ? [{
        name: 'ripple',
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
        staticClass: 'q-btn__content row col items-center',
        'class': this.innerClasses
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [

          this.icon
            ? h(QIcon, {
              props: { name: this.icon, left: this.hasLabel }
            })
            : null,

          this.hasLabel ? h('div', [ this.label ]) : null

        ].concat(this.$slots.default).concat([

          this.iconRight && this.isRectangle
            ? h(QIcon, {
              props: { name: this.iconRight, right: true }
            })
            : null

        ])
      )
    ])
  }
})
