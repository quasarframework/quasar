/**
 * Ignored specs:
 * [(modifier)center]
 */

import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import { defineComponent, ref } from 'vue'

import Ripple from './Ripple.js'

describe('[Ripple API]', () => {
  describe('[Value]', () => {
    test('no value', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple />',
        directives: { Ripple }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as Boolean true', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="true" />',
        directives: { Ripple }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as Boolean false', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="false" />',
        directives: { Ripple }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(false)
    })

    test('as empty Object', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: {}
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as full Object', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: {
              stop: true,
              center: true,
              color: 'orange-5',
              keyCodes: []
            }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as { early: true }', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: { early: true }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('pointerdown')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as { color: orange-5 }', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: { color: 'orange-5' }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.get('.q-ripple')
          .classes()
      ).toContain('text-orange-5')
    })

    test('as { stop: true }', async () => {
      const TestComponent = defineComponent({
        template: '<div><i v-ripple="val" /></div>',
        directives: { Ripple },
        setup () {
          return {
            val: { stop: true }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.get('i').trigger('click')

      expect(
        wrapper.emitted()
      ).not.toHaveProperty('click')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as { keyCodes: [ 65 ] }', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: { keyCodes: [ 65 ] }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('keyup', { keyCode: 65 })

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('as { early: true, keyCodes: [ 65 ] }', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: {
              early: true,
              keyCodes: [ 65 ]
            }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('keydown', { keyCode: 65 })

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)
    })

    test('is reactive', async () => {
      const val = ref({ stop: true })
      const TestComponent = defineComponent({
        template: '<div><i v-ripple="val" /></div>',
        directives: { Ripple },
        setup () {
          return { val }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.get('i').trigger('click')

      expect(
        wrapper.emitted()
      ).not.toHaveProperty('click')

      val.value = { color: 'red' }
      await flushPromises()

      await wrapper.get('i').trigger('click')

      expect(
        wrapper.find('i > .q-ripple.text-red')
          .exists()
      ).toBe(true)

      expect(
        wrapper.emitted()
      ).toHaveProperty('click')
    })

    test('merges modifiers with value', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple.early="val" />',
        directives: { Ripple },
        setup () {
          return {
            val: { color: 'orange-5' }
          }
        }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('pointerdown')

      expect(
        wrapper.find('.q-ripple')
          .exists()
      ).toBe(true)

      expect(
        wrapper.get('.q-ripple')
          .classes()
      ).toContain('text-orange-5')
    })
  })

  describe('[Argument]', () => {
    test('has effect', async () => {
      const TestComponent = defineComponent({
        template: '<div v-ripple:orange-5 />',
        directives: { Ripple }
      })

      const wrapper = mount(TestComponent)

      await wrapper.trigger('click')

      expect(
        wrapper.get('.q-ripple')
          .classes()
      ).toContain('text-orange-5')
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)early]', () => {
      test('has effect', async () => {
        const TestComponent = defineComponent({
          template: '<div v-ripple.early />',
          directives: { Ripple }
        })

        const wrapper = mount(TestComponent)

        await wrapper.trigger('pointerdown')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(modifier)stop]', () => {
      test('has effect', async () => {
        const TestComponent = defineComponent({
          template: '<div><i v-ripple.stop /></div>',
          directives: { Ripple }
        })

        const wrapper = mount(TestComponent)

        await wrapper.get('i').trigger('click')

        expect(
          wrapper.emitted()
        ).not.toHaveProperty('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })
  })
})
