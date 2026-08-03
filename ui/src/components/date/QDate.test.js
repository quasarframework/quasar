import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QDate from './QDate.js'

// a Wednesday-starting month with 28 days, so that the calendar
// always renders the same 3 leading fill days
const model = '1995/02/23'

function mountDate(props, slots) {
  props ||= {}

  return mount(QDate, {
    props: {
      modelValue: model,
      ...props
    },
    slots
  })
}

function getHeader(wrapper) {
  return wrapper.get('.q-date__header')
}

function getTitle(wrapper) {
  return wrapper.get('.q-date__header-title-label')
}

function getSubtitle(wrapper) {
  return wrapper.get('.q-date__header-subtitle')
}

/**
 * The navigation renders, in order: the month arrows around the month
 * label, then the year arrows around the year label.
 */
const navIndex = {
  prevMonth: 0,
  month: 1,
  nextMonth: 2,
  prevYear: 3,
  year: 4,
  nextYear: 5
}

function getNavButtons(wrapper) {
  return wrapper.findAll('.q-date__navigation .q-btn')
}

function getNavButton(wrapper, name) {
  return getNavButtons(wrapper)[navIndex[name]]
}

function getWeekdays(wrapper) {
  return wrapper
    .findAll('.q-date__calendar-weekdays .q-date__calendar-item')
    .map(day => day.text())
}

function getDayCells(wrapper) {
  return wrapper
    .findAll('.q-date__calendar-days .q-date__calendar-item')
    .filter(cell => !cell.classes().includes('q-date__calendar-item--fill'))
}

function getDayCell(wrapper, day) {
  return getDayCells(wrapper).find(cell => cell.text() === String(day))
}

function getDayBtn(wrapper, day) {
  return wrapper
    .findAll('.q-date__calendar-days .q-btn')
    .find(btn => btn.text() === String(day))
}

function clickDay(wrapper, day) {
  return getDayBtn(wrapper, day).trigger('click')
}

function getSelectedDays(wrapper) {
  return wrapper
    .findAll('.q-date__calendar-days .q-btn.bg-primary')
    .map(btn => btn.text())
}

