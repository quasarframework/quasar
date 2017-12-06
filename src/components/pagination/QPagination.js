import { between } from '../../utils/format'
import { QBtn } from '../btn'
import { QInput } from '../input'

export default {
  name: 'q-pagination',
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
    disable: Boolean,
    type: {
      type: String,
      default: 'input',
      validator: t => ['input', 'select'].includes(t)
    },
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
    __getRepeatEasing (from = 300, step = 10, to = 100) {
      return (cnt) => cnt ? Math.max(to, from - cnt * cnt * step) : 100
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (this.disable || !value || isNaN(value)) {
          return
        }
        let model = between(parseInt(value, 10), this.min, this.max)
        if (this.value !== model) {
          this.$emit('input', model)
          this.$emit('change', model)
        }
      }
    },
    inputPlaceholder () {
      return this.model + ' / ' + this.max
    },
    __boundaryLinks () {
      return [true, false].includes(this.boundaryLinks) ? this.boundaryLinks : this.type === 'input'
    },
    __boundaryNumbers () {
      return [true, false].includes(this.boundaryNumbers) ? this.boundaryNumbers : this.type !== 'input'
    },
    __directionLinks () {
      return [true, false].includes(this.directionLinks) ? this.directionLinks : this.type === 'input'
    },
    __ellipses () {
      return [true, false].includes(this.ellipses) ? this.ellipses : this.type !== 'input'
    }
  },
  render (h) {
    const contentStart = []
    const contentEnd = []
    const contentMiddle = []
    if (this.__boundaryLinks) {
      contentStart.push(h(QBtn, {
        key: 'bls',
        props: {
          disable: this.disable || this.value <= this.min,
          color: this.color,
          flat: true,
          compact: true,
          small: true,
          icon: this.$q.icon.pagination.first
        },
        on: {
          click: () => this.set(this.min)
        }
      }))
      contentEnd.unshift(h(QBtn, {
        key: 'ble',
        props: {
          disable: this.disable || this.value >= this.max,
          color: this.color,
          flat: true,
          compact: true,
          small: true,
          icon: this.$q.icon.pagination.last
        },
        on: {
          click: () => this.set(this.max)
        }
      }))
    }
    if (this.__directionLinks) {
      contentStart.push(h(QBtn, {
        key: 'bdp',
        props: {
          disable: this.disable || this.value <= this.min,
          color: this.color,
          flat: true,
          compact: true,
          small: true,
          icon: this.$q.icon.pagination.prev,
          repeatTimeout: this.__getRepeatEasing()
        },
        on: {
          click: () => this.setByOffset(-1)
        }
      }))
      contentEnd.unshift(h(QBtn, {
        key: 'bdn',
        props: {
          disable: this.disable || this.value >= this.max,
          color: this.color,
          flat: true,
          compact: true,
          small: true,
          icon: this.$q.icon.pagination.next,
          repeatTimeout: this.__getRepeatEasing()
        },
        on: {
          click: () => this.setByOffset(1)
        }
      }))
    }
    if (this.type === 'input') {
      contentMiddle.push(h(QInput, {
        staticClass: 'inline no-margin',
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
          disable: this.disable
        },
        on: {
          input: (value) => (this.newPage = value),
          keyup: (event) => (event.keyCode === 13 && this.__update()),
          blur: () => this.__update()
        }
      }))
    }
    else {
      let maxPages = Math.max(this.maxPages, 1 + (this.__ellipses ? 2 : 0) + (this.__boundaryNumbers ? 2 : 0))
      let pgFrom = this.min
      let pgTo = this.max
      let ellipsesStart = false
      let ellipsesEnd = false
      let boundaryStart = false
      let boundaryEnd = false
      if (this.maxPages && maxPages < (this.max - this.min + 1)) {
        maxPages = 1 + Math.floor(maxPages / 2) * 2
        pgFrom = Math.max(this.min, Math.min(this.max - maxPages + 1, this.value - Math.floor(maxPages / 2)))
        pgTo = Math.min(this.max, pgFrom + maxPages - 1)
        if (this.__boundaryNumbers && pgFrom > this.min) {
          boundaryStart = true
          pgFrom += 1
        }
        if (this.__ellipses && pgFrom > (this.min + (this.__boundaryNumbers ? 1 : 0))) {
          ellipsesStart = true
          pgFrom += 1
        }
        if (this.__boundaryNumbers && pgTo < this.max) {
          boundaryEnd = true
          pgTo -= 1
        }
        if (this.__ellipses && pgTo < (this.max - (this.__boundaryNumbers ? 1 : 0))) {
          ellipsesEnd = true
          pgTo -= 1
        }
      }
      const style = {
        minWidth: `${Math.max(1.5, String(this.max).length)}em`
      }
      if (boundaryStart) {
        contentStart.push(h(QBtn, {
          key: 'bns',
          style,
          props: {
            disable: this.disable || this.value <= this.min,
            color: this.color,
            flat: true,
            compact: true
          },
          on: {
            click: () => this.set(this.min)
          }
        }, [ this.min ]))
      }
      if (boundaryEnd) {
        contentEnd.unshift(h(QBtn, {
          key: 'bne',
          style,
          props: {
            disable: this.disable || this.value >= this.max,
            color: this.color,
            flat: true,
            compact: true
          },
          on: {
            click: () => this.set(this.max)
          }
        }, [ this.max ]))
      }
      if (ellipsesStart) {
        contentStart.push(h(QBtn, {
          key: 'bes',
          style,
          props: {
            disable: this.disable,
            color: this.color,
            flat: true,
            compact: true,
            repeatTimeout: this.__getRepeatEasing()
          },
          on: {
            click: () => this.set(pgFrom - 1)
          }
        }, [ '…' ]))
      }
      if (ellipsesEnd) {
        contentEnd.unshift(h(QBtn, {
          key: 'bee',
          style,
          props: {
            disable: this.disable,
            color: this.color,
            flat: true,
            compact: true,
            repeatTimeout: this.__getRepeatEasing()
          },
          on: {
            click: () => this.set(pgTo + 1)
          }
        }, [ '…' ]))
      }
      for (let i = pgFrom; i <= pgTo; i += 1) {
        contentMiddle.push(h(QBtn, {
          key: `${i}.${i === this.value}`,
          style,
          props: {
            disable: this.disable,
            color: this.color,
            flat: i !== this.value,
            compact: true
          },
          on: {
            click: () => this.set(i)
          }
        }, [ i ]))
      }
    }
    return h('div', {
      staticClass: 'q-pagination',
      'class': {
        disabled: this.disable
      }
    }, [
      contentStart,
      h('div', {
        staticClass: 'row wrap justify-center'
      }, [ contentMiddle ]),
      contentEnd
    ])
  }
}
