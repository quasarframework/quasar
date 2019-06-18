import { toJalaali } from '../../utils/date-persian.js'

export default {
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
      validator: v => ['gregorian', 'persian'].includes(v),
      default: 'gregorian'
    },

    landscape: Boolean,

    color: String,
    textColor: String,
    dark: Boolean,

    readonly: Boolean,
    disable: Boolean
  },

  watch: {
    mask () {
      this.$nextTick(() => {
        this.__updateValue({}, /* reason for QDate only */ 'mask')
      })
    },

    computedLocale () {
      this.$nextTick(() => {
        this.__updateValue({}, /* reason for QDate only */ 'locale')
      })
    }
  },

  computed: {
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
    },

    computedLocale () {
      return this.__getComputedLocale()
    }
  },

  methods: {
    __getComputedLocale () {
      return this.locale || this.$q.lang.date
    },

    __getCurrentDate () {
      const d = new Date()

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
        day: d.getDate()
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
    }
  }
}
