import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QInput from '../input/QInput.js'

import DarkMixin from '../../mixins/dark.js'

import { stop } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import { isKeyCode } from '../../utils/key-composition.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QPagination',

  mixins: [ DarkMixin ],

  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },

    color: {
      type: String,
      default: 'primary'
    },
    textColor: String,

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
    maxPages: {
      type: Number,
      default: 0,
      validator: v => v >= 0
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
        if (this.disable || isNaN(val) || val === 0) {
          return
        }
        const value = between(val, this.min, this.max)
        this.$emit('input', value)
      }
    },

    inputPlaceholder () {
      return this.model + ' / ' + this.max
    },

    __boundaryLinks () {
      return this.__getBool(this.boundaryLinks, this.input)
    },

    __boundaryNumbers () {
      return this.__getBool(this.boundaryNumbers, !this.input)
    },

    __directionLinks () {
      return this.__getBool(this.directionLinks, this.input)
    },

    __ellipses () {
      return this.__getBool(this.ellipses, !this.input)
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
      if (this.disable === true) {
        return {
          'aria-disabled': ''
        }
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

    __update () {
      this.model = this.newPage
      this.newPage = null
    },

    __getBool (val, otherwise) {
      return [true, false].includes(val)
        ? val
        : otherwise
    },

    __getBtn (h, data, props, page) {
      data.props = {
        color: this.color,
        flat: true,
        size: this.size,
        ...props
      }

      if (page !== void 0) {
        if (this.toFn !== void 0) {
          data.props.to = this.toFn(page)
        }
        else {
          data.on = { click: () => this.set(page) }
        }
      }

      return h(QBtn, data)
    }
  },

  render (h) {
    const
      contentStart = [],
      contentEnd = [],
      contentMiddle = []

    if (this.__boundaryLinks) {
      contentStart.push(this.__getBtn(h, {
        key: 'bls'
      }, {
        disable: this.disable || this.value <= this.min,
        icon: this.icons[0]
      }, this.min))
      contentEnd.unshift(this.__getBtn(h, {
        key: 'ble'
      }, {
        disable: this.disable || this.value >= this.max,
        icon: this.icons[3]
      }, this.max))
    }

    if (this.__directionLinks) {
      contentStart.push(this.__getBtn(h, {
        key: 'bdp'
      }, {
        disable: this.disable || this.value <= this.min,
        icon: this.icons[1]
      }, this.value - 1))
      contentEnd.unshift(this.__getBtn(h, {
        key: 'bdn'
      }, {
        disable: this.disable || this.value >= this.max,
        icon: this.icons[2]
      }, this.value + 1))
    }

    if (this.input === true) {
      contentMiddle.push(h(QInput, {
        staticClass: 'inline',
        style: {
          width: `${this.inputPlaceholder.length / 1.5}em`
        },
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
          min: this.min,
          max: this.max
        },
        on: cache(this, 'inp', {
          input: value => { this.newPage = value },
          keyup: e => { isKeyCode(e, 13) === true && this.__update() },
          blur: this.__update
        })
      }))
    }
    else { // is type select
      let
        maxPages = Math.max(
          this.maxPages,
          1 + (this.__ellipses ? 2 : 0) + (this.__boundaryNumbers ? 2 : 0)
        ),
        pgFrom = this.min,
        pgTo = this.max,
        ellipsesStart = false,
        ellipsesEnd = false,
        boundaryStart = false,
        boundaryEnd = false

      if (this.maxPages && maxPages < (this.max - this.min + 1)) {
        maxPages = 1 + Math.floor(maxPages / 2) * 2
        pgFrom = Math.max(this.min, Math.min(this.max - maxPages + 1, this.value - Math.floor(maxPages / 2)))
        pgTo = Math.min(this.max, pgFrom + maxPages - 1)
        if (this.__boundaryNumbers) {
          boundaryStart = true
          pgFrom += 1
        }
        if (this.__ellipses && pgFrom > (this.min + (this.__boundaryNumbers ? 1 : 0))) {
          ellipsesStart = true
          pgFrom += 1
        }
        if (this.__boundaryNumbers) {
          boundaryEnd = true
          pgTo -= 1
        }
        if (this.__ellipses && pgTo < (this.max - (this.__boundaryNumbers ? 1 : 0))) {
          ellipsesEnd = true
          pgTo -= 1
        }
      }
      const style = {
        minWidth: `${Math.max(2, String(this.max).length)}em`
      }
      if (boundaryStart) {
        const active = this.min === this.value
        contentStart.push(this.__getBtn(h, {
          key: 'bns',
          style
        }, {
          disable: this.disable,
          flat: !active,
          textColor: active ? this.textColor : null,
          label: this.min,
          ripple: false
        }, this.min))
      }
      if (boundaryEnd) {
        const active = this.max === this.value
        contentEnd.unshift(this.__getBtn(h, {
          key: 'bne',
          style
        }, {
          disable: this.disable,
          flat: !active,
          textColor: active ? this.textColor : null,
          label: this.max,
          ripple: false
        }, this.max))
      }
      if (ellipsesStart) {
        contentStart.push(this.__getBtn(h, {
          key: 'bes',
          style
        }, {
          disable: this.disable,
          label: '…'
        }, pgFrom - 1))
      }
      if (ellipsesEnd) {
        contentEnd.unshift(this.__getBtn(h, {
          key: 'bee',
          style
        }, {
          disable: this.disable,
          label: '…'
        }, pgTo + 1))
      }
      for (let i = pgFrom; i <= pgTo; i++) {
        const active = i === this.value
        contentMiddle.push(this.__getBtn(h, {
          key: `bpg${i}`,
          style
        }, {
          disable: this.disable,
          flat: !active,
          textColor: active ? this.textColor : null,
          label: i,
          ripple: false
        }, i))
      }
    }

    return h('div', {
      staticClass: 'q-pagination row no-wrap items-center',
      class: { disabled: this.disable },
      attrs: this.attrs,
      on: this.$listeners
    }, [
      contentStart,

      h('div', {
        staticClass: 'row justify-center',
        on: this.input === true
          ? cache(this, 'stop', { input: stop })
          : null
      }, [
        contentMiddle
      ]),

      contentEnd
    ])
  }
})
