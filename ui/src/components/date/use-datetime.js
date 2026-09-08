import { computed } from 'vue'

import { toJalaali } from '../../utils/date/private.persian.js'
import { pad } from '../../utils/format/format.js'

const calendars = ['gregorian', 'persian']

export const useDatetimeProps = {
  // should define modelValue in the target component

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
}

export const useDatetimeEmits = ['update:modelValue']

export function getDayHash(date) {
  return date.year + '/' + pad(date.month) + '/' + pad(date.day)
}

export default function useDatetime(props, $q) {
  const editable = computed(() => !props.disable && !props.readonly)
  const tabindex = computed(() => (editable.value ? 0 : -1))

  const headerClass = computed(() => {
    const cls = []
    if (props.color !== void 0) cls.push(`bg-${props.color}`)
    if (props.textColor !== void 0) cls.push(`text-${props.textColor}`)
    return cls.join(' ')
  })

  function getLocale() {
    return {
      formatNumber: $q.lang.formatNumber,
      ...$q.lang.date,
      ...props.locale
    }
  }

  function getCurrentDate(dateOnly) {
    const d = new Date()
    const timeFill = dateOnly ? null : 0

    if (props.calendar === 'persian') {
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
  }

  return {
    editable,
    tabindex,
    headerClass,

    getLocale,
    getCurrentDate
  }
}
