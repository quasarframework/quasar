import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { toJalaali } from '../../utils/date/private.persian.js'
import useDatetime, {
  getDayHash,
  useDatetimeEmits,
  useDatetimeProps
} from './use-datetime.js'

let wrapper

const langDate = { days: ['Sunday'], firstDayOfWeek: 0 }

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.useRealTimers()
})

// the composable takes $q as an argument, so a minimal stand-in is enough
const $q = { lang: { date: langDate } }

function mountDatetime(props = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: useDatetimeProps,
      emits: useDatetimeEmits,
      setup(componentProps) {
        api = useDatetime(componentProps, $q)
        return () => h('div')
      }
    }),
    { props }
  )

  return api
}

describe('[useDatetime API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useDatetimeProps]', () => {
      test('is defined correctly', () => {
        expect(useDatetimeProps).$props()
      })

      test('only accepts the two supported calendars', () => {
        const { validator, default: defaultValue } = useDatetimeProps.calendar

        expect(validator('gregorian')).toBe(true)
        expect(validator('persian')).toBe(true)
        expect(validator('hebrew')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })

    describe('[(variable)useDatetimeEmits]', () => {
      test('is defined correctly', () => {
        expect(useDatetimeEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns the shared datetime helpers', () => {
        expect(mountDatetime()).toMatchObject({
          editable: expect.$ref(expect.any(Boolean)),
          tabindex: expect.$ref(expect.any(Number)),
          headerClass: expect.$ref(expect.any(String)),

          getLocale: expect.any(Function),
          getCurrentDate: expect.any(Function)
        })
      })

      test.each([
        [{}, true],
        [{ readonly: true }, false],
        [{ disable: true }, false],
        [{ readonly: true, disable: true }, false]
      ])('computes "editable" for %o as %s', (props, expected) => {
        const { editable } = mountDatetime(props)

        expect(editable.value).toBe(expected)
      })

      test('keeps a read-only or disabled component out of the tab order', () => {
        expect(mountDatetime().tabindex.value).toBe(0)
        expect(mountDatetime({ disable: true }).tabindex.value).toBe(-1)
        expect(mountDatetime({ readonly: true }).tabindex.value).toBe(-1)
      })

      test('builds the header class out of the color props', () => {
        expect(mountDatetime().headerClass.value).toBe('')
        expect(mountDatetime({ color: 'red' }).headerClass.value).toBe('bg-red')
        expect(mountDatetime({ textColor: 'white' }).headerClass.value).toBe(
          'text-white'
        )
        expect(
          mountDatetime({ color: 'red', textColor: 'white' }).headerClass.value
        ).toBe('bg-red text-white')
      })

      test('reacts to the props being changed', async () => {
        const { editable, headerClass } = mountDatetime()

        await wrapper.setProps({ disable: true, color: 'red' })

        expect(editable.value).toBe(false)
        expect(headerClass.value).toBe('bg-red')
      })

      test('falls back to the Quasar language pack for the locale', () => {
        const { getLocale } = mountDatetime()

        expect(getLocale()).toBe(langDate)
      })

      test('merges a custom locale over the language pack', () => {
        const { getLocale } = mountDatetime({
          locale: { firstDayOfWeek: 1 }
        })

        expect(getLocale()).toStrictEqual({ ...langDate, firstDayOfWeek: 1 })
        // the language pack itself must not be touched
        expect(langDate.firstDayOfWeek).toBe(0)
      })

      test('returns today as a gregorian date with empty time parts', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2024, 2, 5, 13, 45))

        const { getCurrentDate } = mountDatetime()

        expect(getCurrentDate()).toStrictEqual({
          year: 2024,
          month: 3,
          day: 5,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        })
      })

      test('nulls out the time parts when asked for the date only', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2024, 2, 5, 13, 45))

        const { getCurrentDate } = mountDatetime()

        expect(getCurrentDate(true)).toStrictEqual({
          year: 2024,
          month: 3,
          day: 5,
          hour: null,
          minute: null,
          second: null,
          millisecond: null
        })
      })

      test('returns today as a persian date when so configured', () => {
        vi.useFakeTimers()
        const now = new Date(2024, 2, 5, 13, 45)
        vi.setSystemTime(now)

        const { getCurrentDate } = mountDatetime({ calendar: 'persian' })
        const { jy, jm, jd } = toJalaali(now)

        expect(getCurrentDate()).toStrictEqual({
          year: jy,
          month: jm,
          day: jd
        })
      })
    })

    describe('[(function)getDayHash]', () => {
      test('joins the date parts into a sortable key', () => {
        expect(getDayHash({ year: 2024, month: 3, day: 5 })).toBe('2024/03/05')
      })

      test('does not pad values which are already two digits', () => {
        expect(getDayHash({ year: 2024, month: 12, day: 31 })).toBe(
          '2024/12/31'
        )
      })

      test('ignores the time parts of the date', () => {
        expect(
          getDayHash({ year: 2024, month: 3, day: 5, hour: 13, minute: 45 })
        ).toBe('2024/03/05')
      })

      test('produces keys which sort chronologically', () => {
        const hashes = [
          { year: 2024, month: 12, day: 1 },
          { year: 2024, month: 3, day: 5 },
          { year: 2023, month: 7, day: 9 }
        ].map(getDayHash)

        expect([...hashes].sort()).toStrictEqual([
          '2023/07/09',
          '2024/03/05',
          '2024/12/01'
        ])
      })
    })
  })
})
