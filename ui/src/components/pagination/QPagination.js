import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QInput from '../input/QInput.js'

import DarkMixin from '../../mixins/dark.js'
import ListenersMixin from '../../mixins/listeners.js'
import { btnDesignOptions, btnPadding, getBtnDesign } from '../../mixins/btn.js'

import { stop } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import { isKeyCode } from '../../utils/private/key-composition.js'
import cache from '../../utils/private/cache.js'

function getBool (val, otherwise) {
  return [ true, false ].includes(val)
    ? val
    : otherwise
}

export default Vue.extend({
  name: 'QPagination',

  mixins: [ DarkMixin, ListenersMixin ],

  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: [ Number, String ],
      default: 1
    },
    max: {
      type: [ Number, String ],
      required: true
    },
    maxPages: {
      type: [ Number, String ],
      default: 0,
      validator: v => (
        (typeof v === 'string' ? parseInt(v, 10) : v) >= 0
      )
    },

    inputStyle: [Array, String, Object],
    inputClass: [Array, String, Object],

    size: String,

    disable: Boolean,

    input: Boolean,

    iconPrev: String,
    iconNext: String,
    iconFirst: String,
    iconLast: String,

    toFn: Function,

    boundaryLinks: {
      type: Boolean,
      default: null
    },
    boundaryNumbers: {
      type: Boolean,
      default: null
    },
    directionLinks: {
      type: Boolean,
      default: null
    },
    ellipses: {
      type: Boolean,
      default: null
    },

    ripple: {
      type: [Boolean, Object],
      default: null
    },

    round: Boolean,
    rounded: Boolean,

    flat: Boolean,
    outline: Boolean,
    unelevated: Boolean,
    push: Boolean,
    glossy: Boolean,

    color: {
      type: String,
      default: 'primary'
    },
    textColor: String,

    activeDesign: {
      type: String,
      default: '',
      values: v => v === '' || btnDesignOptions.includes(v)
    },
    activeColor: String,
    activeTextColor: String,

    padding: {
      type: String,
      default: '3px 2px'
    }
  },

  data () {
    return {
      newPage: null
    }
  },

  watch: {
    min () {
      this.model = this.value
    },

    max () {
      this.model = this.value
    }
  },

  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        val = parseInt(val, 10)
        if (this.disable || isNaN(val)) {
          return
        }
        const value = between(val, this.__min, this.__max)
        this.$emit('input', value)
      }
    },

    inputPlaceholder () {
      return this.model + ' / ' + this.__max
    },

    __min () {
      return parseInt(this.min, 10)
    },

    __max () {
      return parseInt(this.max, 10)
    },

    __maxPages () {
      return parseInt(this.maxPages, 10)
    },

    __boundaryLinks () {
      return getBool(this.boundaryLinks, this.input)
    },

    __boundaryNumbers () {
      return getBool(this.boundaryNumbers, !this.input)
    },

    __directionLinks () {
      return getBool(this.directionLinks, this.input)
    },

    __ellipses () {
      return getBool(this.ellipses, !this.input)
    },

    __btnDesign () {
      return getBtnDesign(this, 'flat')
    },

    __btnActiveDesign () {
      // we also reset non-active design
      const acc = { [ this.__btnDesign ]: false }
      if (this.activeDesign !== '') {
        acc[ this.activeDesign ] = true
      }
      return acc
    },

    icons () {
      const ico = [
        this.iconFirst || this.$q.iconSet.pagination.first,
        this.iconPrev || this.$q.iconSet.pagination.prev,
        this.iconNext || this.$q.iconSet.pagination.next,
        this.iconLast || this.$q.iconSet.pagination.last
      ]
      return this.$q.lang.rtl === true ? ico.reverse() : ico
    },

    attrs () {
      const attrs = { role: 'navigation' }
      if (this.disable === true) {
        attrs['aria-disabled'] = 'true'
      }
      return attrs
    },

    btnProps () {
      return {
        [ this.__btnDesign ]: true,

        round: this.round,
        rounded: this.rounded,

        padding: this.padding,

        color: this.color,
        textColor: this.textColor,

        size: this.size,
        ripple: this.ripple !== null
          ? this.ripple
          : true
      }
    },

    activeBtnProps () {
      return {
        ...this.__btnActiveDesign,
        color: this.activeColor || this.color,
        textColor: this.activeTextColor || this.textColor
      }
    },

    btnConfig () {
      let maxPages = Math.max(
        this.__maxPages,
        1 + (this.__ellipses ? 2 : 0) + (this.__boundaryNumbers ? 2 : 0)
      )

      const acc = {
        pgFrom: this.__min,
        pgTo: this.__max,
        ellipsesStart: false,
        ellipsesEnd: false,
        boundaryStart: false,
        boundaryEnd: false,
        marginalStyle: {
          minWidth: `${Math.max(2, String(this.__max).length)}em`
        }
      }

      if (this.__maxPages && maxPages < (this.__max - this.__min + 1)) {
        maxPages = 1 + Math.floor(maxPages / 2) * 2
        acc.pgFrom = Math.max(this.__min, Math.min(this.__max - maxPages + 1, this.value - Math.floor(maxPages / 2)))
        acc.pgTo = Math.min(this.__max, acc.pgFrom + maxPages - 1)

        if (this.__boundaryNumbers) {
          acc.boundaryStart = true
          acc.pgFrom++
        }

        if (this.__ellipses && acc.pgFrom > (this.__min + (this.__boundaryNumbers ? 1 : 0))) {
          acc.ellipsesStart = true
          acc.pgFrom++
        }

        if (this.__boundaryNumbers) {
          acc.boundaryEnd = true
          acc.pgTo--
        }

        if (this.__ellipses && acc.pgTo < (this.__max - (this.__boundaryNumbers ? 1 : 0))) {
          acc.ellipsesEnd = true
          acc.pgTo--
        }
      }

      return acc
    },

    inputEvents () {
      const updateModel = () => {
        this.model = this.newPage
        this.newPage = null
      }

      return {
        input: val => { this.newPage = val },
        keyup: e => { isKeyCode(e, 13) === true && updateModel() },
        blur: updateModel
      }
    }
  },

  methods: {
    set (value) {
      this.model = value
    },

    setByOffset (offset) {
      this.model = this.model + offset
    },

    __getBtn (h, data, props, page, active) {
      data.props = {
        ...this.btnProps,
        ...props
      }
      data.attrs = {
        'aria-label': page,
        'aria-current': 'false',
        ...data.attrs
      }

      if (active === true) {
        Object.assign(data.props, this.activeBtnProps)
        data.attrs[ 'aria-current' ] = 'true'
      }

      if (page !== void 0) {
        if (this.toFn !== void 0) {
          data.props.to = this.toFn(page)
        }
        else {
          data.on = { click: () => { this.set(page) } }
        }
      }

      return h(QBtn, data)
    }
  },

  render (h) {
    const contentStart = []
    const contentEnd = []
    let contentMiddle

    if (this.__boundaryLinks === true) {
      contentStart.push(
        this.__getBtn(h, {
          key: 'bls'
        }, {
          disable: this.disable || this.value <= this.__min,
          icon: this.icons[ 0 ]
        }, this.__min)
      )
      contentEnd.unshift(
        this.__getBtn(h, {
          key: 'ble'
        }, {
          disable: this.disable || this.value >= this.__max,
          icon: this.icons[ 3 ]
        }, this.__max)
      )
    }

    if (this.__directionLinks === true) {
      contentStart.push(
        this.__getBtn(h, {
          key: 'bdp'
        }, {
          disable: this.disable || this.value <= this.__min,
          icon: this.icons[ 1 ]
        }, this.value - 1)
      )
      contentEnd.unshift(
        this.__getBtn(h, {
          key: 'bdn'
        }, {
          disable: this.disable || this.value >= this.__max,
          icon: this.icons[ 2 ]
        }, this.value + 1)
      )
    }

    if (this.input !== true) { // has buttons instead of inputbox
      contentMiddle = []
      const { pgFrom, pgTo, marginalStyle: style } = this.btnConfig

      if (this.btnConfig.boundaryStart === true) {
        const active = this.__min === this.value
        contentStart.push(
          this.__getBtn(h, {
            key: 'bns',
            style
          }, {
            disable: this.disable,
            label: this.__min
          }, this.__min, active)
        )
      }

      if (this.btnConfig.boundaryEnd === true) {
        const active = this.__max === this.value
        contentEnd.unshift(
          this.__getBtn(h, {
            key: 'bne',
            style
          }, {
            disable: this.disable,
            label: this.__max
          }, this.__max, active)
        )
      }

      if (this.btnConfig.ellipsesStart === true) {
        contentStart.push(
          this.__getBtn(h, {
            key: 'bes',
            style
          }, {
            disable: this.disable,
            label: '…',
            ripple: false
          }, pgFrom - 1)
        )
      }

      if (this.btnConfig.ellipsesEnd === true) {
        contentEnd.unshift(
          this.__getBtn(h, {
            key: 'bee',
            style
          }, {
            disable: this.disable,
            label: '…',
            ripple: false
          }, pgTo + 1)
        )
      }

      for (let i = pgFrom; i <= pgTo; i++) {
        contentMiddle.push(
          this.__getBtn(h, {
            key: `bpg${i}`,
            style
          }, {
            disable: this.disable,
            label: i
          }, i, i === this.value)
        )
      }
    }

    return h('div', {
      staticClass: 'q-pagination row no-wrap items-center',
      class: { disabled: this.disable },
      attrs: this.attrs,
      on: { ...this.qListeners }
    }, [
      h('div', {
        staticClass: 'q-pagination__content row no-wrap items-center'
      }, [
        ...contentStart,

        h('div', {
          staticClass: 'q-pagination__middle row justify-center',
          on: this.input === true
            ? cache(this, 'stop', { input: stop })
            : null
        }, this.input === true
          ? [
            h(QInput, {
              staticClass: 'inline',
              style: { width: `${this.inputPlaceholder.length / 1.5}em` },
              props: {
                type: 'number',
                dense: true,
                value: this.newPage,
                disable: this.disable,
                dark: this.isDark,
                borderless: true,
                inputClass: this.inputClass,
                inputStyle: this.inputStyle
              },
              attrs: {
                placeholder: this.inputPlaceholder,
                min: this.__min,
                max: this.__max
              },
              on: { ...this.inputEvents }
            })
          ]
          : contentMiddle
        ),

        ...contentEnd
      ])
    ])
  }
})
