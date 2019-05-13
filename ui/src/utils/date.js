/* eslint no-fallthrough: 0 */

import { isDate } from './is.js'
import { pad, capitalize } from './format.js'
import lang from '../lang.js'

const
  MILLISECONDS_IN_DAY = 86400000,
  MILLISECONDS_IN_HOUR = 3600000,
  MILLISECONDS_IN_MINUTE = 60000,
  token = /\[((?:[^\]\\]|\\]|\\)*)\]|d{1,4}|M{1,4}|m{1,2}|w{1,2}|Qo|Do|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g,
  parseConvertFns = {}

function formatTimezone (offset, delimeter = '') {
  const
    sign = offset > 0 ? '-' : '+',
    absOffset = Math.abs(offset),
    hours = Math.floor(absOffset / 60),
    minutes = absOffset % 60

  return sign + pad(hours) + delimeter + pad(minutes)
}

function setMonth (date, newMonth /* 1-based */) {
  const
    test = new Date(date.getFullYear(), newMonth, 0, 0, 0, 0, 0),
    days = test.getDate()

  date.setMonth(newMonth - 1, Math.min(days, date.getDate()))
}

function getChange (date, mod, add) {
  const
    t = new Date(date),
    sign = (add ? 1 : -1)

  Object.keys(mod).forEach(key => {
    if (key === 'month') {
      setMonth(t, t.getMonth() + 1 + sign * mod.month)
      return
    }

    const op = key === 'year'
      ? 'FullYear'
      : capitalize(key === 'days' ? 'date' : key)
    t[`set${op}`](t[`get${op}`]() + sign * mod[key])
  })
  return t
}

function maskToRegex (mask, monthsJoined, monthsShortJoined) {
  let index = 0

  const
    maskMap = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      meridiem: null,
      tz_s: null,
      tz_h: null,
      tz_m: null
    },
    maskText = mask
      .replace(token, function (match, text) {
        switch (match) {
          case 'YYYY':
          case 'YY':
            maskMap.year = (++index)
            return '##YEAR##'
          case 'MM':
          case 'M':
            maskMap.month = (++index)
            return '##MONTH_NUM##'
          case 'MMMM':
            maskMap.month = (++index)
            return '##MONTH_LONG##'
          case 'MMM':
            maskMap.month = (++index)
            return '##MONTH_SHORT##'
          case 'DD':
          case 'D':
            maskMap.day = (++index)
            return '##DAY_NUM##'
          case 'Do':
            maskMap.day = (++index)
            return '##DAY_ORD##'
          case 'HH':
          case 'H':
          case 'hh':
          case 'h':
            maskMap.hour = (++index)
            return '##HOUR_NUM##'
          case 'mm':
          case 'm':
            maskMap.minute = (++index)
            return '##MINUTE_NUM##'
          case 'ss':
          case 's':
            maskMap.second = (++index)
            return '##SECOND_NUM##'
          case 'SSS':
          case 'SS':
          case 'S':
            maskMap.millisecond = (++index)
            return '##MILLISECOND_NUM##'
          case 'A':
          case 'aa':
          case 'a':
            maskMap.meridiem = (++index)
            return '##MERIDIEM##'
          case 'ZZ':
          case 'Z':
            maskMap.tz_s = (++index)
            maskMap.tz_h = (++index)
            maskMap.tz_m = (++index)
            return '##TZ##'
          case 'Q':
          case 'DDDD':
          case 'DDD':
          case 'd':
          case 'E':
          case 'ww':
          case 'w':
          case 'X':
          case 'x':
            return '##GENERIC_NUM##'
          case 'Qo':
            return '##GENERIC_ORD##'
          case 'dddd':
          case 'ddd':
          case 'dd':
            return '##GENERIC_TXT##'
          default:
            return (text === void 0 ? match : text.split('\\]').join(']'))
        }
      })
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\$&\\s*')
      .split('##YEAR##').join('(-?\\d*)')
      .split('##MONTH_NUM##').join('(\\d{0,2})')
      .split('##MONTH_LONG##').join('(' + monthsJoined + ')')
      .split('##MONTH_SHORT##').join('(' + monthsShortJoined + ')')
      .split('##DAY_NUM##').join('(\\d{0,2})')
      .split('##DAY_ORD##').join('(\\d{0,2}[^\\d]*?)')
      .split('##HOUR_NUM##').join('(\\d{0,2})')
      .split('##MINUTE_NUM##').join('(\\d{0,2})')
      .split('##SECOND_NUM##').join('(\\d{0,2})')
      .split('##MILLISECOND_NUM##').join('(\\d{0,3})')
      .split('##MERIDIEM##').join('(AM|PM|am|pm|a\\.m\\.|p\\.m\\.)')
      .split('##TZ##').join('(?:(Z)()()|([+-])?(\\d{2}):?(\\d{2}))')
      .split('##GENERIC_NUM##').join('\\d*')
      .split('##GENERIC_ORD##').join('\\d*[^\\d]*?')
      .split('##GENERIC_TXT##').join('.*?')

  return {
    maskRegex: new RegExp(maskText),
    maskMap
  }
}

