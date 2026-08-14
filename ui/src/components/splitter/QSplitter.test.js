import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QSplitter from './QSplitter.js'

function mountSplitter(props = {}, slots = {}) {
  return mount(QSplitter, {
    props: {
      modelValue: 20,
      ...props
    },
    slots
  })
}

function getBefore(wrapper) {
  return wrapper.get('.q-splitter__before')
}

function getAfter(wrapper) {
  return wrapper.get('.q-splitter__after')
}

function getSeparator(wrapper) {
  return wrapper.get('.q-splitter__separator')
}

function getPanHandler(wrapper) {
  return wrapper.get('.q-splitter__separator-area').element.__qtouchpan.handler
}

function startPan(wrapper) {
  wrapper.element.getBoundingClientRect = () => ({
    height: 200,
    width: 200
  })
  getPanHandler(wrapper)({ isFirst: true })
}

function movePan(wrapper, horizontal = false) {
  getPanHandler(wrapper)({
    direction: horizontal ? 'down' : 'right',
    distance: { x: 20, y: 20 },
    isFinal: false,
    isFirst: false
  })
}

function endPan(wrapper) {
  getPanHandler(wrapper)({ isFinal: true, isFirst: false })
}

describe('[QSplitter API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Number has effect', () => {
        const wrapper = mountSplitter({ modelValue: 35 })

        expect(getBefore(wrapper).$style('width')).toBe('35%')
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSplitter({ reverse: true })

        expect(getBefore(wrapper).$style('width')).toBe('')
        expect(getAfter(wrapper).$style('width')).toBe('20%')
        expect(getBefore(wrapper).classes()).toContain('col')
        expect(getAfter(wrapper).classes()).not.toContain('col')
      })
    })

    describe('[(prop)unit]', () => {
      test('value "%" has effect', () => {
        const wrapper = mountSplitter({ unit: '%' })

        expect(getBefore(wrapper).$style('width')).toBe('20%')
      })

      test('value "px" has effect', () => {
        const wrapper = mountSplitter({ unit: 'px' })

        expect(getBefore(wrapper).$style('width')).toBe('20px')
      })
    })

    describe('[(prop)emit-immediately]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSplitter({ emitImmediately: true })

        startPan(wrapper)
        movePan(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[30]])
      })
    })

    describe('[(prop)horizontal]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSplitter({ horizontal: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-splitter--horizontal', 'column'])
        )
        expect(getBefore(wrapper).$style('height')).toBe('20%')
        expect(getBefore(wrapper).$style('width')).toBe('')
        expect(
          wrapper.get('.q-splitter__separator-area').element.__qtouchpan
            .direction
        ).toMatchObject({ vertical: true })
      })
    })

    describe('[(prop)limits]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountSplitter({ modelValue: 10 })

        await wrapper.setProps({ limits: [30, 70] })
        await nextTick()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[30]])
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSplitter({ disable: true })

        expect(wrapper.classes()).toContain('q-splitter--disabled')
        expect(getSeparator(wrapper).attributes('aria-disabled')).toBe('true')
        expect(
          wrapper.get('.q-splitter__separator-area').element.__qtouchpan
        ).toBeUndefined()
      })
    })

    describe('[(prop)before-class]', () => {
      test('type String has effect', () => {
        expect(
          getBefore(mountSplitter({ beforeClass: 'custom-before' })).classes()
        ).toContain('custom-before')
      })

      test('type Array has effect', () => {
        expect(
          getBefore(
            mountSplitter({
              beforeClass: ['custom-before', 'highlighted']
            })
          ).classes()
        ).toEqual(expect.arrayContaining(['custom-before', 'highlighted']))
      })

      test('type Object has effect', () => {
        const panel = getBefore(
          mountSplitter({
            beforeClass: {
              'custom-before': true,
              unused: false
            }
          })
        )

        expect(panel.classes()).toContain('custom-before')
        expect(panel.classes()).not.toContain('unused')
      })
    })

    describe('[(prop)after-class]', () => {
      test('type String has effect', () => {
        expect(
          getAfter(mountSplitter({ afterClass: 'custom-after' })).classes()
        ).toContain('custom-after')
      })

      test('type Array has effect', () => {
        expect(
          getAfter(
            mountSplitter({ afterClass: ['custom-after', 'highlighted'] })
          ).classes()
        ).toEqual(expect.arrayContaining(['custom-after', 'highlighted']))
      })

      test('type Object has effect', () => {
        const panel = getAfter(
          mountSplitter({
            afterClass: {
              'custom-after': true,
              unused: false
            }
          })
        )

        expect(panel.classes()).toContain('custom-after')
        expect(panel.classes()).not.toContain('unused')
      })
    })

    describe('[(prop)separator-class]', () => {
      test('type String has effect', () => {
        expect(
          getSeparator(
            mountSplitter({ separatorClass: 'custom-separator' })
          ).classes()
        ).toContain('custom-separator')
      })

      test('type Array has effect', () => {
        expect(
          getSeparator(
            mountSplitter({
              separatorClass: ['custom-separator', 'highlighted']
            })
          ).classes()
        ).toEqual(expect.arrayContaining(['custom-separator', 'highlighted']))
      })

      test('type Object has effect', () => {
        const separator = getSeparator(
          mountSplitter({
            separatorClass: {
              'custom-separator': true,
              unused: false
            }
          })
        )

        expect(separator.classes()).toContain('custom-separator')
        expect(separator.classes()).not.toContain('unused')
      })
    })

    describe('[(prop)separator-style]', () => {
      test('type String has effect', () => {
        expect(
          getSeparator(
            mountSplitter({ separatorStyle: 'color: red' })
          ).attributes('style')
        ).toContain('color: red')
      })

      test('type Array has effect', () => {
        const style = getSeparator(
          mountSplitter({
            separatorStyle: ['color: red', { backgroundColor: 'blue' }]
          })
        ).attributes('style')

        expect(style).toContain('color: red')
        expect(style).toContain('background-color: blue')
      })

      test('type Object has effect', () => {
        expect(
          getSeparator(
            mountSplitter({ separatorStyle: { color: 'red' } })
          ).attributes('style')
        ).toContain('color: red')
      })
    })

    describe('[(prop)separator-aria-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Resize the navigation panel'
        const wrapper = mountSplitter()

        expect(getSeparator(wrapper).attributes('aria-label')).toBe(
          wrapper.vm.$q.lang.label.resize
        )

        await wrapper.setProps({ separatorAriaLabel: propVal })

        expect(getSeparator(wrapper).attributes('aria-label')).toBe(propVal)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSplitter({ dark: true })

        expect(wrapper.classes()).toContain('q-splitter--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountSplitter({ dark: null })
        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-splitter--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-splitter--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountSplitter(
          {},
          { default: () => 'Additional splitter content' }
        )

        expect(wrapper.text()).toContain('Additional splitter content')
      })
    })

    describe('[(slot)before]', () => {
      test('renders the content', () => {
        const wrapper = mountSplitter({}, { before: () => 'Before content' })

        expect(getBefore(wrapper).text()).toBe('Before content')
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', () => {
        const wrapper = mountSplitter({}, { after: () => 'After content' })

        expect(getAfter(wrapper).text()).toBe('After content')
      })
    })

    describe('[(slot)separator]', () => {
      test('renders the content', () => {
        const wrapper = mountSplitter(
          {},
          { separator: () => 'Separator content' }
        )

        expect(wrapper.get('.q-splitter__separator-area').text()).toContain(
          'Separator content'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const wrapper = mountSplitter()

        startPan(wrapper)
        movePan(wrapper)
        endPan(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[30]])
      })
    })
  })

  describe('[Accessibility]', () => {
    test('the separator implements the WAI-ARIA window splitter semantics', () => {
      const wrapper = mountSplitter()
      const attrs = getSeparator(wrapper).attributes()

      expect(attrs.role).toBe('separator')
      expect(attrs.tabindex).toBe('0')
      expect(attrs['aria-orientation']).toBe('vertical')
      expect(attrs['aria-valuemin']).toBe('10')
      expect(attrs['aria-valuemax']).toBe('90')
      expect(attrs['aria-valuenow']).toBe('20')
      expect(attrs['aria-controls']).toBe(getBefore(wrapper).attributes('id'))
    })

    test('the separator is named through the language pack, disabled included', () => {
      // its children are presentational (WAI-ARIA), so the separator can
      // only get an accessible name from this attribute
      const wrapper = mountSplitter({ disable: true })
      const label = wrapper.vm.$q.lang.label.resize

      expect(label).toEqual(expect.any(String))
      expect(getSeparator(wrapper).attributes('aria-label')).toBe(label)
    })

    test('the separator aria reflects horizontal/reverse/limits props', () => {
      const wrapper = mountSplitter({
        horizontal: true,
        reverse: true,
        limits: [30, 70]
      })
      const attrs = getSeparator(wrapper).attributes()

      expect(attrs['aria-orientation']).toBe('horizontal')
      expect(attrs['aria-valuemin']).toBe('30')
      expect(attrs['aria-valuemax']).toBe('70')
      expect(attrs['aria-controls']).toBe(getAfter(wrapper).attributes('id'))
    })

    test('the separator omits aria-valuemax for an Infinity limit', () => {
      // default "px" limits are [ 50, Infinity ]
      const wrapper = mountSplitter({ unit: 'px' })
      const attrs = getSeparator(wrapper).attributes()

      expect(attrs['aria-valuemin']).toBe('50')
      expect(attrs['aria-valuemax']).toBeUndefined()
    })

    test('a disabled separator is neither focusable nor keyboard-operable', async () => {
      const wrapper = mountSplitter({ disable: true })
      const separator = getSeparator(wrapper)

      expect(separator.attributes('tabindex')).toBeUndefined()
      expect(separator.attributes('aria-valuenow')).toBeUndefined()

      await separator.trigger('keydown', { keyCode: 39 })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test.each([
      ['ArrowRight', 39, {}, 21],
      ['ArrowLeft', 37, {}, 19],
      ['ArrowDown', 40, { horizontal: true }, 21],
      ['ArrowUp', 38, { horizontal: true }, 19],
      ['ArrowRight', 39, { reverse: true }, 19],
      ['Home', 36, {}, 10],
      ['End', 35, {}, 90]
    ])(
      '%s key moves the splitter (extra props: %o)',
      async (_, keyCode, props, expected) => {
        const wrapper = mountSplitter(props)

        await getSeparator(wrapper).trigger('keydown', { keyCode })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[expected]])
      }
    )

    test('left/right arrow keys are reversed in RTL', async () => {
      const wrapper = mountSplitter()

      wrapper.vm.$q.lang.rtl = true

      try {
        await getSeparator(wrapper).trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[19]])
      } finally {
        wrapper.vm.$q.lang.rtl = false
      }
    })

    test('cross-axis and unrelated keys are ignored', async () => {
      const wrapper = mountSplitter()
      const separator = getSeparator(wrapper)

      // ArrowUp/ArrowDown belong to horizontal splitters; Space is unrelated
      for (const keyCode of [38, 40, 32]) {
        await separator.trigger('keydown', { keyCode })
      }

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test('arrows step by 10px in "px" unit; End clamps to the container size', async () => {
      const wrapper = mountSplitter({ unit: 'px', modelValue: 60 })
      wrapper.element.getBoundingClientRect = () => ({
        height: 200,
        width: 200
      })
      const separator = getSeparator(wrapper)

      await separator.trigger('keydown', { keyCode: 39 })
      await separator.trigger('keydown', { keyCode: 35 })

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[70], [200]])
    })

    test('Enter collapses the primary panel, then restores it', async () => {
      const wrapper = mountSplitter() // model 20, default limits [ 10, 90 ]
      const separator = getSeparator(wrapper)

      await separator.trigger('keydown', { keyCode: 13 })

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[10]])

      await wrapper.setProps({ modelValue: 10 })
      await separator.trigger('keydown', { keyCode: 13 })

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[10], [20]])
    })

    test('Enter does nothing when collapsed without a stored position', async () => {
      const wrapper = mountSplitter({ modelValue: 10 })

      await getSeparator(wrapper).trigger('keydown', { keyCode: 13 })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test('does not emit when the splitter is already at the limit', async () => {
      const wrapper = mountSplitter({ modelValue: 90 })

      await getSeparator(wrapper).trigger('keydown', { keyCode: 39 })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
