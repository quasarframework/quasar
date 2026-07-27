// oxlint-disable import/no-named-as-default-member

import { afterEach, describe, expect, test } from 'vitest'

import { getWeekOfYear } from './date.js'

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
    })

    describe('[(function)isValid]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.isValid(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)extractDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.extractDate(str, mask, dateLocale)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)buildDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.buildDate(mod, utc)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getDayOfWeek]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getDayOfWeek(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)isBetweenDates]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.isBetweenDates(date, from, to, /* opts */ {})
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)addToDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.addToDate(date, mod)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)subtractFromDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.subtractFromDate(date, mod)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)adjustDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.adjustDate(date, rawMod, utc)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)startOfDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.startOfDate(date, unit, utc)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)endOfDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.endOfDate(date, unit, utc)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getMaxDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getMaxDate(date, ...args)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getMinDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getMinDate(date, ...args)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getDateDiff]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getDateDiff(date, subtract, /* unit */ days)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getDayOfYear]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getDayOfYear(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)inferDateFormat]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.inferDateFormat(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)getDateBetween]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.getDateBetween(date, min, max)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)isSameDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.isSameDate(date, date2, unit)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)daysInMonth]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.daysInMonth(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)formatDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.formatDate(val, mask, dateLocale, __forcedYear, __forcedTimezoneOffset)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)clone]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = date.clone(date)
        // expect(result).toBeDefined()
      })
    })

    describe('[(function)__splitDate]', () => {
      test('has correct return value', () => {
        // TODO
        // const result = __splitDate(str, mask, dateLocale, calendar, defaultModel)
        // expect(result).toBeDefined()
      })
    })
  })
})
