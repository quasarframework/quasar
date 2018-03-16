import { between } from '../../utils/format'
import { QBtn } from '../btn'
import { QInput } from '../input'
import extend from '../../utils/extend'
import { getEventKey } from '../../utils/event'

export default {
  name: 'QPagination',
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
    size: String,
    disable: Boolean,
    input: Boolean,
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
      validator: v => {
        if (v < 0) {
          console.error('maxPages should not be negative')
          return false
        }
        return true
      }
    }
  },
  data () {
    return {
      newPage: null
    }
  },
  watch: {
    min (value) {
      this.model = this.value
    },
    max (value) {
      this.model = this.value
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        if (this.disable || !val || isNaN(val)) {
          return
        }
        const value = between(parseInt(val, 10), this.min, this.max)
        this.$emit('input', value)
        this.$nextTick(() => {
          if (JSON.stringify(value) !== JSON.stringify(this.value)) {
            this.$emit('change', value)
          }
        })
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
        this.$q.icon.pagination.first,
        this.$q.icon.pagination.prev,
        this.$q.icon.pagination.next,
        this.$q.icon.pagination.last
      ]
      return this.$q.i18n.rtl ? ico.reverse() : ico
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
    __repeatTimeout (count) {
      return Math.max(100, 300 - count * count * 10)
    },
    __getBool (val, otherwise) {
      return [true, false].includes(val)
        ? val
        : otherwise
    },
    __getBtn (h, props) {
      return h(QBtn, extend(true, {
        props: {
          color: this.color,
          flat: true,
          size: this.size
        }
      }, props))
    }
  },
  render (h) {
    const
      contentStart = [],
      contentEnd = [],
      contentMiddle = []

    if (this.__boundaryLinks) {
      contentStart.push(this.__getBtn(h, {
        key: 'bls',
        props: {
          disable: this.disable || this.value <= this.min,
          icon: this.icons[0]
        },
        on: {
          click: () => this.set(this.min)
        }
      }))
      contentEnd.unshift(this.__getBtn(h, {
        key: 'ble',
        props: {
          disable: this.disable || this.value >= this.max,
          icon: this.icons[3]
        },
        on: {
          click: () => this.set(this.max)
        }
      }))
    }

    if (this.__directionLinks) {
      contentStart.push(this.__getBtn(h, {
        key: 'bdp',
        props: {
          disable: this.disable || this.value <= this.min,
          icon: this.icons[1],
          repeatTimeout: this.__repeatTimeout
        },
        on: {
          click: () => this.setByOffset(-1)
        }
      }))
      contentEnd.unshift(this.__getBtn(h, {
        key: 'bdn',
        props: {
          disable: this.disable || this.value >= this.max,
          icon: this.icons[2],
          repeatTimeout: this.__repeatTimeout
        },
        on: {
          click: () => this.setByOffset(1)
        }
      }))
    }

    if (this.input) {
      contentMiddle.push(h(QInput, {
        staticClass: 'inline no-padding',
        style: {
          width: `${this.inputPlaceholder.length}rem`
        },
        props: {
          type: 'number',
          value: this.newPage,
          noNumberToggle: true,
          min: this.min,
          max: this.max,
          color: this.color,
          placeholder: this.inputPlaceholder,
          disable: this.disable,
          hideUnderline: true
        },
        on: {
          input: value => (this.newPage = value),
          keydown: event => (getEventKey(event) === 13 && this.__update()),
          blur: () => this.__update()
        }
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
          style,
          props: {
            disable: this.disable,
            flat: !active,
            textColor: active ? this.textColor : null,
            label: this.min,
            noRipple: true
          },
          on: {
            click: () => this.set(this.min)
          }
        }))
      }
      if (boundaryEnd) {
        const active = this.max === this.value
        contentEnd.unshift(this.__getBtn(h, {
          key: 'bne',
          style,
          props: {
            disable: this.disable,
            flat: !active,
            textColor: active ? this.textColor : null,
            label: this.max,
            noRipple: true
          },
          on: {
            click: () => this.set(this.max)
          }
        }))
      }
      if (ellipsesStart) {
        contentStart.push(this.__getBtn(h, {
          key: 'bes',
          style,
          props: {
            disable: this.disable,
            label: '…',
            repeatTimeout: this.__repeatTimeout
          },
          on: {
            click: () => this.set(pgFrom - 1)
          }
        }))
      }
      if (ellipsesEnd) {
        contentEnd.unshift(this.__getBtn(h, {
          key: 'bee',
          style,
          props: {
            disable: this.disable,
            label: '…',
            repeatTimeout: this.__repeatTimeout
          },
          on: {
            click: () => this.set(pgTo + 1)
          }
        }))
      }
      for (let i = pgFrom; i <= pgTo; i++) {
        const active = i === this.value
        contentMiddle.push(this.__getBtn(h, {
          key: `${i}.${active}`,
          style,
          props: {
            disable: this.disable,
            flat: !active,
            textColor: active ? this.textColor : null,
            label: i,
            noRipple: true
          },
          on: {
            click: () => this.set(i)
          }
        }))
      }
    }

    return h('div', {
      staticClass: 'q-pagination row no-wrap items-center',
      'class': { disabled: this.disable }
    }, [
      contentStart,

      h('div', { staticClass: 'row justify-center' }, [
        contentMiddle
      ]),

      contentEnd
    ])
  }
}