function extractWithMask (date, mask, opts) {
  if (typeof mask !== 'string' || mask.length === 0) {
    mask = 'YYYY-MM-DDTHH:mm:ss.sssZ'
  }

  const
    langOpts = opts !== void 0 ? opts : lang.props.date,
    monthsShort = langOpts.monthsShort,
    monthsShortJoined = monthsShort.join('|'),
    months = langOpts.months,
    monthsJoined = months.join('|'),
    key = mask.toLowerCase() + '|' + monthsJoined + monthsShortJoined

  if (parseConvertFns[key] === void 0) {
    const
      { maskRegex, maskMap } = maskToRegex(mask, monthsJoined, monthsShortJoined),
      parseFormatTo = (args) => ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'tz']
        .reduce((acc, key) => {
          if (key === 'month') {
            const val = args[maskMap.month]
            if (/\d+/.test(val) === false) {
              let found = monthsShort.indexOf(val)
              if (found === -1) {
                found = months.indexOf(val)
              }
              if (found > -1) {
                acc.month = found + 1
              }
              else {
                acc.month = null
              }
            }
            else {
              acc.month = parseInt(val, 10)
            }

            if (acc.month > 12 || acc.month === 0) {
              acc.month = acc.month % 12 || 12
            }
            else if (acc.year !== null && acc.month === null) {
              acc.month = 1
            }

            return acc
          }

          if (key === 'hour') {
            let val = parseInt(args[maskMap.hour], 10)

            if (isNaN(val) === false) {
              if (['PM', 'pm', 'p.m.'].indexOf(args[maskMap.meridiem]) > -1) {
                val += 12
              }
              else if (val === 12 && ['AM', 'am', 'a.m.'].indexOf(args[maskMap.meridiem]) > -1) {
                val = 0
              }

              acc.hour = val % 24
            }
            else {
              acc.hour = null
            }

            return acc
          }

          if (key === 'millisecond') {
            const val = args[maskMap.millisecond]

            if (typeof val === 'string' && val.length > 0) {
              acc.millisecond = Math.floor(parseInt(val, 10) * (10 ** (3 - val.length))) % 1000
            }
            else {
              acc.millisecond = null
            }

            return acc
          }

          if (key === 'tz') {
            const tzS = args[maskMap.tz_s]

            if (tzS === 'Z') {
              acc.tz = '+0000'
            }
            else {
              const
                tsH = args[maskMap.tz_h],
                tsM = args[maskMap.tz_h]

              if (typeof tsH === 'string' && tsH.length > 0 && typeof tsM === 'string' && tsM.length > 0) {
                acc.tz = (tzS === '-' ? '-' : '+') + tsH + tsM
              }
              else {
                acc.tz = null
              }
            }

            return acc
          }

          const val = parseInt(args[maskMap[key]], 10)

          acc[key] = isNaN(val) ? null : val

          if (key === 'day' && acc.year !== null && acc.month !== null && acc.day !== null && (acc.day < 1 || acc.day > (new Date(acc.year, acc.month, 0)).getDate())) {
            acc.day = null
          }

          if ((key === 'minute' || key === 'second') && acc[key] !== null) {
            acc[key] = acc[key] % 60
          }

          return acc
        }, {
          year: null,
          month: null,
          day: null,
          hour: null,
          minute: null,
          second: null,
          millisecond: null,
          tz_s: null,
          tz_h: null,
          tz_m: null
        })

    parseConvertFns[key] = text => parseFormatTo(maskRegex.exec(text) || [])
  }

  return parseConvertFns[key](date)
}

