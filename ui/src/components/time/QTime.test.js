import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import langEn from '../../../lang/en-US.js'
import QTime from './QTime.js'

function mountTime(props = {}) {
  return mount(QTime, {
    props: {
      modelValue: '10:30',
      ...props
    }
  })
}

function getHeaderLinks(wrapper) {
  return wrapper.findAll('.q-time__header-label .q-time__link')
}

function getHourLink(wrapper) {
  return getHeaderLinks(wrapper)[0]
}

function getMinuteLink(wrapper) {
  return getHeaderLinks(wrapper)[1]
}

function getSecondLink(wrapper) {
  return getHeaderLinks(wrapper)[2]
}

function getAmPmLinks(wrapper) {
  return wrapper.findAll('.q-time__header-ampm .q-time__link')
}

function getPositions(wrapper) {
  return wrapper.findAll('.q-time__clock-position')
}

function getDisabledPositions(wrapper) {
  return wrapper.findAll('.q-time__clock-position--disable')
}

/**
 * The arrow keys are the simplest pointer-free way of setting
 * the hour and the minute, as the clock needs DOM measurements.
 */
async function pressArrowRight(link) {
  await link.trigger('keydown', { keyCode: 39 })
}

describe('[QTime API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountTime()

        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.setProps({ name: propVal })

        const input = wrapper.get('input[type="hidden"]')
        expect(input.attributes('name')).toBe(propVal)
        expect(input.attributes('value')).toBe('10:30')
      })
    })

    describe('[(prop)landscape]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime()

        expect(wrapper.classes()).toContain('q-time--portrait')

        await wrapper.setProps({ landscape: true })

        expect(wrapper.classes()).toContain('q-time--landscape')
        expect(wrapper.classes()).not.toContain('q-time--portrait')
      })
    })

    describe('[(prop)mask]', () => {
      test('type String has effect', () => {
        const propVal = 'HH-mm'

        // the model is parsed with the mask...
        const wrapper = mountTime({ modelValue: '10-30', mask: propVal })

        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getMinuteLink(wrapper).text()).toBe('30')

        // ...so a value in another format is not understood
        const otherWrapper = mountTime({ modelValue: '10:30', mask: propVal })

        expect(getHourLink(otherWrapper).text()).toBe('--')
      })

      test('is used when emitting as well', async () => {
        const wrapper = mountTime({
          modelValue: null,
          mask: 'YYYY/MM/DD HH-mm',
          defaultDate: '1995/02/23'
        })

        await pressArrowRight(getHourLink(wrapper))
        await pressArrowRight(getMinuteLink(wrapper))

        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(
          '1995/02/23 00-00'
        )
      })

      test('type null has effect', () => {
        // it falls back to a plain time mask
        const wrapper = mountTime({ modelValue: '10:30', mask: null })

        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getMinuteLink(wrapper).text()).toBe('30')

        const secondsWrapper = mountTime({
          modelValue: '10:30:45',
          mask: null,
          withSeconds: true
        })

        expect(getSecondLink(secondsWrapper).text()).toBe('45')
      })
    })

    describe('[(prop)locale]', () => {
      test('type Object has effect', () => {
        const propVal = {
          monthsShort: [
            'Ian',
            'Feb',
            'Mar',
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

        // the localized month name is what the mask matches against
        const wrapper = mountTime({
          modelValue: 'Ian 10:30',
          mask: 'MMM HH:mm',
          locale: propVal
        })

        expect(getHourLink(wrapper).text()).toBe('10')

        const defaultWrapper = mountTime({
          modelValue: 'Ian 10:30',
          mask: 'MMM HH:mm'
        })

        expect(getHourLink(defaultWrapper).text()).toBe('--')
      })
    })

    describe('[(prop)calendar]', () => {
      test('value "gregorian" has effect', () => {
        const propVal = 'gregorian'
        const wrapper = mountTime({
          modelValue: '10-30',
          mask: 'HH-mm',
          calendar: propVal
        })

        // the mask is honored
        expect(getHourLink(wrapper).text()).toBe('10')
      })

      test('value "persian" has effect', async () => {
        const propVal = 'persian'
        const wrapper = mountTime({
          modelValue: '10:30',
          mask: 'HH-mm',
          calendar: propVal
        })

        // the persian calendar always works with a plain time mask
        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getMinuteLink(wrapper).text()).toBe('30')

        await pressArrowRight(getMinuteLink(wrapper))

        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('10:31')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QTime.props.calendar

        expect(validator(defaultValue)).toBe(true)
        expect(validator('persian')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTime()

        expect(wrapper.get('.q-time__header').classes()).not.toContain(
          `bg-${propVal}`
        )

        await wrapper.setProps({ color: propVal })

        expect(wrapper.get('.q-time__header').classes()).toContain(
          `bg-${propVal}`
        )
        expect(wrapper.get('.q-time__clock-pointer').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountTime()

        expect(wrapper.get('.q-time__header').classes()).not.toContain(
          `text-${propVal}`
        )

        await wrapper.setProps({ textColor: propVal })

        expect(wrapper.get('.q-time__header').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime()

        expect(wrapper.classes()).not.toContain('q-time--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-time--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountTime({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-time--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-time--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime()

        expect(wrapper.classes()).not.toContain('q-time--square')

        await wrapper.setProps({ square: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-time--square', 'no-border-radius'])
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime()

        expect(wrapper.classes()).not.toContain('q-time--flat')

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-time--flat', 'no-shadow'])
        )
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime()

        expect(wrapper.classes()).not.toContain('q-time--bordered')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.classes()).toContain('q-time--bordered')
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime({ name: 'car_id' })

        expect(getHourLink(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ readonly: true })

        expect(wrapper.classes()).toContain('q-time--readonly')
        expect(wrapper.classes()).not.toContain('disabled')
        // the value still gets submitted
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(true)
        expect(getHourLink(wrapper).attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime({ name: 'car_id' })

        await wrapper.setProps({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-time--readonly')
        // nothing gets submitted while disabled
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
        expect(getHourLink(wrapper).attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTime({ modelValue: '10:30' })

        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getMinuteLink(wrapper).text()).toBe('30')
        expect(getAmPmLinks(wrapper)[0].classes()).toContain(
          'q-time__link--active'
        )

        await wrapper.setProps({ modelValue: '22:45' })

        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getMinuteLink(wrapper).text()).toBe('45')
        // it switched over to PM
        expect(getAmPmLinks(wrapper)[1].classes()).toContain(
          'q-time__link--active'
        )
      })

      test('type null has effect', () => {
        const wrapper = mountTime({ modelValue: null })

        expect(getHourLink(wrapper).text()).toBe('--')
        expect(getMinuteLink(wrapper).text()).toBe('--')
        // there is nothing for the clock to point at
        expect(wrapper.get('.q-time__clock-pointer').classes()).toContain(
          'hidden'
        )
      })

      test('type undefined has effect', () => {
        // it is treated the same as a null model
        const wrapper = mountTime({ modelValue: void 0 })

        expect(getHourLink(wrapper).text()).toBe('--')
        expect(getMinuteLink(wrapper).text()).toBe('--')
        expect(wrapper.get('.q-time__clock-pointer').classes()).toContain(
          'hidden'
        )
      })
    })

    describe('[(prop)format24h]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime({ modelValue: '22:30', format24h: true })

        expect(getHourLink(wrapper).text()).toBe('22')
        // there is no meridiem to pick anymore
        expect(getAmPmLinks(wrapper)).toHaveLength(0)
        expect(getPositions(wrapper)).toHaveLength(24)

        await wrapper.setProps({ format24h: false })

        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getAmPmLinks(wrapper)).toHaveLength(2)
        expect(getPositions(wrapper)).toHaveLength(12)
      })

      test('type null has effect', () => {
        // it follows the current language pack
        const wrapper = mountTime({ modelValue: '22:30', format24h: null })

        expect(wrapper.vm.$q.lang.date.format24h).toBe(false)
        expect(getHourLink(wrapper).text()).toBe('10')
        expect(getAmPmLinks(wrapper)).toHaveLength(2)
      })
    })

    describe('[(prop)default-date]', () => {
      test('type String has effect', async () => {
        const propVal = '1995/02/23'
        const wrapper = mountTime({
          modelValue: null,
          mask: 'YYYY/MM/DD HH:mm',
          defaultDate: propVal
        })

        await pressArrowRight(getHourLink(wrapper))
        await pressArrowRight(getMinuteLink(wrapper))

        const [value, details] = wrapper.emitted('update:modelValue')[0]

        // the date part of the emitted value comes from the default date
        expect(value).toBe('1995/02/23 00:00')
        expect(details).toMatchObject({ year: 1995, month: 2, day: 23 })
      })

      test('only accepts a date-like string', () => {
        const { validator } = QTime.props.defaultDate

        expect(validator('1995/02/23')).toBe(true)
        expect(validator('1995-02-23')).toBe(false)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)options]', () => {
      test('type Function has effect', async () => {
        const propVal = hr => hr <= 6
        const wrapper = mountTime({ modelValue: '02:30' })

        expect(getDisabledPositions(wrapper)).toHaveLength(0)

        await wrapper.setProps({ options: propVal })

        // 0...6 are selectable, 7...11 are not
        expect(getDisabledPositions(wrapper)).toHaveLength(5)
      })
    })

    describe('[(prop)hour-options]', () => {
      test('type Array has effect', async () => {
        const propVal = [3, 6, 9]
        const wrapper = mountTime({ modelValue: '03:30' })

        await wrapper.setProps({ hourOptions: propVal })

        const enabled = getPositions(wrapper).filter(
          pos => !pos.classes().includes('q-time__clock-position--disable')
        )

        expect(enabled.map(pos => pos.text())).toStrictEqual(
          propVal.map(String)
        )
      })
    })

    describe('[(prop)minute-options]', () => {
      test('type Array has effect', async () => {
        const propVal = [0, 15, 30, 45]
        const wrapper = mountTime({
          modelValue: '10:30',
          minuteOptions: propVal
        })

        // the minute view is the one being restricted
        await getMinuteLink(wrapper).trigger('click')

        const enabled = getPositions(wrapper).filter(
          pos => !pos.classes().includes('q-time__clock-position--disable')
        )

        expect(enabled.map(pos => pos.text())).toStrictEqual(
          propVal.map(String)
        )
      })
    })

    describe('[(prop)second-options]', () => {
      test('type Array has effect', async () => {
        const propVal = [0, 7, 10, 23]
        const wrapper = mountTime({
          modelValue: '10:30:00',
          withSeconds: true,
          secondOptions: propVal
        })

        await getSecondLink(wrapper).trigger('click')

        const enabled = getPositions(wrapper).filter(
          pos => !pos.classes().includes('q-time__clock-position--disable')
        )

        // the clock only shows every fifth second
        expect(enabled.map(pos => pos.text())).toStrictEqual(['0', '10'])
      })
    })

    describe('[(prop)with-seconds]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountTime({ modelValue: '10:30' })

        expect(getHeaderLinks(wrapper)).toHaveLength(2)

        const secondsWrapper = mountTime({
          modelValue: '10:30:45',
          withSeconds: true
        })

        expect(getHeaderLinks(secondsWrapper)).toHaveLength(3)
        expect(getSecondLink(secondsWrapper).text()).toBe('45')
      })
    })

    describe('[(prop)now-btn]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTime({ modelValue: null })

        expect(wrapper.find('.q-time__now-button').exists()).toBe(false)

        await wrapper.setProps({ nowBtn: true })

        expect(wrapper.find('.q-time__now-button').exists()).toBe(true)

        await wrapper.get('.q-time__now-button').trigger('click')

        expect(wrapper.emitted('update:modelValue')[0][0]).toMatch(
          /^\d{2}:\d{2}$/
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QTime, {
          props: { modelValue: '10:30' },
          slots: { default: () => slotContent }
        })

        expect(wrapper.get('.q-time__actions').text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountTime({
          modelValue: null,
          mask: 'YYYY/MM/DD HH:mm',
          defaultDate: '1995/02/23'
        })

        // a partial time does not emit anything yet
        await pressArrowRight(getHourLink(wrapper))
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await pressArrowRight(getMinuteLink(wrapper))

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value, details] = eventList['update:modelValue'][0]
        expect(value).toBe('1995/02/23 00:00')
        expect(details).toMatchObject({
          year: 1995,
          month: 2,
          day: 23,
          hour: 0,
          minute: 0,
          changed: true
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)setNow]', () => {
      test('should be callable', async () => {
        const wrapper = mountTime({ modelValue: null })

        expect(wrapper.vm.setNow()).toBeUndefined()
        await nextTick()

        const [value, details] = wrapper.emitted('update:modelValue')[0]

        expect(value).toMatch(/^\d{2}:\d{2}$/)
        expect(details).toMatchObject({
          hour: expect.any(Number),
          minute: expect.any(Number),
          second: expect.any(Number),
          millisecond: expect.any(Number),
          changed: true
        })

        // the header follows along
        expect(getHourLink(wrapper).text()).not.toBe('--')
        expect(getMinuteLink(wrapper).text()).not.toBe('--')
      })
    })
  })

  describe('[Accessibility]', () => {
    test('the header units implement the WAI-ARIA spinbutton semantics', () => {
      const wrapper = mountTime({
        modelValue: '15:30:20',
        format24h: true,
        withSeconds: true
      })

      const hour = getHourLink(wrapper).attributes()
      expect(hour.role).toBe('spinbutton')
      expect(hour.tabindex).toBe('0')
      expect(hour['aria-label']).toBe(langEn.date.hour)
      expect(hour['aria-valuemin']).toBe('0')
      expect(hour['aria-valuemax']).toBe('23')
      expect(hour['aria-valuenow']).toBe('15')

      const minute = getMinuteLink(wrapper).attributes()
      expect(minute.role).toBe('spinbutton')
      expect(minute['aria-label']).toBe(langEn.date.minute)
      expect(minute['aria-valuemin']).toBe('0')
      expect(minute['aria-valuemax']).toBe('59')
      expect(minute['aria-valuenow']).toBe('30')

      const second = getSecondLink(wrapper).attributes()
      expect(second.role).toBe('spinbutton')
      expect(second['aria-label']).toBe(langEn.date.second)
      expect(second['aria-valuemin']).toBe('0')
      expect(second['aria-valuemax']).toBe('59')
      expect(second['aria-valuenow']).toBe('20')
    })

    test('a 12h hour unit exposes the displayed 1-12 range', () => {
      const wrapper = mountTime({ modelValue: '15:30', format24h: false })
      const attrs = getHourLink(wrapper).attributes()

      expect(attrs['aria-valuemin']).toBe('1')
      expect(attrs['aria-valuemax']).toBe('12')
      expect(attrs['aria-valuenow']).toBe('3')

      const [am, pm] = getAmPmLinks(wrapper)
      expect(am.attributes('aria-pressed')).toBe('false')
      expect(pm.attributes('aria-pressed')).toBe('true')
    })

    test('an unset unit omits aria-valuenow', () => {
      const wrapper = mountTime({ modelValue: null })

      expect(getHourLink(wrapper).attributes('aria-valuenow')).toBeUndefined()
    })

    test.each([
      ['ArrowUp', 38, '11:30'],
      ['ArrowRight', 39, '11:30'],
      ['ArrowDown', 40, '09:30'],
      ['ArrowLeft', 37, '09:30'],
      ['Home', 36, '00:30'],
      ['End', 35, '23:30']
    ])('%s key adjusts the focused unit', async (_, keyCode, expected) => {
      const wrapper = mountTime({ format24h: true })

      await getHourLink(wrapper).trigger('keydown', { keyCode })

      expect(wrapper.emitted('update:modelValue')[0][0]).toBe(expected)
    })

    test('Home/End jump to the first/last valid value of restricted options', async () => {
      const wrapper = mountTime({ format24h: true, hourOptions: [9, 10, 11] })
      const hour = getHourLink(wrapper)

      await hour.trigger('keydown', { keyCode: 35 })
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('11:30')

      await hour.trigger('keydown', { keyCode: 36 })
      expect(wrapper.emitted('update:modelValue')[1][0]).toBe('09:30')
    })

    test('Home/End map the displayed 12h edges onto the current meridiem', async () => {
      const wrapper = mountTime({ modelValue: '15:30', format24h: false })
      const hour = getHourLink(wrapper)

      await hour.trigger('keydown', { keyCode: 36 })
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('13:30')

      await hour.trigger('keydown', { keyCode: 35 })
      expect(wrapper.emitted('update:modelValue')[1][0]).toBe('12:30')
    })

    test('Enter activates the focused unit view', async () => {
      const wrapper = mountTime()
      const minute = getMinuteLink(wrapper)

      expect(minute.classes()).not.toContain('q-time__link--active')

      await minute.trigger('keyup', { keyCode: 13 })

      expect(minute.classes()).toContain('q-time__link--active')
    })

    test('the clock face is hidden from assistive technology', () => {
      const wrapper = mountTime()

      expect(
        wrapper.get('.q-time__container-parent').attributes('aria-hidden')
      ).toBe('true')
    })

    test('the now button has an accessible name', () => {
      const wrapper = mountTime({ nowBtn: true })

      expect(wrapper.get('.q-time__now-button').attributes('aria-label')).toBe(
        langEn.date.now
      )
    })

    test('a readonly picker takes the units out of the Tab order', () => {
      const wrapper = mountTime({ readonly: true })

      expect(getHourLink(wrapper).attributes('tabindex')).toBe('-1')
    })
  })
})