function getTodayString() {
  const now = new Date()
  const pad = value => String(value).padStart(2, '0')

  return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`
}

describe('[QDate API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountDate()

        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.setProps({ name: propVal })

        const input = wrapper.get('input[type="hidden"]')
        expect(input.attributes('name')).toBe(propVal)
        expect(input.attributes('value')).toBe(model)
      })
    })

    describe('[(prop)landscape]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining([
            'q-date--portrait',
            'q-date--portrait-standard'
          ])
        )

        await wrapper.setProps({ landscape: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining([
            'q-date--landscape',
            'q-date--landscape-standard'
          ])
        )
        expect(wrapper.classes()).not.toContain('q-date--portrait')
      })
    })

    describe('[(prop)mask]', () => {
      test('type String has effect', async () => {
        const propVal = 'DD-MM-YYYY'

        // the model is parsed with the mask...
        const wrapper = mountDate({ modelValue: '23-02-1995', mask: propVal })

        expect(getTitle(wrapper).text()).toBe('Thu, Feb 23')
        expect(getSubtitle(wrapper).text()).toBe('1995')

        // ...and so is the emitted value
        await clickDay(wrapper, 24)

        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('24-02-1995')
      })

      test('a value in another format is not understood', () => {
        const wrapper = mountDate({ modelValue: model, mask: 'DD-MM-YYYY' })

        expect(getTitle(wrapper).text()).toBe('—')
      })
    })

    describe('[(prop)locale]', () => {
      test('type Object has effect', async () => {
        const propVal = {
          monthsShort: [
            'Ian',
            'Fbr',
            'Mrt',
            'Apr',
            'Mai',
            'Iun',
            'Iul',
            'Aug',
            'Sep',
            'Oct',
            'Noi',
            'Dec'
          ]
        }
        const wrapper = mountDate()

        expect(getTitle(wrapper).text()).toBe('Thu, Feb 23')

        await wrapper.setProps({ locale: propVal })

        // the localized month name is used for the header
        expect(getTitle(wrapper).text()).toBe('Thu, Fbr 23')
      })

      test('the month navigation follows it', () => {
        const propVal = {
          months: [
            'Ianuarie',
            'Februarie',
            'Martie',
            'Aprilie',
            'Mai',
            'Iunie',
            'Iulie',
            'August',
            'Septembrie',
            'Octombrie',
            'Noiembrie',
            'Decembrie'
          ]
        }

        expect(getNavButton(mountDate(), 'month').text()).toBe('February')

        const wrapper = mountDate({ locale: propVal })

        expect(getNavButton(wrapper, 'month').text()).toBe('Februarie')
      })
    })

    describe('[(prop)calendar]', () => {
      test('value "gregorian" has effect', () => {
        const propVal = 'gregorian'
        const wrapper = mountDate({
          modelValue: '23-02-1995',
          mask: 'DD-MM-YYYY',
          calendar: propVal
        })

        // the mask is honored
        expect(getSubtitle(wrapper).text()).toBe('1995')
        expect(getNavButton(wrapper, 'year').text()).toBe('1995')
      })

      test('value "persian" has effect', () => {
        const propVal = 'persian'
        const wrapper = mountDate({
          modelValue: '1374/12/04',
          mask: 'DD-MM-YYYY',
          calendar: propVal
        })

        // the persian calendar always forces the YYYY/MM/DD mask
        expect(getSubtitle(wrapper).text()).toBe('1374')
        expect(getNavButton(wrapper, 'year').text()).toBe('1374')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QDate.props.calendar

        expect(validator(defaultValue)).toBe(true)
        expect(validator('persian')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mountDate()

        // the header is only colored when asked to be
        expect(getHeader(wrapper).classes()).not.toContain(`bg-${propVal}`)
        // ...while the selection defaults to "primary"
        expect(getDayBtn(wrapper, 23).classes()).toContain('bg-primary')

        await wrapper.setProps({ color: propVal })

        expect(getHeader(wrapper).classes()).toContain(`bg-${propVal}`)
        expect(getDayBtn(wrapper, 23).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mountDate()

        expect(getHeader(wrapper).classes()).not.toContain(`text-${propVal}`)
        // it defaults to white
        expect(getDayBtn(wrapper, 23).classes()).toContain('text-white')

        await wrapper.setProps({ textColor: propVal })

        expect(getHeader(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getDayBtn(wrapper, 23).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.classes()).not.toContain('q-date--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-date--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountDate({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-date--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-date--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.classes()).not.toContain('q-date--square')

        await wrapper.setProps({ square: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-date--square', 'no-border-radius'])
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.classes()).not.toContain('q-date--flat')

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-date--flat', 'no-shadow'])
        )
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.classes()).not.toContain('q-date--bordered')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.classes()).toContain('q-date--bordered')
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ name: 'car_id' })

        expect(getSubtitle(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ readonly: true })

        expect(wrapper.classes()).toContain('q-date--readonly')
        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBeUndefined()
        // the value still gets submitted
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(true)
        expect(getSubtitle(wrapper).attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ name: 'car_id' })

        await wrapper.setProps({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-date--readonly')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        // nothing gets submitted while disabled
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
        expect(getSubtitle(wrapper).attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type String has effect', async () => {
        const wrapper = mountDate({ modelValue: model })

        expect(getSelectedDays(wrapper)).toStrictEqual(['23'])
        expect(getTitle(wrapper).text()).toBe('Thu, Feb 23')
        expect(getSubtitle(wrapper).text()).toBe('1995')

        await wrapper.setProps({ modelValue: '1995/02/25' })

        expect(getSelectedDays(wrapper)).toStrictEqual(['25'])
      })

      test('type Array has effect', () => {
        const propVal = ['1995/02/23', '1995/02/25']
        const wrapper = mountDate({ modelValue: propVal })

        // every entry of the array gets selected
        expect(getSelectedDays(wrapper)).toStrictEqual(['23', '25'])
        expect(getTitle(wrapper).text()).toBe('2 days')
        expect(getSubtitle(wrapper).text()).toBe('Feb 1995')
      })

      test('type Object has effect', () => {
        const propVal = { from: '1995/02/23', to: '1995/02/26' }
        const wrapper = mountDate({ modelValue: propVal })

        // an object is a range, so the days in between get marked too
        expect(getDayCell(wrapper, 23).classes()).toContain(
          'q-date__range-from'
        )
        expect(getDayCell(wrapper, 24).classes()).toContain('q-date__range')
        expect(getDayCell(wrapper, 25).classes()).toContain('q-date__range')
        expect(getDayCell(wrapper, 26).classes()).toContain('q-date__range-to')

        expect(getTitle(wrapper).text()).toBe('4 days')
      })

      test('type null has effect', () => {
        const wrapper = mountDate({ modelValue: null })

        expect(getSelectedDays(wrapper)).toStrictEqual([])
        expect(getTitle(wrapper).text()).toBe('—')
        expect(getSubtitle(wrapper).text()).toBe('—')
      })

      test('type undefined has effect', () => {
        // it is treated the same as a null model
        const wrapper = mountDate({ modelValue: void 0 })

        expect(getSelectedDays(wrapper)).toStrictEqual([])
        expect(getTitle(wrapper).text()).toBe('—')
        expect(getSubtitle(wrapper).text()).toBe('—')
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', async () => {
        const propVal = 'Birthday'
        const wrapper = mountDate()

        expect(getTitle(wrapper).text()).toBe('Thu, Feb 23')

        await wrapper.setProps({ title: propVal })

        // it overrides the computed title
        expect(getTitle(wrapper).text()).toBe(propVal)
        expect(getSubtitle(wrapper).text()).toBe('1995')
      })
    })

    describe('[(prop)subtitle]', () => {
      test('type String has effect', async () => {
        const propVal = 'Birthday'
        const wrapper = mountDate()

        expect(getSubtitle(wrapper).text()).toBe('1995')

        await wrapper.setProps({ subtitle: propVal })

        expect(getSubtitle(wrapper).text()).toBe(propVal)
        expect(getTitle(wrapper).text()).toBe('Thu, Feb 23')
      })
    })

    describe('[(prop)default-year-month]', () => {
      test('type String has effect', () => {
        const propVal = '1997/05'
        const wrapper = mountDate({
          modelValue: null,
          defaultYearMonth: propVal
        })

        // with no model, the calendar starts off here
        expect(getNavButton(wrapper, 'month').text()).toBe('May')
        expect(getNavButton(wrapper, 'year').text()).toBe('1997')

        // ...but an actual model always wins
        const modelWrapper = mountDate({ defaultYearMonth: propVal })

        expect(getNavButton(modelWrapper, 'month').text()).toBe('February')
        expect(getNavButton(modelWrapper, 'year').text()).toBe('1995')
      })

      test('only accepts a year/month string', () => {
        const { validator } = QDate.props.defaultYearMonth

        expect(validator('1997/05')).toBe(true)
        expect(validator('1997/5')).toBe(false)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)default-view]', () => {
      function testDefaultView(propVal, selector) {
        const wrapper = mountDate({ defaultView: propVal })

        expect(wrapper.find(selector).exists()).toBe(true)
      }

      test('value "Calendar" has effect', () => {
        testDefaultView('Calendar', '.q-date__calendar')
      })

      test('value "Months" has effect', () => {
        testDefaultView('Months', '.q-date__months')
      })

      test('value "Years" has effect', () => {
        testDefaultView('Years', '.q-date__years')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QDate.props.defaultView

        expect(validator(defaultValue)).toBe(true)
        expect(validator('Years')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)years-in-month-view]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ defaultView: 'Months' })

        expect(wrapper.find('.q-date__months .q-date__arrow').exists()).toBe(
          false
        )

        await wrapper.setProps({ yearsInMonthView: true })

        // a year navigation row gets prepended to the months
        expect(wrapper.findAll('.q-date__months .q-date__arrow')).toHaveLength(
          2
        )
        expect(
          wrapper.get('.q-date__months .q-btn:nth-child(1)').exists()
        ).toBe(true)
      })
    })

    describe('[(prop)events]', () => {
      test('type Array has effect', async () => {
        const propVal = ['1995/02/10', '1995/02/12']
        const wrapper = mountDate()

        expect(wrapper.find('.q-date__event').exists()).toBe(false)

        await wrapper.setProps({ events: propVal })

        // the color is optional, so the marker shows up on its own
        expect(wrapper.findAll('.q-date__event')).toHaveLength(propVal.length)
        expect(getDayBtn(wrapper, 10).find('.q-date__event').exists()).toBe(
          true
        )
        expect(getDayBtn(wrapper, 11).find('.q-date__event').exists()).toBe(
          false
        )
      })

      test('type Function has effect', () => {
        const propVal = date => date === '1995/02/10'
        const wrapper = mountDate({ events: propVal })

        expect(wrapper.findAll('.q-date__event')).toHaveLength(1)
        expect(getDayBtn(wrapper, 10).find('.q-date__event').exists()).toBe(
          true
        )
      })
    })

    describe('[(prop)event-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'orange'
        const wrapper = mountDate({ events: ['1995/02/10'] })

        // without it, the marker is left to the stylesheet
        expect(wrapper.get('.q-date__event').classes()).toStrictEqual([
          'q-date__event'
        ])

        await wrapper.setProps({ eventColor: propVal })

        expect(wrapper.get('.q-date__event').classes()).toContain(
          `bg-${propVal}`
        )
      })

      test('type Function has effect', () => {
        const propVal = date => (date === '1995/02/10' ? 'orange' : 'teal')
        const wrapper = mountDate({
          events: ['1995/02/10', '1995/02/12'],
          eventColor: propVal
        })

        const events = wrapper.findAll('.q-date__event')
        expect(events[0].classes()).toContain('bg-orange')
        expect(events[1].classes()).toContain('bg-teal')
      })
    })

    describe('[(prop)options]', () => {
      test('type Array has effect', async () => {
        const propVal = ['1995/02/23', '1995/02/24']
        const wrapper = mountDate()

        // every day of the month is selectable by default
        expect(wrapper.findAll('.q-date__calendar-days .q-btn')).toHaveLength(
          28
        )

        await wrapper.setProps({ options: propVal })

        // the ones left out are rendered as plain, unselectable days
        expect(
          wrapper
            .findAll('.q-date__calendar-days .q-btn')
            .map(btn => btn.text())
        ).toStrictEqual(['23', '24'])
        expect(getDayCell(wrapper, 10).classes()).toContain(
          'q-date__calendar-item--out'
        )
      })

      test('type Function has effect', () => {
        const propVal = date => date >= '1995/02/27'
        const wrapper = mountDate({ options: propVal })

        expect(
          wrapper
            .findAll('.q-date__calendar-days .q-btn')
            .map(btn => btn.text())
        ).toStrictEqual(['27', '28'])
      })
    })

    describe('[(prop)navigation-min-year-month]', () => {
      test('type String has effect', async () => {
        const propVal = '1995/02'
        const wrapper = mountDate()

        expect(getNavButton(wrapper, 'prevMonth').classes()).not.toContain(
          'disabled'
        )

        await wrapper.setProps({ navigationMinYearMonth: propVal })

        // the view is already at the boundary, so it cannot go back
        expect(getNavButton(wrapper, 'prevMonth').classes()).toContain(
          'disabled'
        )
        expect(getNavButton(wrapper, 'prevYear').classes()).toContain(
          'disabled'
        )
        expect(getNavButton(wrapper, 'nextMonth').classes()).not.toContain(
          'disabled'
        )
      })

      test('only accepts a year/month string', () => {
        const { validator } = QDate.props.navigationMinYearMonth

        expect(validator('1995/02')).toBe(true)
        expect(validator('1995/2')).toBe(false)
      })
    })

    describe('[(prop)navigation-max-year-month]', () => {
      test('type String has effect', async () => {
        const propVal = '1995/02'
        const wrapper = mountDate()

        expect(getNavButton(wrapper, 'nextMonth').classes()).not.toContain(
          'disabled'
        )

        await wrapper.setProps({ navigationMaxYearMonth: propVal })

        expect(getNavButton(wrapper, 'nextMonth').classes()).toContain(
          'disabled'
        )
        expect(getNavButton(wrapper, 'nextYear').classes()).toContain(
          'disabled'
        )
        expect(getNavButton(wrapper, 'prevMonth').classes()).not.toContain(
          'disabled'
        )
      })

      test('only accepts a year/month string', () => {
        const { validator } = QDate.props.navigationMaxYearMonth

        expect(validator('1995/02')).toBe(true)
        expect(validator('1995/2')).toBe(false)
      })
    })

    describe('[(prop)no-unset]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ noUnset: true })

        // clicking the selected day would normally clear the model
        await clickDay(wrapper, 23)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        const unsetWrapper = mountDate()
        await clickDay(unsetWrapper, 23)

        expect(unsetWrapper.emitted('update:modelValue')[0][0]).toBeNull()
      })
    })

    describe('[(prop)first-day-of-week]', () => {
      test('type String has effect', async () => {
        const propVal = '1'
        const wrapper = mountDate()

        expect(getWeekdays(wrapper)[0]).toBe('Sun')

        await wrapper.setProps({ firstDayOfWeek: propVal })

        expect(getWeekdays(wrapper)).toStrictEqual([
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun'
        ])
      })

      test('type Number has effect', () => {
        const propVal = 3
        const wrapper = mountDate({ firstDayOfWeek: propVal })

        expect(getWeekdays(wrapper)[0]).toBe('Wed')
      })
    })

    describe('[(prop)today-btn]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.find('.q-date__header-today').exists()).toBe(false)

        await wrapper.setProps({ todayBtn: true })

        expect(wrapper.find('.q-date__header-today').exists()).toBe(true)

        await wrapper.get('.q-date__header-today').trigger('click')

        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(
          getTodayString()
        )
      })
    })

    describe('[(prop)minimal]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate()

        expect(wrapper.find('.q-date__header').exists()).toBe(true)

        await wrapper.setProps({ minimal: true })

        expect(wrapper.find('.q-date__header').exists()).toBe(false)
        expect(wrapper.classes()).toContain('q-date--portrait-minimal')
      })
    })

    describe('[(prop)multiple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ multiple: true, modelValue: [model] })

        await clickDay(wrapper, 25)

        // the new day is added to the model instead of replacing it
        expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual([
          model,
          '1995/02/25'
        ])

        const singleWrapper = mountDate()
        await clickDay(singleWrapper, 25)

        expect(singleWrapper.emitted('update:modelValue')[0][0]).toBe(
          '1995/02/25'
        )
      })
    })

    describe('[(prop)range]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({
          range: true,
          modelValue: null,
          // with no model, the calendar would open on the current month
          defaultYearMonth: '1995/02'
        })

        // the first click only starts the range
        await clickDay(wrapper, 10)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('rangeStart')).toHaveLength(1)

        await clickDay(wrapper, 12)

        expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual({
          from: '1995/02/10',
          to: '1995/02/12'
        })
        expect(wrapper.emitted('rangeEnd')).toHaveLength(1)
      })
    })

    describe('[(prop)emit-immediately]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountDate({ emitImmediately: true })

        await getNavButton(wrapper, 'nextMonth').trigger('click')
        await flushPromises()

        // the model follows the calendar navigation
        const [value, reason] = wrapper.emitted('update:modelValue')[0]
        expect(value).toBe('1995/03/23')
        expect(reason).toBe('month')

        const plainWrapper = mountDate()

        await getNavButton(plainWrapper, 'nextMonth').trigger('click')
        await flushPromises()

        expect(plainWrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountDate({}, { default: () => slotContent })

        expect(wrapper.get('.q-date__actions').text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountDate()

        await clickDay(wrapper, 25)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value, reason, details] = eventList['update:modelValue'][0]
        expect(value).$any([
          expect.any(String),
          expect.any(Array),
          expect.any(Object),
          null
        ])
        expect(value).toBe('1995/02/25')
        expect(reason).toBe('add-day')
        expect(details).toStrictEqual({ year: 1995, month: 2, day: 25 })
      })

      test('reports a range through the details', async () => {
        const wrapper = mountDate({
          range: true,
          modelValue: null,
          // with no model, the calendar would open on the current month
          defaultYearMonth: '1995/02'
        })

        await clickDay(wrapper, 10)
        await clickDay(wrapper, 12)

        const [value, reason, details] = wrapper.emitted('update:modelValue')[0]

        expect(value).toStrictEqual({ from: '1995/02/10', to: '1995/02/12' })
        expect(reason).toBe('add-range')
        expect(details).toStrictEqual({
          year: 1995,
          month: 2,
          day: 12,
          from: { year: 1995, month: 2, day: 10 },
          to: { year: 1995, month: 2, day: 12 }
        })
      })
    })

    describe('[(event)navigation]', () => {
      test('is emitting', async () => {
        const wrapper = mountDate()

        await getNavButton(wrapper, 'nextMonth').trigger('click')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('navigation')
        expect(eventList.navigation).toHaveLength(1)

        const [view] = eventList.navigation[0]
        expect(view).toStrictEqual({ year: 1995, month: 3 })
      })
    })

    describe('[(event)range-start]', () => {
      test('is emitting', async () => {
        const wrapper = mountDate({
          range: true,
          modelValue: null,
          // with no model, the calendar would open on the current month
          defaultYearMonth: '1995/02'
        })

        await clickDay(wrapper, 10)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rangeStart')
        expect(eventList.rangeStart).toHaveLength(1)

        const [from] = eventList.rangeStart[0]
        expect(from).toStrictEqual({ year: 1995, month: 2, day: 10 })
      })
    })

    describe('[(event)range-end]', () => {
      test('is emitting', async () => {
        const wrapper = mountDate({
          range: true,
          modelValue: null,
          // with no model, the calendar would open on the current month
          defaultYearMonth: '1995/02'
        })

        await clickDay(wrapper, 12)
        await clickDay(wrapper, 10)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rangeEnd')
        expect(eventList.rangeEnd).toHaveLength(1)

        const [range] = eventList.rangeEnd[0]
        // the range is always reported in chronological order
        expect(range).toStrictEqual({
          from: { year: 1995, month: 2, day: 10 },
          to: { year: 1995, month: 2, day: 12 }
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)setToday]', () => {
      test('should be callable', async () => {
        const wrapper = mountDate({ modelValue: null })

        expect(wrapper.vm.setToday()).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(
          getTodayString()
        )
        // the calendar navigates to it as well
        expect(getNavButton(wrapper, 'year').text()).toBe(
          String(new Date().getFullYear())
        )
      })
    })

    describe('[(method)setView]', () => {
      test('should be callable', async () => {
        const wrapper = mountDate()

        expect(wrapper.find('.q-date__calendar').exists()).toBe(true)

        expect(wrapper.vm.setView('Months')).toBeUndefined()
        await nextTick()

        expect(wrapper.find('.q-date__months').exists()).toBe(true)

        wrapper.vm.setView('Years')
        await nextTick()

        expect(wrapper.find('.q-date__years').exists()).toBe(true)

        // an unknown view is ignored
        wrapper.vm.setView('Nowhere')
        await nextTick()

        expect(wrapper.find('.q-date__years').exists()).toBe(true)
      })
    })

    describe('[(method)offsetCalendar]', () => {
      test('should be callable', async () => {
        const wrapper = mountDate()

        expect(wrapper.vm.offsetCalendar('month', true)).toBeUndefined()
        await flushPromises()

        expect(getNavButton(wrapper, 'month').text()).toBe('January')

        wrapper.vm.offsetCalendar('year')
        await flushPromises()

        expect(getNavButton(wrapper, 'year').text()).toBe('1996')

        // an unknown type is ignored
        wrapper.vm.offsetCalendar('decade')
        await flushPromises()

        expect(getNavButton(wrapper, 'year').text()).toBe('1996')
      })
    })

    describe('[(method)setCalendarTo]', () => {
      test('should be callable', async () => {
        const wrapper = mountDate({ defaultView: 'Years' })

        expect(wrapper.vm.setCalendarTo(1996, 5)).toBeUndefined()
        await flushPromises()

        // it also brings the calendar view back
        expect(wrapper.find('.q-date__calendar').exists()).toBe(true)
        expect(getNavButton(wrapper, 'month').text()).toBe('May')
        expect(getNavButton(wrapper, 'year').text()).toBe('1996')
      })
    })

    describe('[(method)setEditingRange]', () => {
      test('should be callable', async () => {
        const wrapper = mountDate({
          range: true,
          modelValue: null,
          // with no model, the calendar would open on the current month
          defaultYearMonth: '1995/02'
        })

        expect(
          wrapper.vm.setEditingRange(
            { year: 1995, month: 2, day: 10 },
            { year: 1995, month: 2, day: 12 }
          )
        ).toBeUndefined()
        await flushPromises()

        expect(getDayCell(wrapper, 10).classes()).toContain(
          'q-date__edit-range-from'
        )
        expect(getDayCell(wrapper, 11).classes()).toContain(
          'q-date__edit-range'
        )
        expect(getDayCell(wrapper, 12).classes()).toContain(
          'q-date__edit-range-to'
        )

        // the header shows the pending selection
        expect(getTitle(wrapper).text()).toContain('Fri, Feb 10')
      })

      test('is ignored when not in range mode', async () => {
        const wrapper = mountDate({ modelValue: null })

        wrapper.vm.setEditingRange({ year: 1995, month: 2, day: 10 })
        await flushPromises()

        expect(wrapper.find('.q-date__edit-range').exists()).toBe(false)
      })
    })
  })
})
