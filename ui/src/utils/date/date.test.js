// oxlint-disable import/no-named-as-default-member

import { afterEach, describe, expect, test } from 'vitest'

import date, { __splitDate, getWeekOfYear } from './date.js'

describe('[date API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getWeekOfYear]', () => {
      const originalTZ = process.env.TZ
      afterEach(() => {
        if (originalTZ === void 0) delete process.env.TZ
        else process.env.TZ = originalTZ
      })

      // Mon 8 Apr 2024 is ISO week 15 (Jan 1 2024 is a Monday).
      test('is correct across a DST switch (southern hemisphere)', () => {
        process.env.TZ = 'Australia/Sydney' // January in DST, April not
        expect(getWeekOfYear(new Date(2024, 3, 8, 12, 0, 0))).toBe(15)
      })

      test('is correct in a northern-hemisphere zone', () => {
        process.env.TZ = 'America/New_York'
        expect(getWeekOfYear(new Date(2024, 3, 8, 12, 0, 0))).toBe(15)
      })

      test.each([
        [new Date(2020, 11, 31, 12), 53],
        [new Date(2021, 0, 1, 12), 53],
        [new Date(2021, 0, 4, 12), 1],
        [new Date(2022, 0, 2, 12), 52]
      ])('handles ISO week-year boundaries', (value, expected) => {
        expect(getWeekOfYear(value)).toBe(expected)
      })
    })

    describe('[(function)isValid]', () => {
      test.each([
        [0, true],
        [Date.UTC(2024, 1, 29), true],
        ['2024-02-29T12:00:00.000Z', true],
        ['not a date', false],
        ['', false],
        [Number.POSITIVE_INFINITY, false],
        [Number.NaN, false],
        [void 0, false]
      ])('validates %o', (value, expected) => {
        expect(date.isValid(value)).toBe(expected)
      })
    })

    describe('[(function)extractDate]', () => {
      test('extracts all local date and time components', () => {
        const result = date.extractDate(
          '2024-02-29 13:05:06.789',
          'YYYY-MM-DD HH:mm:ss.SSS'
        )

        expect([
          result.getFullYear(),
          result.getMonth(),
          result.getDate(),
          result.getHours(),
          result.getMinutes(),
          result.getSeconds(),
          result.getMilliseconds()
        ]).toStrictEqual([2024, 1, 29, 13, 5, 6, 789])
      })

      test('honors an explicit timezone offset', () => {
        const value = '2024-02-29T13:05:06.789+02:30'

        expect(
          date.extractDate(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').getTime()
        ).toBe(Date.parse(value))
      })

      test('accepts a valid prefix when the input continues beyond the mask', () => {
        expect(
          date.extractDate('2024-02-29T13:05:06Z', 'YYYY-MM-DD')
        ).toStrictEqual(new Date(2024, 1, 29))
      })

      test('parses a literal Z timezone as UTC', () => {
        expect(
          date.extractDate('2024-02-29 13:05 Z', 'YYYY-MM-DD HH:mm Z').getTime()
        ).toBe(Date.UTC(2024, 1, 29, 13, 5))
      })

      test.each([
        [void 0, 'YYYY-MM-DD'],
        [null, 'YYYY-MM-DD'],
        ['', 'YYYY-MM-DD'],
        ['not a date', 'YYYY-MM-DD'],
        ['2024-02', 'YYYY-MM-DD'],
        ['2024-02-30', 'YYYY-MM-DD'],
        ['2024-02-29 24:00', 'YYYY-MM-DD HH:mm'],
        ['2024-02-29 13:60', 'YYYY-MM-DD HH:mm'],
        ['2024-02-29 13:05:60', 'YYYY-MM-DD HH:mm:ss'],
        ['2024-02-29 00:05 PM', 'YYYY-MM-DD hh:mm A'],
        ['2024-02-29 13:05 +2460', 'YYYY-MM-DD HH:mm ZZ']
      ])('returns Invalid Date for %o with mask %s', (value, mask) => {
        const result = date.extractDate(value, mask)

        expect(result).toBeInstanceOf(Date)
        expect(Number.isNaN(result.getTime())).toBe(true)
      })

      test.each(['X', 'x'])(
        'round-trips a pre-1970 date through the %s mask',
        mask => {
          const value = new Date(1950, 5, 15)

          expect(
            date.extractDate(date.formatDate(value, mask), mask).getTime()
          ).toBe(value.getTime())
        }
      )

      test('keeps localized parsers isolated by all embedded locale names', async () => {
        const { default: enUS } = await import('quasar/lang/en-US.js')
        const cases = [
          ['MMMM D YYYY', 'months', 'Alpha 1 2024', 'Beta 1 2024'],
          ['MMM D YYYY', 'monthsShort', 'Alp 1 2024', 'Bet 1 2024'],
          ['ddd YYYY-MM-DD', 'daysShort', 'Alp 2024-01-01', 'Bet 2024-01-01'],
          ['dddd YYYY-MM-DD', 'days', 'Alpha 2024-01-01', 'Beta 2024-01-01']
        ]

        for (const [mask, localeField, firstValue, secondValue] of cases) {
          const firstNames = [...enUS.date[localeField]]
          const secondNames = [...firstNames]
          firstNames[0] = firstValue.split(' ')[0]
          secondNames[0] = secondValue.split(' ')[0]

          const firstLocale = {
            ...enUS.date,
            [localeField]: firstNames
          }
          const secondLocale = {
            ...enUS.date,
            [localeField]: secondNames
          }

          expect(date.extractDate(firstValue, mask, firstLocale)).toStrictEqual(
            new Date(2024, 0, 1)
          )
          expect(
            date.extractDate(secondValue, mask, secondLocale)
          ).toStrictEqual(new Date(2024, 0, 1))
        }
      })

      test.each([
        ['months', 'MMMM D YYYY', ' 1 2024'],
        ['monthsShort', 'MMM D YYYY', ' 1 2024'],
        ['days', 'dddd YYYY-MM-DD', ' 2024-01-01'],
        ['daysShort', 'ddd YYYY-MM-DD', ' 2024-01-01']
      ])(
        'treats regexp metacharacters in custom %s names as literals',
        async (localeField, mask, suffix) => {
          const { default: enUS } = await import('quasar/lang/en-US.js')
          const localeNames = [...enUS.date[localeField]]
          const localeName = [
            localeField,
            String.raw`.*+?^$`,
            '{}()|[name]',
            String.raw`\path`
          ].join('')
          localeNames[0] = localeName

          const locale = {
            ...enUS.date,
            [localeField]: localeNames
          }

          expect(
            date.extractDate(localeName + suffix, mask, locale)
          ).toStrictEqual(new Date(2024, 0, 1))
        }
      )
    })

    describe('[(function)buildDate]', () => {
      test('builds a date from local components', () => {
        const result = date.buildDate({
          year: 2024,
          month: 2,
          date: 29,
          hours: 13,
          minutes: 5,
          seconds: 6,
          milliseconds: 789
        })

        expect([
          result.getFullYear(),
          result.getMonth(),
          result.getDate(),
          result.getHours(),
          result.getMinutes(),
          result.getSeconds(),
          result.getMilliseconds()
        ]).toStrictEqual([2024, 1, 29, 13, 5, 6, 789])
      })

      test('builds a date from UTC components', () => {
        const result = date.buildDate(
          {
            year: 2024,
            month: 2,
            date: 29,
            hours: 13,
            minutes: 5,
            seconds: 6,
            milliseconds: 789
          },
          true
        )

        expect(result.toISOString()).toBe('2024-02-29T13:05:06.789Z')
      })
    })

    describe('[(function)getDayOfWeek]', () => {
      test.each([
        [new Date(2024, 0, 1, 12), 1],
        [new Date(2024, 0, 6, 12), 6],
        [new Date(2024, 0, 7, 12), 7]
      ])('uses ISO weekday numbering', (value, expected) => {
        expect(date.getDayOfWeek(value)).toBe(expected)
      })
    })

    describe('[(function)isBetweenDates]', () => {
      const from = new Date(2024, 0, 10, 10)
      const middle = new Date(2024, 0, 11, 10)
      const to = new Date(2024, 0, 12, 10)

      test('excludes the boundaries by default', () => {
        expect(date.isBetweenDates(middle, from, to)).toBe(true)
        expect(date.isBetweenDates(from, from, to)).toBe(false)
        expect(date.isBetweenDates(to, from, to)).toBe(false)
        expect(date.isBetweenDates(new Date(2024, 0, 9, 10), from, to)).toBe(
          false
        )
        expect(date.isBetweenDates(new Date(2024, 0, 13, 10), from, to)).toBe(
          false
        )
      })

      test('supports inclusive boundaries', () => {
        expect(
          date.isBetweenDates(from, from, to, { inclusiveFrom: true })
        ).toBe(true)
        expect(date.isBetweenDates(to, from, to, { inclusiveTo: true })).toBe(
          true
        )
      })

      test('can compare calendar dates without their times', () => {
        expect(
          date.isBetweenDates(new Date(2024, 0, 10, 23), from, to, {
            inclusiveFrom: true,
            onlyDate: true
          })
        ).toBe(true)
      })
    })

    describe('[(function)addToDate]', () => {
      test('adds units, clamps the month, and preserves its inputs', () => {
        const original = new Date(2024, 0, 31, 10, 20, 30, 400)
        const mod = { months: 1, days: 1, hours: 2 }
        const result = date.addToDate(original, mod)

        expect(result).toStrictEqual(new Date(2024, 2, 1, 12, 20, 30, 400))
        expect(original).toStrictEqual(new Date(2024, 0, 31, 10, 20, 30, 400))
        expect(mod).toStrictEqual({ months: 1, days: 1, hours: 2 })
      })
    })

    describe('[(function)subtractFromDate]', () => {
      test('subtracts units, clamps the month, and preserves its inputs', () => {
        const original = new Date(2024, 2, 31, 10, 20, 30, 400)
        const mod = { month: 1, day: 1, hour: 2 }
        const result = date.subtractFromDate(original, mod)

        expect(result).toStrictEqual(new Date(2024, 1, 28, 8, 20, 30, 400))
        expect(original).toStrictEqual(new Date(2024, 2, 31, 10, 20, 30, 400))
        expect(mod).toStrictEqual({ month: 1, day: 1, hour: 2 })
      })
    })

    describe('[(function)adjustDate]', () => {
      test('sets local components, clamps the day, and preserves its inputs', () => {
        const original = new Date(2024, 0, 31, 10, 20, 30, 400)
        const mod = { year: 2025, month: 2, date: 31, hours: 8 }
        const result = date.adjustDate(original, mod)

        expect(result).toStrictEqual(new Date(2025, 1, 28, 8, 20, 30, 400))
        expect(original).toStrictEqual(new Date(2024, 0, 31, 10, 20, 30, 400))
        expect(mod).toStrictEqual({
          year: 2025,
          month: 2,
          date: 31,
          hours: 8
        })
      })

      test('sets UTC components', () => {
        const result = date.adjustDate(
          new Date('2024-01-31T10:20:30.400Z'),
          { year: 2024, month: 2, date: 29, hours: 8 },
          true
        )

        expect(result.toISOString()).toBe('2024-02-29T08:20:30.400Z')
      })
    })

    describe('[(function)startOfDate]', () => {
      const original = new Date('2024-07-14T13:14:15.678Z')

      test.each([
        ['year', '2024-01-01T00:00:00.000Z'],
        ['month', '2024-07-01T00:00:00.000Z'],
        ['day', '2024-07-14T00:00:00.000Z'],
        ['hour', '2024-07-14T13:00:00.000Z'],
        ['minute', '2024-07-14T13:14:00.000Z'],
        ['second', '2024-07-14T13:14:15.000Z']
      ])('finds the start of the %s in UTC', (unit, expected) => {
        expect(date.startOfDate(original, unit, true).toISOString()).toBe(
          expected
        )
        expect(original.toISOString()).toBe('2024-07-14T13:14:15.678Z')
      })
    })

    describe('[(function)endOfDate]', () => {
      const original = new Date('2024-07-14T13:14:15.678Z')
      const originalTZ = process.env.TZ

      afterEach(() => {
        if (originalTZ === void 0) delete process.env.TZ
        else process.env.TZ = originalTZ
      })

      test.each([
        ['year', '2024-12-31T23:59:59.999Z'],
        ['month', '2024-07-31T23:59:59.999Z'],
        ['day', '2024-07-14T23:59:59.999Z'],
        ['hour', '2024-07-14T13:59:59.999Z'],
        ['minute', '2024-07-14T13:14:59.999Z'],
        ['second', '2024-07-14T13:14:15.999Z']
      ])('finds the end of the %s in UTC', (unit, expected) => {
        expect(date.endOfDate(original, unit, true).toISOString()).toBe(
          expected
        )
        expect(original.toISOString()).toBe('2024-07-14T13:14:15.678Z')
      })

      test.each([
        [
          'America/Los_Angeles',
          '2024-03-01T00:30:00.000Z',
          '2024-03-31T23:59:59.999Z'
        ],
        [
          'Pacific/Kiritimati',
          '2024-01-31T23:30:00.000Z',
          '2024-01-31T23:59:59.999Z'
        ]
      ])('uses the UTC month length in %s', (timezone, value, expected) => {
        process.env.TZ = timezone

        expect(date.endOfDate(value, 'month', true).toISOString()).toBe(
          expected
        )
      })
    })

    describe('[(function)getMaxDate]', () => {
      test('returns the latest date from mixed date inputs', () => {
        expect(
          date.getMaxDate(
            '2024-01-01T00:00:00.000Z',
            Date.parse('2024-03-01T00:00:00.000Z'),
            new Date('2024-02-01T00:00:00.000Z')
          )
        ).toStrictEqual(new Date('2024-03-01T00:00:00.000Z'))
      })
    })

    describe('[(function)getMinDate]', () => {
      test('returns the earliest date from mixed date inputs', () => {
        expect(
          date.getMinDate(
            '2024-03-01T00:00:00.000Z',
            Date.parse('2024-01-01T00:00:00.000Z'),
            new Date('2024-02-01T00:00:00.000Z')
          )
        ).toStrictEqual(new Date('2024-01-01T00:00:00.000Z'))
      })
    })

    describe('[(function)getDateDiff]', () => {
      test.each([
        ['years', new Date(2024, 6, 1), new Date(2021, 11, 31), 3],
        ['months', new Date(2024, 6, 1), new Date(2023, 11, 1), 7],
        ['days', new Date(2024, 2, 11, 12), new Date(2024, 2, 9, 12), 2],
        ['hours', new Date(2024, 0, 1, 15), new Date(2024, 0, 1, 12), 3],
        [
          'minutes',
          new Date(2024, 0, 1, 12, 45),
          new Date(2024, 0, 1, 12, 15),
          30
        ],
        [
          'seconds',
          new Date(2024, 0, 1, 12, 0, 45),
          new Date(2024, 0, 1, 12, 0, 15),
          30
        ]
      ])(
        'calculates the difference in %s',
        (unit, value, subtract, expected) => {
          expect(date.getDateDiff(value, subtract, unit)).toBe(expected)
        }
      )

      test('defaults to calendar days', () => {
        expect(
          date.getDateDiff(new Date(2024, 0, 3), new Date(2024, 0, 1))
        ).toBe(2)
      })
    })

    describe('[(function)getDayOfYear]', () => {
      test.each([
        [new Date(2024, 0, 1, 12), 1],
        [new Date(2024, 1, 29, 12), 60],
        [new Date(2024, 11, 31, 12), 366],
        [new Date(2023, 11, 31, 12), 365]
      ])('returns the one-based calendar day', (value, expected) => {
        expect(date.getDayOfYear(value)).toBe(expected)
      })
    })

    describe('[(function)inferDateFormat]', () => {
      test.each([
        [new Date(), 'date'],
        [Date.now(), 'number'],
        ['2024-02-29', 'string']
      ])('infers the format of %o', (value, expected) => {
        expect(date.inferDateFormat(value)).toBe(expected)
      })
    })

    describe('[(function)getDateBetween]', () => {
      const min = new Date('2024-02-01T00:00:00.000Z')
      const max = new Date('2024-02-29T00:00:00.000Z')

      test('clamps a date to the minimum', () => {
        expect(date.getDateBetween('2024-01-01', min, max)).toStrictEqual(min)
      })

      test('clamps a date to the maximum', () => {
        expect(date.getDateBetween('2024-03-01', min, max)).toStrictEqual(max)
      })

      test('returns a copy when the date is inside the range', () => {
        const value = new Date('2024-02-15T00:00:00.000Z')
        const result = date.getDateBetween(value, min, max)

        expect(result).toStrictEqual(value)
        expect(result).not.toBe(value)
      })
    })

    describe('[(function)isSameDate]', () => {
      const value = new Date(2024, 1, 29, 13, 5, 6, 100)

      test('compares exact timestamps when no unit is supplied', () => {
        expect(date.isSameDate(value, new Date(value))).toBe(true)
        expect(
          date.isSameDate(value, new Date(2024, 1, 29, 13, 5, 6, 101))
        ).toBe(false)
      })

      test.each([
        ['second', new Date(2024, 1, 29, 13, 5, 6, 999), true],
        ['minute', new Date(2024, 1, 29, 13, 5, 59), true],
        ['hour', new Date(2024, 1, 29, 13, 59), true],
        ['day', new Date(2024, 1, 29, 23), true],
        ['month', new Date(2024, 1, 1), true],
        ['year', new Date(2024, 0, 1), true],
        ['second', new Date(2024, 1, 29, 13, 5, 7), false],
        ['day', new Date(2024, 2, 1, 13), false],
        ['year', new Date(2025, 1, 29), false]
      ])('compares through the %s', (unit, other, expected) => {
        expect(date.isSameDate(value, other, unit)).toBe(expected)
      })

      test('rejects an unknown unit', () => {
        expect(() => date.isSameDate(value, value, 'fortnight')).toThrow(
          'date isSameDate unknown unit fortnight'
        )
      })
    })

    describe('[(function)daysInMonth]', () => {
      test.each([
        [new Date(2024, 0, 1), 31],
        [new Date(2024, 1, 1), 29],
        [new Date(2023, 1, 1), 28],
        [new Date(2024, 3, 1), 30]
      ])('returns the number of days in the month', (value, expected) => {
        expect(date.daysInMonth(value)).toBe(expected)
      })
    })

    describe('[(function)formatDate]', () => {
      const dateLocale = {
        days: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        monthsShort: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
      }

      test('formats tokens, literals, locale names, and a forced offset', () => {
        const value = new Date(2024, 1, 29, 13, 5, 6, 789)

        expect(
          date.formatDate(
            value,
            'YYYY-MM-DD MMMM dddd HH:mm:ss.SSS [at] Z ZZ',
            dateLocale,
            void 0,
            90
          )
        ).toBe('2024-02-29 February Thursday 13:05:06.789 at -01:30 -0130')
      })

      test('formats timestamps and a forced year', () => {
        const value = new Date(2024, 1, 29, 13, 5, 6, 789)

        expect(date.formatDate(value, 'YYYY YY X x', dateLocale, 42)).toBe(
          `42 42 ${Math.floor(value.getTime() / 1000)} ${value.getTime()}`
        )
      })

      test.each([
        void 0,
        null,
        '',
        'not a date',
        Number.POSITIVE_INFINITY,
        new Date('bad')
      ])('returns undefined for %o', value => {
        expect(date.formatDate(value)).toBeUndefined()
      })
    })

    describe('[(function)clone]', () => {
      test('clones Date instances', () => {
        const value = new Date('2024-02-29T13:05:06.789Z')
        const result = date.clone(value)

        expect(result).toStrictEqual(value)
        expect(result).not.toBe(value)
      })

      test.each([0, 1_709_211_906_789, '2024-02-29'])(
        'returns non-Date values unchanged',
        value => {
          expect(date.clone(value)).toBe(value)
        }
      )
    })

    describe('[(function)__splitDate]', () => {
      test('splits date, time, and timezone components', () => {
        expect(
          __splitDate(
            '2024-02-29 13:05:06.789 +0230',
            'YYYY-MM-DD HH:mm:ss.SSS ZZ'
          )
        ).toStrictEqual({
          year: 2024,
          month: 2,
          day: 29,
          hour: 13,
          minute: 5,
          second: 6,
          millisecond: 789,
          timezoneOffset: -150,
          dateHash: '2024/02/29',
          timeHash: '13:05:06+0230'
        })
      })

      test('fills omitted components from the default model', () => {
        expect(
          __splitDate('05:30 PM', 'hh:mm A', void 0, void 0, {
            year: 2024,
            month: 7,
            day: 1,
            second: 0,
            millisecond: 0
          })
        ).toStrictEqual({
          year: 2024,
          month: 7,
          day: 1,
          hour: 17,
          minute: 30,
          second: 0,
          millisecond: 0,
          timezoneOffset: null,
          dateHash: '2024/07/01',
          timeHash: '17:30:00'
        })
      })

      test('rejects an impossible calendar date', () => {
        const result = __splitDate('2023-02-29', 'YYYY-MM-DD')

        expect(result.dateHash).toBeNull()
        expect(result.timeHash).toBeNull()
      })

      test.each([
        ['24:00', 'HH:mm', 'hour'],
        ['13:00 PM', 'hh:mm A', 'hour'],
        ['23:60', 'HH:mm', 'minute'],
        ['23:59:60', 'HH:mm:ss', 'second'],
        ['23:59 +2460', 'HH:mm ZZ', 'timezoneOffset']
      ])('rejects out-of-range time components in %s', (value, mask, field) => {
        const result = __splitDate(value, mask)

        expect(result.dateHash).toBeNull()
        expect(result.timeHash).toBeNull()
        expect(result[field]).toBeNull()
      })

      test.each(['Z', 'ZZ'])(
        'parses a literal Z timezone as UTC with the %s mask',
        token => {
          expect(
            __splitDate('2024-02-29 13:05 Z', `YYYY-MM-DD HH:mm ${token}`)
              .timezoneOffset
          ).toBe(0)
        }
      )
    })
  })
})
