/* eslint key-spacing: 0 */

import {
  dayNames,
  dayShortNames,
  monthNames,
  monthShortNames,
  getDayOfWeek,
  getWeek
} from './date'

const
  units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'],
  token = /d{3,4}|D{1,2}|M{1,4}|YY(?:YY)?|([HhMmsTt])\1?|[LlSZWE]|'[^']*'|'[^']*'/g,
  timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
  timezoneClip = /[^-+\dA-Z]/g

export function humanStorageSize (bytes) {
  let u = 0

  while (Math.abs(bytes) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(1)} ${units[u]}`
}

export function between (v, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, v))
}

export function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1)

  let index = v % size
  if (index < min) {
    index = size + index
  }

  return index
}

export function pad (v, length = 2, char = '0') {
  let val = '' + v
  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}

export function formatDate (val, mask = 'DDDD MMM dd YYYY HH:mm:ss', { utc, gmt } = {}) {
  if (val === undefined) {
    return
  }

  const
    date = new Date(val),
    _ = utc ? 'getUTC' : 'get',
    d = date[_ + 'Date'](),
    D = date[_ + 'Day'](),
    M = date[_ + 'Month'](),
    Y = date[_ + 'FullYear'](),
    H = date[_ + 'Hours'](),
    m = date[_ + 'Minutes'](),
    s = date[_ + 'Seconds'](),
    L = date[_ + 'Milliseconds'](),
    // o = utc ? 0 : date.getTimezoneOffset(),
    W = getWeek(date),
    E = getDayOfWeek(date),
    flags = {
      DD:   pad(d),
      D:    d,
      dddd: dayNames[D],
      ddd:  dayShortNames[D],
      d:    D,
      MMMM: monthNames[M],
      MMM:  monthShortNames[M],
      MM:   pad(M + 1),
      M:    M + 1,
      YYYY: Y,
      YY:   ('' + Y).slice(2),
      hh:   pad(H % 12 || 12),
      h:    H % 12 || 12,
      HH:   pad(H),
      H:    H,
      mm:   pad(m),
      m:    m,
      ss:   pad(s),
      s:    s,
      l:    pad(L, 3),
      L:    pad(Math.round(L / 10)),
      tt:   H < 12 ? 'am' : 'pm',
      t:    H < 12 ? 'a' : 'p',
      TT:   H < 12 ? 'AM' : 'PM',
      T:    H < 12 ? 'A' : 'P',
      Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
      // o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      // o:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10],
      W:    W,
      E:    E
    }

  return mask.replace(token, function (match) {
    if (match in flags) {
      return flags[match]
    }
    return match.slice(1, match.length - 1)
  })
}
