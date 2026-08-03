/**
 * Ignored specs:
 * [(modifier)center]
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

import Ripple from './Ripple.js'

describe('[Ripple API]', () => {
  describe('[Value]', () => {
    test('no value', async () => {
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Ripple]])
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as Boolean true', async () => {
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Ripple, true]])
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as Boolean false', async () => {
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Ripple, false]])
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(false)
    })

    test('as empty Object', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = {}
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as full Object', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = {
            stop: true,
            center: true,
            color: 'orange-5',
            keyCodes: []
          }
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as { early: true }', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { early: true }
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('pointerdown')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as { color: orange-5 }', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { color: 'orange-5' }
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.get('.q-ripple').classes()).toContain('text-orange-5')
    })

    test('as { stop: true }', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { stop: true }
          return () => h('div', [withDirectives(h('i'), [[Ripple, val]])])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.get('i').trigger('click')

      expect(wrapper.emitted()).not.toHaveProperty('click')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as { keyCodes: [ 65 ] }', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { keyCodes: [65] }
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('keyup', { keyCode: 65 })

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('as { early: true, keyCodes: [ 65 ] }', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = {
            early: true,
            keyCodes: [65]
          }
          return () => withDirectives(h('div'), [[Ripple, val]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('keydown', { keyCode: 65 })

      expect(wrapper.find('.q-ripple').exists()).toBe(true)
    })

    test('is reactive', async () => {
      const val = ref({ stop: true })
      const TestComponent = defineComponent({
        setup() {
          return () => h('div', [withDirectives(h('i'), [[Ripple, val.value]])])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.get('i').trigger('click')

      expect(wrapper.emitted()).not.toHaveProperty('click')

      val.value = { color: 'red' }
      await flushPromises()

      await wrapper.get('i').trigger('click')

      expect(wrapper.find('i > .q-ripple.text-red').exists()).toBe(true)

      expect(wrapper.emitted()).toHaveProperty('click')
    })

    test('merges modifiers with value', async () => {
      const TestComponent = defineComponent({
        setup() {
          const val = { color: 'orange-5' }
          return () =>
            withDirectives(h('div'), [[Ripple, val, void 0, { early: true }]])
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('pointerdown')

      expect(wrapper.find('.q-ripple').exists()).toBe(true)

      expect(wrapper.get('.q-ripple').classes()).toContain('text-orange-5')
    })
  })

  describe('[Argument]', () => {
    test('has effect', async () => {
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Ripple, void 0, 'orange-5']])
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(wrapper.get('.q-ripple').classes()).toContain('text-orange-5')
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)early]', () => {
      test('has effect', async () => {
        const TestComponent = defineComponent({
          render: () =>
            withDirectives(h('div'), [
              [Ripple, void 0, void 0, { early: true }]
            ])
        })

        const wrapper = mount(TestComponent)

        await wrapper.trigger('pointerdown')

        expect(wrapper.find('.q-ripple').exists()).toBe(true)
      })
    })

    describe('[(modifier)stop]', () => {
      test('has effect', async () => {
        const TestComponent = defineComponent({
          render: () =>
            h('div', [
              withDirectives(h('i'), [[Ripple, void 0, void 0, { stop: true }]])
            ])
        })

        const wrapper = mount(TestComponent)

        await wrapper.get('i').trigger('click')

        expect(wrapper.emitted()).not.toHaveProperty('click')

        expect(wrapper.find('.q-ripple').exists()).toBe(true)
      })
    })
  })
})
