import { between } from '../../utils/format'
import { inline as props } from './datetime-props'
import {
  convertDateToFormat,
  getDateBetween,
  startOfDate,
  isSameDate
} from '../../utils/date'

export default {
  props,
  computed: {
    model: {
      get () {
        let date = this.value
          ? new Date(this.value)
          : (this.defaultSelection ? new Date(this.defaultSelection) : startOfDate(new Date(), 'day'))

        return getDateBetween(
          date,
          this.pmin,
          this.pmax
        )
      },
      set (val) {
        const date = getDateBetween(val, this.pmin, this.pmax)
        if (!isSameDate(this.value, date)) {
          const val = convertDateToFormat(date, this.value)
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    pmin () {
      return this.min ? new Date(this.min) : null
    },
    pmax () {
      return this.max ? new Date(this.max) : null
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.model.getFullYear()
    },
    month () {
      return this.model.getMonth() + 1
    },
    day () {
      return this.model.getDate()
    },
    minute () {
      return this.model.getMinutes()
    },

    yearInterval () {
      let
        min = this.pmin !== null ? this.pmin.getFullYear() : 1950,
        max = this.pmax !== null ? this.pmax.getFullYear() : 2050
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin !== null ? this.pmin.getFullYear() - 1 : 1949
    },
    monthInterval () {
      let
        min = this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear() ? this.pmin.getMonth() : 0,
        max = this.pmax !== null && this.pmax.getFullYear() === this.model.getFullYear() ? this.pmax.getMonth() : 11
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear()
        ? this.pmin.getMonth()
        : 0
    },

    daysInMonth () {
      return (new Date(this.model.getFullYear(), this.model.getMonth() + 1, 0)).getDate()
    },

    editable () {
      return !this.disable && !this.readonly
    }
  },

  methods: {
    clear () {
      if (this.value !== '') {
        this.$emit('input', '')
        this.$emit('change', '')
      }
    },

    toggleAmPm () {
      if (!this.editable) {
        return
      }
      let
        hour = this.model.getHours(),
        offset = this.am ? 12 : -12

      this.model = new Date(this.model.setHours(hour + offset))
    },

    __parseTypeValue (type, value) {
      if (type === 'month') {
        return between(value, 1, 12)
      }
      if (type === 'date') {
        return between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        let
          min = this.pmin ? this.pmin.getFullYear() : 1950,
          max = this.pmax ? this.pmax.getFullYear() : 2050
        return between(value, min, max)
      }
      if (type === 'hour') {
        return between(value, 0, 23)
      }
      if (type === 'minute') {
        return between(value, 0, 59)
      }
    }
  }
}