export function isValid (date) {
  return typeof date === 'number'
    ? true
    : isNaN(Date.parse(date)) === false
}

export function splitDate (date, mask, opts) {
  if (typeof mask !== 'string' || mask.length === 0) {
    mask = 'YYYY/MM/DD'
  }

  const split = extractWithMask(date, mask, opts)

  return {
    ...split,
    value: split.year === null || split.month === null || split.day === null ? null : date
  }
}

export function splitTime (time, mask, opts) {
  if (typeof mask !== 'string' || mask.length === 0) {
    mask = 'HH:mm:ss'
  }

  const split = extractWithMask(time, mask, opts)

  return {
    ...split,
    value: split.hour === null || split.minute === null ? null : time
  }
}

export function buildDate (mod, utc) {
  return adjustDate(new Date(), mod, utc)
}

export function getDayOfWeek (date) {
  const dow = new Date(date).getDay()
  return dow === 0 ? 7 : dow
}

export function getWeekOfYear (date) {
  // Remove time components of date
  const thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // Change date to Thursday same week
  thursday.setDate(thursday.getDate() - ((thursday.getDay() + 6) % 7) + 3)

  // Take January 4th as it is always in week 1 (see ISO 8601)
  const firstThursday = new Date(thursday.getFullYear(), 0, 4)

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3)

  // Check if daylight-saving-time-switch occurred and correct for it
  const ds = thursday.getTimezoneOffset() - firstThursday.getTimezoneOffset()
  thursday.setHours(thursday.getHours() - ds)

  // Number of weeks between target Thursday and first Thursday
  const weekDiff = (thursday - firstThursday) / (MILLISECONDS_IN_DAY * 7)
  return 1 + Math.floor(weekDiff)
}

export function isBetweenDates (date, from, to, opts = {}) {
  let
    d1 = new Date(from).getTime(),
    d2 = new Date(to).getTime(),
    cur = new Date(date).getTime()

  opts.inclusiveFrom && d1--
  opts.inclusiveTo && d2++

  return cur > d1 && cur < d2
}

export function addToDate (date, mod) {
  return getChange(date, mod, true)
}
export function subtractFromDate (date, mod) {
  return getChange(date, mod, false)
}

export function adjustDate (date, mod, utc) {
  const
    t = new Date(date),
    prefix = `set${utc ? 'UTC' : ''}`

  Object.keys(mod).forEach(key => {
    if (key === 'month') {
      setMonth(t, mod.month)
      return
    }

    const op = key === 'year'
      ? 'FullYear'
      : key.charAt(0).toUpperCase() + key.slice(1)
    t[`${prefix}${op}`](mod[key])
  })

  return t
}

export function startOfDate (date, unit) {
  const t = new Date(date)
  switch (unit) {
    case 'year':
      t.setMonth(0)
    case 'month':
      t.setDate(1)
    case 'day':
      t.setHours(0)
    case 'hour':
      t.setMinutes(0)
    case 'minute':
      t.setSeconds(0)
    case 'second':
      t.setMilliseconds(0)
  }
  return t
}

export function endOfDate (date, unit) {
  const t = new Date(date)
  switch (unit) {
    case 'year':
      t.setMonth(11)
    case 'month':
      t.setDate(daysInMonth(date))
    case 'day':
      t.setHours(23)
    case 'hour':
      t.setMinutes(59)
    case 'minute':
      t.setSeconds(59)
    case 'second':
      t.setMilliseconds(59)
  }
  return t
}

export function getMaxDate (date, ...args) {
  let t = new Date(date)
  args.forEach(d => {
    t = Math.max(t, new Date(d))
  })
  return t
}
export function getMinDate (date, ...args) {
  let t = new Date(date)
  args.forEach(d => {
    t = Math.min(t, new Date(d))
  })
  return t
}

function getDiff (t, sub, interval) {
  return (
    (t.getTime() - t.getTimezoneOffset() * MILLISECONDS_IN_MINUTE) -
    (sub.getTime() - sub.getTimezoneOffset() * MILLISECONDS_IN_MINUTE)
  ) / interval
}

