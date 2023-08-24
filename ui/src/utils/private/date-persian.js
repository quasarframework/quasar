// taken from https://github.com/jalaali/jalaali-js

/*
  Jalaali years starting the 33-year rule.
*/
const breaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
]

/*
  Converts a Gregorian date to Jalaali.
*/
export function toJalaali (gy, gm, gd) {
  if (Object.prototype.toString.call(gy) === '[object Date]') {
    gd = gy.getDate()
    gm = gy.getMonth() + 1
    gy = gy.getFullYear()
  }
  return d2j(g2d(gy, gm, gd))
}

/*
  Converts a Jalaali date to Gregorian.
*/
export function toGregorian (jy, jm, jd) {
  return d2g(j2d(jy, jm, jd))
}

/*
  Is this a leap year or not?
*/
function isLeapJalaaliYear (jy) {
  return jalCalLeap(jy) === 0
}

/*
  Number of days in a given month in a Jalaali year.
*/
export function jalaaliMonthLength (jy, jm) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  if (isLeapJalaaliYear(jy)) return 30
  return 29
}

/*
    This function determines if the Jalaali (Persian) year is
    leap (366-day long) or is the common year (365 days)

    @param jy Jalaali calendar year (-61 to 3177)
    @returns number of years since the last leap year (0 to 4)
 */
function jalCalLeap (jy) {
  const bl = breaks.length
  let
    jp = breaks[ 0 ],
    jm,
    jump,
    leap,
    n,
    i

  if (jy < jp || jy >= breaks[ bl - 1 ]) { throw new Error('Invalid Jalaali year ' + jy) }

  for (i = 1; i < bl; i += 1) {
    jm = breaks[ i ]
    jump = jm - jp
    if (jy < jm) { break }
    jp = jm
  }
  n = jy - jp

  if (jump - n < 6) { n = n - jump + div(jump + 4, 33) * 33 }
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return leap
}

/*
  This function determines if the Jalaali (Persian) year is
  leap (366-day long) or is the common year (365 days), and
  finds the day in March (Gregorian calendar) of the first
  day of the Jalaali year (jy).

  @param jy Jalaali calendar year (-61 to 3177)
  @param withoutLeap when don't need leap (true or false) default is false
  @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Jalaali year
    march: the March day of Farvardin the 1st (1st day of jy)
  @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
  @see: http://www.fourmilab.ch/documents/calendar/
*/
function jalCal (jy, withoutLeap) {
  const
    bl = breaks.length,
    gy = jy + 621
  let
    leapJ = -14,
    jp = breaks[ 0 ],
    jm,
    jump,
    leap,
    n,
    i

  if (jy < jp || jy >= breaks[ bl - 1 ]) { throw new Error('Invalid Jalaali year ' + jy) }

  // Find the limiting years for the Jalaali year jy.
  for (i = 1; i < bl; i += 1) {
    jm = breaks[ i ]
    jump = jm - jp
    if (jy < jm) { break }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  n = jy - jp

  // Find the number of leap years from AD 621 to the beginning
  // of the current Jalaali year in the Persian calendar.
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4) { leapJ += 1 }

  // And the same in the Gregorian calendar (until the year gy).
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

  // Determine the Gregorian date of Farvardin the 1st.
  const march = 20 + leapJ - leapG

  // Find how many years have passed since the last leap year.
  if (!withoutLeap) {
    if (jump - n < 6) { n = n - jump + div(jump + 4, 33) * 33 }
    leap = mod(mod(n + 1, 33) - 1, 4)
    if (leap === -1) {
      leap = 4
    }
  }

  return {
    leap,
    gy,
    march
  }
}

/*
  Converts a date of the Jalaali calendar to the Julian Day number.

  @param jy Jalaali year (1 to 3100)
  @param jm Jalaali month (1 to 12)
  @param jd Jalaali day (1 to 29/31)
  @return Julian Day number
*/
function j2d (jy, jm, jd) {
  const r = jalCal(jy, true)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

/*
  Converts the Julian Day number to a date in the Jalaali calendar.

  @param jdn Julian Day number
  @return
    jy: Jalaali year (1 to 3100)
    jm: Jalaali month (1 to 12)
    jd: Jalaali day (1 to 29/31)
*/
function d2j (jdn) {
  const gy = d2g(jdn).gy // Calculate Gregorian year (gy).
  let
    jy = gy - 621,
    jd,
    jm,
    k
  const
    r = jalCal(jy, false),
    jdn1f = g2d(gy, 3, r.march)

  // Find number of days that passed since 1 Farvardin.
  k = jdn - jdn1f
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return {
        jy,
        jm,
        jd
      }
    }
    else {
      // The remaining months.
      k -= 186
    }
  }
  else {
    // Previous Jalaali year.
    jy -= 1
    k += 179
    if (r.leap === 1) { k += 1 }
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return {
    jy,
    jm,
    jd
  }
}

/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d (gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param jdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g (jdn) {
  let j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const
    i = div(mod(j, 1461), 4) * 5 + 308,
    gd = div(mod(i, 153), 5) + 1,
    gm = mod(div(i, 153), 12) + 1,
    gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return {
    gy,
    gm,
    gd
  }
}

/*
  Utility helper functions.
*/

function div (a, b) {
  return ~~(a / b)
}

function mod (a, b) {
  return a - ~~(a / b) * b
}
