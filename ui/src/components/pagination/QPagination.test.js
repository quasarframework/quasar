import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { getRouter } from 'testing/runtime/router.js'
import QPagination from './QPagination.js'

let activeWrapper

afterEach(() => {
  activeWrapper?.unmount()
  activeWrapper = void 0
  vi.restoreAllMocks()
})

function mountPagination(props = {}, options = {}) {
  activeWrapper = mount(QPagination, {
    props: { modelValue: 5, max: 10, ...props },
    ...options
  })

  return activeWrapper
}

function getButtons(wrapper) {
  return wrapper.findAll('.q-btn')
}

function getPageLabels(wrapper) {
  return wrapper.findAll('.q-pagination__middle .q-btn').map(btn => btn.text())
}

function getActiveButton(wrapper) {
  return wrapper.get('.q-btn[aria-current="true"]')
}

function getInput(wrapper) {
  return wrapper.get('input')
}

describe('[QPagination API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountPagination()

        expect(getActiveButton(wrapper).text()).toBe('5')

        await wrapper.setProps({ modelValue: 7 })

        expect(getActiveButton(wrapper).text()).toBe('7')
      })
    })

    describe('[(prop)min]', () => {
      test('type Number has effect', () => {
        const wrapper = mountPagination({ min: 3, modelValue: 3, max: 6 })

        expect(getPageLabels(wrapper)).toStrictEqual(['3', '4', '5', '6'])
      })

      test('type String has effect', () => {
        const wrapper = mountPagination({ min: '3', modelValue: 3, max: 6 })

        expect(getPageLabels(wrapper)).toStrictEqual(['3', '4', '5', '6'])
      })

      test('clamps the model to it', async () => {
        const wrapper = mountPagination({
          modelValue: 1,
          min: 1,
          max: 10,
          'onUpdate:modelValue': () => {}
        })

        await wrapper.setProps({ min: 4 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[4]])
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', () => {
        const wrapper = mountPagination({ modelValue: 1, max: 3 })

        expect(getPageLabels(wrapper)).toStrictEqual(['1', '2', '3'])
      })

      test('type String has effect', () => {
        const wrapper = mountPagination({ modelValue: 1, max: '3' })

        expect(getPageLabels(wrapper)).toStrictEqual(['1', '2', '3'])
      })

      test('clamps the model to it', async () => {
        const wrapper = mountPagination({
          modelValue: 10,
          max: 10,
          'onUpdate:modelValue': () => {}
        })

        await wrapper.setProps({ max: 6 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[6]])
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ input: true, dark: true })

        expect(wrapper.get('.q-field').classes()).toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountPagination({ input: true, dark: null })

        await wrapper.vm.$q.dark.set(true)
        expect(wrapper.get('.q-field').classes()).toContain('q-field--dark')

        await wrapper.vm.$q.dark.set(false)
        expect(wrapper.get('.q-field').classes()).not.toContain('q-field--dark')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ size: '2em' })

        expect(getButtons(wrapper)[0].element.style.fontSize).toBe('2em')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPagination({
          disable: true,
          'onUpdate:modelValue': () => {}
        })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')

        await getPageButton(wrapper, '7').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)input]', () => {
      test('type Boolean has effect', () => {
        expect(mountPagination().find('input').exists()).toBe(false)

        const wrapper = mountPagination({ input: true })

        expect(getInput(wrapper).attributes('placeholder')).toBe('5 / 10')
        // the page buttons are replaced by the input
        expect(wrapper.find('.q-pagination__middle').exists()).toBe(false)
      })

      test('submits the typed page', async () => {
        const wrapper = mountPagination({
          input: true,
          'onUpdate:modelValue': () => {}
        })

        await getInput(wrapper).setValue('8')
        await getInput(wrapper).trigger('keyup', { keyCode: 13 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[8]])
      })

      test('ignores a page outside of the range', async () => {
        const wrapper = mountPagination({
          input: true,
          'onUpdate:modelValue': () => {}
        })

        await getInput(wrapper).setValue('99')
        await getInput(wrapper).trigger('keyup', { keyCode: 13 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[10]])
      })
    })

    describe('[(prop)icon-prev]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          directionLinks: true,
          iconPrev: 'alarm_on'
        })

        expect(getIconOf(wrapper, 'prev')).toBe('alarm_on')
      })
    })

    describe('[(prop)icon-next]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          directionLinks: true,
          iconNext: 'alarm_on'
        })

        expect(getIconOf(wrapper, 'next')).toBe('alarm_on')
      })
    })

    describe('[(prop)icon-first]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          boundaryLinks: true,
          iconFirst: 'alarm_on'
        })

        expect(getIconOf(wrapper, 'first')).toBe('alarm_on')
      })
    })

    describe('[(prop)icon-last]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          boundaryLinks: true,
          iconLast: 'alarm_on'
        })

        expect(getIconOf(wrapper, 'last')).toBe('alarm_on')
      })
    })

    describe('[(prop)to-fn]', () => {
      test('type Function has effect', async () => {
        const router = await getRouter('/page/:page')
        const toFn = vi.fn(page => `/page/${page}`)

        const wrapper = mountPagination(
          { toFn },
          { global: { plugins: [router] } }
        )

        expect(toFn).toHaveBeenCalled()

        const button = getPageButton(wrapper, '7')
        expect(button.element.tagName).toBe('A')
        expect(button.attributes('href')).toBe('/page/7')
      })

      test('replaces the click handler', async () => {
        const router = await getRouter('/page/:page')

        const wrapper = mountPagination(
          { toFn: page => `/page/${page}`, 'onUpdate:modelValue': () => {} },
          { global: { plugins: [router] } }
        )

        await getPageButton(wrapper, '7').trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/page/7')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)boundary-links]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPagination({ boundaryLinks: false })

        expect(getAriaLabels(wrapper)).not.toContain(getFirstLabel(wrapper))

        await wrapper.setProps({ boundaryLinks: true })

        expect(getAriaLabels(wrapper)).toContain(getFirstLabel(wrapper))
      })

      test('jumps to the boundaries', async () => {
        const wrapper = mountPagination({
          boundaryLinks: true,
          'onUpdate:modelValue': () => {}
        })

        await getBoundaryButton(wrapper, 'first').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[1]])

        await getBoundaryButton(wrapper, 'last').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[1], [10]])
      })

      test('follows the input prop by default', () => {
        const plain = mountPagination()
        expect(getAriaLabels(plain)).not.toContain(getFirstLabel(plain))

        const withInput = mountPagination({ input: true })
        expect(getAriaLabels(withInput)).toContain(getFirstLabel(withInput))
      })
    })

    describe('[(prop)boundary-numbers]', () => {
      test('type Boolean has effect', () => {
        const options = { modelValue: 10, max: 20, maxPages: 3 }

        const without = mountPagination({
          ...options,
          boundaryNumbers: false,
          ellipses: false
        })
        expect(getPageLabels(without)).not.toContain('1')
        without.unmount()

        const wrapper = mountPagination({
          ...options,
          boundaryNumbers: true,
          ellipses: false
        })

        // the boundaries live outside of the middle section
        const labels = getButtons(wrapper).map(btn => btn.text())
        expect(labels).toContain('1')
        expect(labels).toContain('20')
      })
    })

    describe('[(prop)direction-links]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPagination({ directionLinks: false })

        expect(getAriaLabels(wrapper)).not.toContain(getPrevLabel(wrapper))

        await wrapper.setProps({ directionLinks: true })

        expect(getAriaLabels(wrapper)).toContain(getPrevLabel(wrapper))
      })

      test('walks one page at a time', async () => {
        const wrapper = mountPagination({
          directionLinks: true,
          'onUpdate:modelValue': () => {}
        })

        await getBoundaryButton(wrapper, 'prev').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[4]])

        await getBoundaryButton(wrapper, 'next').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[4], [6]])
      })

      test('disables the link which has nowhere to go', () => {
        const wrapper = mountPagination({
          modelValue: 1,
          directionLinks: true
        })

        expect(getBoundaryButton(wrapper, 'prev').classes()).toContain(
          'disabled'
        )
        expect(getBoundaryButton(wrapper, 'next').classes()).not.toContain(
          'disabled'
        )
      })
    })

    describe('[(prop)ellipses]', () => {
      test('type Boolean has effect', () => {
        const options = {
          modelValue: 10,
          max: 20,
          maxPages: 5,
          boundaryNumbers: true
        }

        const without = mountPagination({ ...options, ellipses: false })
        expect(without.text()).not.toContain('…')
        without.unmount()

        const wrapper = mountPagination({ ...options, ellipses: true })

        expect(wrapper.text()).toContain('…')
      })

      test('jumps over the skipped pages', async () => {
        const wrapper = mountPagination({
          modelValue: 10,
          max: 20,
          maxPages: 5,
          boundaryNumbers: true,
          ellipses: true,
          'onUpdate:modelValue': () => {}
        })

        const ellipsis = getButtons(wrapper).find(btn => btn.text() === '…')
        await ellipsis.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
        expect(wrapper.emitted('update:modelValue')[0][0]).toBeLessThan(10)
      })
    })

    describe('[(prop)max-pages]', () => {
      test('type Number has effect', () => {
        const wrapper = mountPagination({
          modelValue: 10,
          max: 20,
          maxPages: 3,
          boundaryNumbers: false,
          ellipses: false
        })

        expect(getPageLabels(wrapper)).toHaveLength(3)
      })

      test('type String has effect', () => {
        const wrapper = mountPagination({
          modelValue: 10,
          max: 20,
          maxPages: '3',
          boundaryNumbers: false,
          ellipses: false
        })

        expect(getPageLabels(wrapper)).toHaveLength(3)
      })

      test('shows every page when zero', () => {
        const wrapper = mountPagination({ modelValue: 1, max: 8, maxPages: 0 })

        expect(getPageLabels(wrapper)).toHaveLength(8)
      })

      test('only accepts a positive value', () => {
        const { validator } = QPagination.props.maxPages

        expect(validator(0)).toBe(true)
        expect(validator(5)).toBe(true)
        expect(validator('5')).toBe(true)
        expect(validator(-1)).toBe(false)
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ flat: true })

        expect(getPageButton(wrapper, '7').classes()).toContain('q-btn--flat')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ outline: true })

        expect(getPageButton(wrapper, '7').classes()).toContain(
          'q-btn--outline'
        )
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ unelevated: true })

        expect(getPageButton(wrapper, '7').classes()).toContain(
          'q-btn--unelevated'
        )
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ push: true })

        expect(getPageButton(wrapper, '7').classes()).toContain('q-btn--push')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ color: 'purple' })

        expect(getPageButton(wrapper, '7').classes()).toContain('text-purple')
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          flat: false,
          color: 'purple',
          textColor: 'white'
        })

        expect(getPageButton(wrapper, '7').classes()).toContain('text-white')
      })
    })

    describe('[(prop)active-design]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ activeDesign: 'push' })

        expect(getActiveButton(wrapper).classes()).toContain('q-btn--push')
        // the inactive pages keep the regular design
        expect(getPageButton(wrapper, '7').classes()).toContain('q-btn--flat')
      })

      test('resets the regular design on the active page', () => {
        const wrapper = mountPagination({ activeDesign: 'push' })

        expect(getActiveButton(wrapper).classes()).not.toContain('q-btn--flat')
      })
    })

    describe('[(prop)active-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ activeColor: 'purple' })

        // the active page loses the flat design, so the color becomes
        // its background instead of its text color
        expect(getActiveButton(wrapper).classes()).toContain('bg-purple')
        expect(getPageButton(wrapper, '7').classes()).not.toContain('bg-purple')
      })
    })

    describe('[(prop)active-text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          activeDesign: 'unelevated',
          activeColor: 'purple',
          activeTextColor: 'white'
        })

        expect(getActiveButton(wrapper).classes()).toContain('text-white')
      })
    })

    describe('[(prop)round]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ round: true })

        expect(getPageButton(wrapper, '7').classes()).toContain('q-btn--round')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPagination({ rounded: true })

        expect(getPageButton(wrapper, '7').classes()).toContain(
          'q-btn--rounded'
        )
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', () => {
        expect(getPageButton(mountPagination(), '7').classes()).not.toContain(
          'glossy'
        )

        const wrapper = mountPagination({ glossy: true })

        expect(getPageButton(wrapper, '7').classes()).toContain('glossy')
      })

      test('applies to every button', () => {
        const wrapper = mountPagination({
          glossy: true,
          boundaryLinks: true,
          directionLinks: true
        })

        getButtons(wrapper).forEach(button => {
          expect(button.classes()).toContain('glossy')
        })
      })
    })

    describe('[(prop)gutter]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ gutter: '10px' })
        const style = wrapper.get('.q-pagination__content').attributes('style')

        expect(style).toContain('--q-pagination-gutter-parent: -10px')
        expect(style).toContain('--q-pagination-gutter-child: 10px')
      })

      test('accepts a padding shorthand', () => {
        const wrapper = mountPagination({ gutter: 'md' })
        const style = wrapper.get('.q-pagination__content').attributes('style')

        expect(style).toContain('--q-pagination-gutter-child:')
        expect(style).not.toContain('md')
      })
    })

    describe('[(prop)padding]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({ padding: '8px 12px' })

        expect(getPageButton(wrapper, '7').element.style.padding).toBe(
          '8px 12px'
        )
      })
    })

    describe('[(prop)input-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputStyle: 'color: red'
        })

        expect(getInput(wrapper).element.style.color).toBe('red')
      })

      test('type Array has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputStyle: [{ color: 'red' }, { fontWeight: 'bold' }]
        })

        const style = getInput(wrapper).element.style
        expect(style.color).toBe('red')
        expect(style.fontWeight).toBe('bold')
      })

      test('type Object has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputStyle: { color: 'red' }
        })

        expect(getInput(wrapper).element.style.color).toBe('red')
      })
    })

    describe('[(prop)input-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputClass: 'my-input'
        })

        expect(getInput(wrapper).classes()).toContain('my-input')
      })

      test('type Array has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputClass: ['my-input', 'other']
        })

        expect(getInput(wrapper).classes()).toEqual(
          expect.arrayContaining(['my-input', 'other'])
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountPagination({
          input: true,
          inputClass: { 'my-input': true, unused: false }
        })

        const classes = getInput(wrapper).classes()
        expect(classes).toContain('my-input')
        expect(classes).not.toContain('unused')
      })
    })

    describe('[(prop)ripple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPagination({ ripple: false })
        const button = getPageButton(wrapper, '7')

        await button.trigger('click')

        expect(button.find('.q-ripple').exists()).toBe(false)
      })

      test('type Object has effect', async () => {
        const wrapper = mountPagination({
          ripple: { center: true, color: 'teal', keyCodes: [] }
        })
        const button = getPageButton(wrapper, '7')

        await button.trigger('click')

        expect(button.get('.q-ripple').classes()).toContain('text-teal')
      })

      test('is enabled by default', async () => {
        const wrapper = mountPagination()
        const button = getPageButton(wrapper, '7')

        await button.trigger('click')

        expect(button.find('.q-ripple').exists()).toBe(true)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        await getPageButton(wrapper, '7').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toStrictEqual([[7]])
      })

      test('is not emitting for the current page', async () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        await getActiveButton(wrapper).trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        expect(wrapper.vm.set(8)).toBeUndefined()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[8]])
      })

      test('clamps to the min/max range', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        wrapper.vm.set(99)
        wrapper.vm.set(-99)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[10], [1]])
      })

      test('ignores a value which is not a number', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        wrapper.vm.set('nope')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(method)setByOffset]', () => {
      test('should be callable', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        expect(wrapper.vm.setByOffset(2)).toBeUndefined()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[7]])
      })

      test('walks backwards with a negative offset', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        wrapper.vm.setByOffset(-2)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[3]])
      })

      test('clamps to the min/max range', () => {
        const wrapper = mountPagination({ 'onUpdate:modelValue': () => {} })

        wrapper.vm.setByOffset(99)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[10]])
      })
    })
  })
})

function getPageButton(wrapper, label) {
  const button = getButtons(wrapper).find(btn => btn.text() === label)

  if (button === void 0) {
    throw new Error(`No pagination button labelled "${label}"`)
  }

  return button
}

function getAriaLabels(wrapper) {
  return getButtons(wrapper).map(btn => btn.attributes('aria-label'))
}

function getLangLabel(wrapper, key) {
  return wrapper.vm.$q.lang.pagination[key]
}

function getFirstLabel(wrapper) {
  return getLangLabel(wrapper, 'first')
}

function getPrevLabel(wrapper) {
  return getLangLabel(wrapper, 'prev')
}

function getBoundaryButton(wrapper, key) {
  const label = getLangLabel(wrapper, key)
  const button = getButtons(wrapper).find(
    btn => btn.attributes('aria-label') === label
  )

  if (button === void 0) {
    throw new Error(`No "${key}" pagination button`)
  }

  return button
}

function getIconOf(wrapper, key) {
  return getBoundaryButton(wrapper, key).get('.q-icon').text()
}
