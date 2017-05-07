/* eslint no-fallthrough: 0 */

import { isDate } from './is'
import { pad, capitalize } from './format'

const
  MILLISECONDS_IN_DAY = 86400000,
  MILLISECONDS_IN_HOUR = 360000,
  MILLISECONDS_IN_MINUTE = 60000,
  token = /d{1,4}|M{1,4}|m{1,2}|w{1,2}|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|[QExX]'/g

export const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatTimezone (offset, delimeter) {
  delimeter = delimeter || ''
  var sign = offset > 0 ? '-' : '+'
  var absOffset = Math.abs(offset)
  var hours = Math.floor(absOffset / 60)
  var minutes = absOffset % 60
  return sign + pad(hours) + delimeter + pad(minutes)
}

function getChange (date, mod, add) {
  const
    t = new Date(date),
    sign = (add ? 1 : -1)

  Object.keys(mod).forEach(key => {
    const op = capitalize(key === 'days' ? 'date' : key)
    t[`set${op}`](t[`get${op}`]() + sign * mod[key])
  })
  return t
}

export function isValid (date) {
  const t = Date.parse(date)
  return isNaN(t) === false
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

export function isBetweenDates (date, from, to) {
  const
    d1 = new Date(from).getTime(),
    d2 = new Date(to).getTime(),
    cur = new Date(date).getTime()

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
    const op = key.charAt(0).toUpperCase() + key.slice(1)
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

export function convertDateToFormat (date, example) {
  if (!date) {
    return
  }

  if (isDate(example)) {
    return date
  }
  if (typeof example === 'number') {
    return date.getTime()
  }

  return formatDate(date)
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
      if (t.getUTCSeconds() !== d.getUTCSeconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (t.getUTCMinutes() !== d.getUTCMinutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (t.getUTCHours() !== d.getUTCHours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (t.getUTCDate() !== d.getUTCDate()) {
        return false
      }
    case 'month': // intentional fall-through
      if (t.getUTCMonth() !== d.getUTCMonth()) {
        return false
      }
    case 'year': // intentional fall-through
      if (t.getUTCFullYear() !== d.getUTCFullYear()) {
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

export const formatter = {
  // Month: 1, 2, ..., 12
  M (date) {
    return date.getMonth() + 1
  },

  // Month: 01, 02, ..., 12
  MM (date) {
    return pad(date.getMonth() + 1)
  },

  // Day of week: Sun, Mon, ...
  MMM (date) {
    return this.MMMM(date).slice(0, 3)
  },

  // Day of week: Sunday, Monday, ...
  MMMM (date) {
    return monthNames[date.getMonth()]
  },

  // Minute: 0, 1, ..., 59
  m (date) {
    return date.getMinutes()
  },

  // Minute: 00, 01, ..., 59
  mm (date) {
    return pad(date.getMinutes())
  },

  // Quarter: 1, 2, 3, 4
  Q (date) {
    return Math.ceil((date.getMonth() + 1) / 3)
  },

  // Day of month: 1, 2, ..., 31
  D (date) {
    return date.getDate()
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
  ddd (date) {
    return this.dddd(date).slice(0, 3)
  },

  // Day of week: Sunday, Monday, ...
  dddd (date) {
    return dayNames[date.getDay()]
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

  // Year: 00, 01, ..., 99
  YY (date) {
    return pad(date.getFullYear(), 4).substr(2)
  },

  // Year: 1900, 1901, ..., 2099
  YYYY (date) {
    return pad(date.getFullYear(), 4)
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
    var hours = date.getHours()
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

export function formatDate (val, mask = 'YYYY-MM-DDTHH:mm:ss.SSSZ') {
  if (!val) {
    return
  }

  let date = new Date(val)

  return mask.replace(token, function (match) {
    if (match in formatter) {
      return formatter[match](date)
    }
    return match
  })
}
