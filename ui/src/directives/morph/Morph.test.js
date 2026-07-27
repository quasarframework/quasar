import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import Morph from './Morph.js'

function mountModifier(modifier) {
  const group = `modifier-${modifier.toLowerCase()}`
  const TestComponent = defineComponent({
    template: `<div v-morph:item:${group}.${modifier}="model" />`,
    directives: { Morph },
    setup() {
      return {
        model: 'item'
      }
    }
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
        template: '<div v-morph:item="val" />',
        directives: { Morph },
        setup() {
          return {
            val: {
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
          }
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
        template: '<div v-morph:any-value:primitive-group="val" />',
        directives: { Morph },
        setup() {
          return {
            val: 'any-value'
          }
        }
      })

      const wrapper = mount(TestComponent)
      const ctx = wrapper.element.__qmorph

      expect(ctx.name).toBe('any-value')
      expect(ctx.group).toBe('primitive-group')
      expect(ctx.model).toBe('any-value')
      expect(wrapper.classes()).not.toContain('q-morph--invisible')

      wrapper.unmount()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const TestComponent = defineComponent({
        template:
          '<div v-morph:item:argument-group:450:transitionend="model" />',
        directives: { Morph },
        setup() {
          return {
            model: 'other'
          }
        }
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
})
