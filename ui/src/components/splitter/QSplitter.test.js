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
})
