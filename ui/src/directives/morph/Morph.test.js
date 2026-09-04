import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

import Morph from './Morph.js'

function mountModifier(modifier) {
  const group = `modifier-${modifier.toLowerCase()}`
  const TestComponent = defineComponent({
    render: () =>
      withDirectives(h('div'), [
        [Morph, 'item', `item:${group}`, { [modifier]: true }]
      ])
  })

  return mount(TestComponent)
}

function expectModifier(modifier) {
  const wrapper = mountModifier(modifier)

  expect(wrapper.element.__qmorph.opts[modifier]).toBe(true)

  wrapper.unmount()
}

describe('[Morph API]', () => {
  describe('[Value]', () => {
    test('as Object', () => {
      const onEnd = vi.fn()
      const TestComponent = defineComponent({
        setup() {
          const val = {
            group: 'dialogGroup',
            name: 'btn',
            model: 'btn',
            duration: 300,
            delay: 0,
            easing: 'ease-in-out',
            fill: 'none',
            classes: 'bg-grey-2',
            style: 'border-radius: 20px',
            resize: true,
            useCSS: true,
            hideFromClone: true,
            keepToClone: true,
            tween: true,
            tweenFromOpacity: 0.6,
            tweenToOpacity: 0.5,
            waitFor: 0,
            onEnd
          }
          return () => withDirectives(h('div'), [[Morph, val, 'item']])
        }
      })

      const wrapper = mount(TestComponent)
      const ctx = wrapper.element.__qmorph

      expect(ctx.name).toBe('btn')
      expect(ctx.group).toBe('dialogGroup')
      expect(ctx.model).toBe('btn')
      expect(ctx.opts).toMatchObject({
        duration: 300,
        delay: 0,
        easing: 'ease-in-out',
        fill: 'none',
        classes: 'bg-grey-2',
        style: 'border-radius: 20px',
        resize: true,
        useCSS: true,
        hideFromClone: true,
        keepToClone: true,
        tween: true,
        tweenFromOpacity: 0.6,
        tweenToOpacity: 0.5,
        waitFor: 0,
        onEnd
      })
      expect(wrapper.classes()).not.toContain('q-morph--invisible')

      wrapper.unmount()
    })

    test('as Any', () => {
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div'), [
            [Morph, 'any-value', 'any-value:primitive-group']
          ])
      })

      const wrapper = mount(TestComponent)
      const ctx = wrapper.element.__qmorph

      expect(ctx.name).toBe('any-value')
      expect(ctx.group).toBe('primitive-group')
      expect(ctx.model).toBe('any-value')
      expect(wrapper.classes()).not.toContain('q-morph--invisible')

      wrapper.unmount()
    })

    test('as Object keeps the modifiers it does not name', () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { model: 'item', resize: false }
          return () =>
            withDirectives(h('div'), [
              [Morph, val, 'item:modifier-keep', { tween: true, resize: true }]
            ])
        }
      })

      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qmorph.opts).toMatchObject({
        tween: true,
        resize: false
      })

      wrapper.unmount()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div'), [
            [Morph, 'other', 'item:argument-group:450:transitionend']
          ])
      })

      const wrapper = mount(TestComponent)
      const ctx = wrapper.element.__qmorph

      expect(ctx.name).toBe('item')
      expect(ctx.group).toBe('argument-group')
      expect(ctx.opts.duration).toBe(450)
      expect(ctx.opts.waitFor).toBe('transitionend')
      expect(wrapper.classes()).toContain('q-morph--invisible')

      wrapper.unmount()
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)resize]', () => {
      test('has effect', () => {
        expectModifier('resize')
      })
    })

    describe('[(modifier)useCSS]', () => {
      test('has effect', () => {
        expectModifier('useCSS')
      })
    })

    describe('[(modifier)hideFromClone]', () => {
      test('has effect', () => {
        expectModifier('hideFromClone')
      })
    })

    describe('[(modifier)keepToClone]', () => {
      test('has effect', () => {
        expectModifier('keepToClone')
      })
    })

    describe('[(modifier)tween]', () => {
      test('has effect', () => {
        expectModifier('tween')
      })
    })
  })

  describe('[Generic]', () => {
    const invisible = el => el.classList.contains('q-morph--invisible')

    // two members of one group, 'one' active; a unique group per test
    // since the groups are module-level state
    function mountGroup(group, model, cls) {
      const TestComponent = defineComponent({
        render: () =>
          h('div', [
            withDirectives(
              h('div', {
                id: 'one',
                class: cls.value,
                style: 'width: 40px; height: 40px'
              }),
              [[Morph, model.value, `one:${group}:50`]]
            ),
            withDirectives(
              h('div', {
                id: 'two',
                class: cls.value,
                style: 'width: 80px; height: 80px'
              }),
              [[Morph, model.value, `two:${group}:50`]]
            )
          ])
      })

      const wrapper = mount(TestComponent, { attachTo: document.body })

      return {
        wrapper,
        one: wrapper.get('#one').element,
        two: wrapper.get('#two').element
      }
    }

    test('morphs to the member that becomes active', async () => {
      const model = ref('one')
      const { wrapper, one, two } = mountGroup('generic-morph', model, ref('a'))

      expect(invisible(one)).toBe(false)
      expect(invisible(two)).toBe(true)

      model.value = 'two'
      await flushPromises()

      await vi.waitFor(() => {
        expect(invisible(one)).toBe(true)
        expect(invisible(two)).toBe(false)
      })

      wrapper.unmount()
    })

    test('keeps the visibility class when the element class binding changes', async () => {
      const cls = ref('a')
      const { wrapper, one, two } = mountGroup('generic-class', ref('one'), cls)

      cls.value = 'b'
      await flushPromises()

      expect(one.className).toBe('b')
      expect(two.className).toBe('b q-morph--invisible')

      wrapper.unmount()
    })

    test('sets the visibility class before mount on elements without a class binding', () => {
      const seen = {}
      const Spy = {
        beforeMount(el) {
          seen[el.id] = invisible(el)
        }
      }
      const TestComponent = defineComponent({
        render: () =>
          h('div', [
            withDirectives(h('div', { id: 'one' }), [
              [Morph, 'one', 'one:generic-created'],
              [Spy]
            ]),
            withDirectives(h('div', { id: 'two' }), [
              [Morph, 'one', 'two:generic-created'],
              [Spy]
            ])
          ])
      })

      const wrapper = mount(TestComponent)

      expect(seen).toEqual({ one: false, two: true })
      expect(invisible(wrapper.get('#one').element)).toBe(false)
      expect(invisible(wrapper.get('#two').element)).toBe(true)

      wrapper.unmount()
    })

    test('forgets the group once its last member unmounts', () => {
      const first = mountGroup('generic-unmount', ref('one'), ref('a'))

      expect(invisible(first.two)).toBe(true)

      first.wrapper.unmount()

      expect(invisible(first.two)).toBe(false)

      // a fresh group: the active member shows without a morph
      const second = mountGroup('generic-unmount', ref('two'), ref('a'))

      expect(invisible(second.one)).toBe(true)
      expect(invisible(second.two)).toBe(false)

      second.wrapper.unmount()
    })
  })
})
