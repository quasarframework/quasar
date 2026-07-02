import { computed } from 'vue'

import { toJalaali } from '../../utils/date/private.persian.js'
import { pad } from '../../utils/format/format.js'

const calendars = ['gregorian', 'persian']

export const useDatetimeProps = {
  // should define modelValue in the target component

  /**
   * Mask (formatting string) used for parsing and formatting value
   *
   * @api prop mask
   * @type {String}
   * @category model
   */
  mask: {
    type: String
  },

  /**
   * Locale formatting options
   *
   * @api prop locale
   * @type {Object}
   * @category model
   * @example { monthsShort: [ 'Ian', 'Feb', 'Mar', '...' ] }
   * @definition days List of full day names (DDDD), starting with Sunday
   * @definition daysShort List of short day names (DDD), starting with Sunday
   * @definition months List of full month names (MMMM), starting with January
   * @definition monthsShort List of short month names (MMM), starting with January
   */
  locale: Object,

  /**
   * Specify calendar type
   *
   * @api prop calendar
   * @type {String}
   * @default 'gregorian'
   * @category model
   * @value 'gregorian'
   * @value 'persian'
   */
  calendar: {
    type: String,
    validator: v => calendars.includes(v),
    default: 'gregorian'
  },

  /**
   * Display the component in landscape mode
   *
   * @api prop landscape
   * @type {Boolean}
   * @category behavior
   */
  landscape: Boolean,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Overrides text color, if needed; Color name from the Quasar Color Palette
   *
   * @api prop text-color
   * @extends text-color
   */
  textColor: String,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Applies a 'flat' design (no default shadow)
   *
   * @api prop flat
   * @extends flat
   */
  flat: Boolean,

  /**
   * Applies a default border to the component
   *
   * @api prop bordered
   * @extends bordered
   */
  bordered: Boolean,

  /**
   * Put component in readonly mode
   *
   * @api prop readonly
   * @extends readonly
   */
  readonly: Boolean,

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @extends disable
   */
  disable: Boolean
}

export const useDatetimeEmits = [
  /**
   * Emitted when the component needs to change the model
   *
   * @api event update:modelValue
   * @param {String|Array|Object|null} value New model value
   */
  'update:modelValue'
]

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
    return props.locale !== void 0
      ? { ...$q.lang.date, ...props.locale }
      : $q.lang.date
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
