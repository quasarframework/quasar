import { toJalaali } from '../utils/date-persian.js'

import DarkMixin from './dark.js'
import FormMixin from './form.js'
import ListenersMixin from './listeners.js'

import { pad } from '../utils/format.js'

const calendars = [ 'gregorian', 'persian' ]

export default {
  mixins: [ DarkMixin, FormMixin, ListenersMixin ],

  props: {
    value: {
      required: true
    },

    mask: {
      type: String
    },
    locale: Object,

    calendar: {
      type: String,
      validator: v => calendars.includes(v),
      default: 'gregorian'
    },

    landscape: Boolean,

    color: String,
    textColor: String,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,

    readonly: Boolean,
    disable: Boolean
  },

  computed: {
    computedMask () {
      return this.__getMask()
    },

    computedLocale () {
      return this.__getLocale()
    },

    editable () {
      return this.disable !== true && this.readonly !== true
    },

    computedColor () {
      return this.color || 'primary'
    },

    computedTextColor () {
      return this.textColor || 'white'
    },

    computedTabindex () {
      return this.editable === true ? 0 : -1
    },

    headerClass () {
      const cls = []
      this.color !== void 0 && cls.push(`bg-${this.color}`)
      this.textColor !== void 0 && cls.push(`text-${this.textColor}`)
      return cls.join(' ')
    }
  },

  methods: {
    __getLocale () {
      return this.locale !== void 0
        ? { ...this.$q.lang.date, ...this.locale }
        : this.$q.lang.date
    },

    __getCurrentDate (dateOnly) {
      const d = new Date()
      const timeFill = dateOnly === true ? null : 0

      if (this.calendar === 'persian') {
        const jDate = toJalaali(d)
        return {
          year: jDate.jy,
          month: jDate.jm,
          day: jDate.jd
        }
      }

      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: timeFill,
        minute: timeFill,
        second: timeFill,
        millisecond: timeFill
      }
    },

    __getCurrentTime () {
      const d = new Date()

      return {
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
        millisecond: d.getMilliseconds()
      }
    },

    __getDayHash (date) {
      return date.year + '/' + pad(date.month) + '/' + pad(date.day)
    }
  }
}