export function getDateDiff (date, subtract, unit = 'days') {
  let
    t = new Date(date),
    sub = new Date(subtract)

  switch (unit) {
    case 'years':
      return (t.getFullYear() - sub.getFullYear())

    case 'months':
      return (t.getFullYear() - sub.getFullYear()) * 12 + t.getMonth() - sub.getMonth()

    case 'days':
      return getDiff(startOfDate(t, 'day'), startOfDate(sub, 'day'), MILLISECONDS_IN_DAY)

    case 'hours':
      return getDiff(startOfDate(t, 'hour'), startOfDate(sub, 'hour'), MILLISECONDS_IN_HOUR)

    case 'minutes':
      return getDiff(startOfDate(t, 'minute'), startOfDate(sub, 'minute'), MILLISECONDS_IN_MINUTE)

    case 'seconds':
      return getDiff(startOfDate(t, 'second'), startOfDate(sub, 'second'), 1000)
  }
}

export function getDayOfYear (date) {
  return getDateDiff(date, startOfDate(date, 'year'), 'days') + 1
}

export function inferDateFormat (date) {
  return isDate(date) === true
    ? 'date'
    : (typeof date === 'number' ? 'number' : 'string')
}

export function getDateBetween (date, min, max) {
  const t = new Date(date)

  if (min) {
    const low = new Date(min)
    if (t < low) {
      return low
    }
  }

  if (max) {
    const high = new Date(max)
    if (t > high) {
      return high
    }
  }

  return t
}

