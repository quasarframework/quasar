/* eslint no-fallthrough: 0 */

import { isDate } from './is'

export const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]
export const dayShortNames = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
]

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
export const monthShortNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function getDayOfWeek (date) {
  const dow = date.getDay()
  return dow === 0 ? 7 : dow
}

export function getWeek (date) {
  // Remove time components of date
  const targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // Change date to Thursday same week
  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3)

  // Take January 4th as it is always in week 1 (see ISO 8601)
  const firstThursday = new Date(targetThursday.getFullYear(), 0, 4)

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3)

  // Check if daylight-saving-time-switch occurred and correct for it
  const ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset()
  targetThursday.setHours(targetThursday.getHours() - ds)

  // Number of weeks between target Thursday and first Thursday
  const weekDiff = (targetThursday - firstThursday) / (86400000 * 7)
  return 1 + Math.floor(weekDiff)
}

export function convertDateToFormat (v, example) {
  if (!v) {
    return
  }

  if (isDate(example)) {
    return v
  }
  if (typeof example === 'string') {
    const val = '' + v
    return val.slice(0, val.length - 6)
  }

  return v.getTime()
}

export function normalizeDate (v, min, max) {
  if (min && v < min) {
    return min
  }
  if (max && v > max) {
    return max
  }
  return v
}

export function isOfSameDate (date1, date2, comparer) {
  switch (comparer) {
    case 'second':
      if (date1.getSeconds() !== date2.getSeconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (date1.getMinutes() !== date2.getMinutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (date1.getHours() !== date2.getHours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (date1.getDate() !== date2.getDate()) {
        return false
      }
    case 'month': // intentional fall-through
      if (date1.getMonth() !== date2.getMonth()) {
        return false
      }
    case 'year': // intentional fall-through
      if (date1.getFullYear() !== date2.getFullYear()) {
        return false
      }
      break
    default:
      throw new Error(`date isSame unknown comparer ${comparer}`)
  }
  return true
}