export function isSameDate (date, date2, unit) {
  const
    t = new Date(date),
    d = new Date(date2)

  if (unit === void 0) {
    return t.getTime() === d.getTime()
  }

  switch (unit) {
    case 'second':
      if (t.getSeconds() !== d.getSeconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (t.getMinutes() !== d.getMinutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (t.getHours() !== d.getHours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (t.getDate() !== d.getDate()) {
        return false
      }
    case 'month': // intentional fall-through
      if (t.getMonth() !== d.getMonth()) {
        return false
      }
    case 'year': // intentional fall-through
      if (t.getFullYear() !== d.getFullYear()) {
        return false
      }
      break
    default:
      throw new Error(`date isSameDate unknown unit ${unit}`)
  }

  return true
}

export function daysInMonth (date) {
  return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate()
}

function getOrdinal (n) {
  if (n >= 11 && n <= 13) {
    return `${n}th`
  }
  switch (n % 10) {
    case 1: return `${n}st`
    case 2: return `${n}nd`
    case 3: return `${n}rd`
  }
  return `${n}th`
}

export const formatter = {
  // Year: 00, 01, ..., 99
  YY (date) {
    return pad(date.getFullYear(), 4).substr(2)
  },

  // Year: 1900, 1901, ..., 2099
  YYYY (date) {
    return pad(date.getFullYear(), 4)
  },

  // Month: 1, 2, ..., 12
  M (date) {
    return date.getMonth() + 1
  },

  // Month: 01, 02, ..., 12
  MM (date) {
    return pad(date.getMonth() + 1)
  },

  // Month Short Name: Jan, Feb, ...
  MMM (date, opts) {
    const langOpts = opts !== void 0 ? opts : lang.props.date
    return langOpts.monthsShort[date.getMonth()]
  },

  // Month Name: January, February, ...
  MMMM (date, opts) {
    const langOpts = opts !== void 0 ? opts : lang.props.date
    return langOpts.months[date.getMonth()]
  },

  // Quarter: 1, 2, 3, 4
  Q (date) {
    return Math.ceil((date.getMonth() + 1) / 3)
  },

  // Quarter: 1st, 2nd, 3rd, 4th
  Qo (date) {
    return getOrdinal(this.Q(date))
  },

  // Day of month: 1, 2, ..., 31
  D (date) {
    return date.getDate()
  },

  // Day of month: 1st, 2nd, ..., 31st
  Do (date) {
    return getOrdinal(date.getDate())
  },

  // Day of month: 01, 02, ..., 31
  DD (date) {
    return pad(date.getDate())
  },

  // Day of year: 1, 2, ..., 366
  DDD (date) {
    return getDayOfYear(date)
  },

  // Day of year: 001, 002, ..., 366
  DDDD (date) {
    return pad(getDayOfYear(date), 3)
  },

  // Day of week: 0, 1, ..., 6
  d (date) {
    return date.getDay()
  },

  // Day of week: Su, Mo, ...
  dd (date) {
    return this.dddd(date).slice(0, 2)
  },

  // Day of week: Sun, Mon, ...
  ddd (date, opts) {
    const langOpts = opts !== void 0 ? opts : lang.props.date
    return langOpts.daysShort[date.getDay()]
  },

  // Day of week: Sunday, Monday, ...
  dddd (date, opts) {
    const langOpts = opts !== void 0 ? opts : lang.props.date
    return langOpts.days[date.getDay()]
  },

  // Day of ISO week: 1, 2, ..., 7
  E (date) {
    return date.getDay() || 7
  },

  // Week of Year: 1 2 ... 52 53
  w (date) {
    return getWeekOfYear(date)
  },

  // Week of Year: 01 02 ... 52 53
  ww (date) {
    return pad(getWeekOfYear(date))
  },

  // Hour: 0, 1, ... 23
  H (date) {
    return date.getHours()
  },

  // Hour: 00, 01, ..., 23
  HH (date) {
    return pad(date.getHours())
  },

  // Hour: 1, 2, ..., 12
  h (date) {
    const hours = date.getHours()
    if (hours === 0) {
      return 12
    }
    if (hours > 12) {
      return hours % 12
    }
    return hours
  },

  // Hour: 01, 02, ..., 12
  hh (date) {
    return pad(this.h(date))
  },

  // Minute: 0, 1, ..., 59
  m (date) {
    return date.getMinutes()
  },

  // Minute: 00, 01, ..., 59
  mm (date) {
    return pad(date.getMinutes())
  },

  // Second: 0, 1, ..., 59
  s (date) {
    return date.getSeconds()
  },

  // Second: 00, 01, ..., 59
  ss (date) {
    return pad(date.getSeconds())
  },

  // 1/10 of second: 0, 1, ..., 9
  S (date) {
    return Math.floor(date.getMilliseconds() / 100)
  },

  // 1/100 of second: 00, 01, ..., 99
  SS (date) {
    return pad(Math.floor(date.getMilliseconds() / 10))
  },

  // Millisecond: 000, 001, ..., 999
  SSS (date) {
    return pad(date.getMilliseconds(), 3)
  },

  // Meridiem: AM, PM
  A (date) {
    return this.H(date) < 12 ? 'AM' : 'PM'
  },

  // Meridiem: am, pm
  a (date) {
    return this.H(date) < 12 ? 'am' : 'pm'
  },

  // Meridiem: a.m., p.m
  aa (date) {
    return this.H(date) < 12 ? 'a.m.' : 'p.m.'
  },

  // Timezone: -01:00, +00:00, ... +12:00
  Z (date) {
    return formatTimezone(date.getTimezoneOffset(), ':')
  },

  // Timezone: -0100, +0000, ... +1200
  ZZ (date) {
    return formatTimezone(date.getTimezoneOffset())
  },

  // Seconds timestamp: 512969520
  X (date) {
    return Math.floor(date.getTime() / 1000)
  },

  // Milliseconds timestamp: 512969520900
  x (date) {
    return date.getTime()
  }
}

export function formatDate (val, mask, opts) {
  if (
    (val !== 0 && !val) ||
    val === Infinity ||
    val === -Infinity
  ) {
    return
  }

  let date = new Date(val)

  if (isNaN(date)) {
    return
  }

  if (mask === void 0) {
    mask = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  }

  return mask.replace(
    token,
    (match, text) => match in formatter
      ? formatter[match](date, opts)
      : (text === void 0 ? match : text.split('\\]').join(']'))
  )
}

export function clone (date) {
  return isDate(date) === true
    ? new Date(date.getTime())
    : date
}

export default {
  isValid,
  splitDate,
  splitTime,
  buildDate,
  getDayOfWeek,
  getWeekOfYear,
  isBetweenDates,
  addToDate,
  subtractFromDate,
  adjustDate,
  startOfDate,
  endOfDate,
  getMaxDate,
  getMinDate,
  getDateDiff,
  getDayOfYear,
  inferDateFormat,
  getDateBetween,
  isSameDate,
  daysInMonth,
  formatter,
  formatDate,
  clone
}
