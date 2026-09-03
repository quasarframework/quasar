import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'

import Mutation from './Mutation.js'

let observers

beforeEach(() => {
  observers = []

  vi.stubGlobal(
    'MutationObserver',
    class {
      constructor(callback) {
        this.callback = callback
        this.observe = vi.fn((_el, options) => {
          this.options = options
        })
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mountModifier(modifier) {
  const handler = vi.fn(() => true)
  const TestComponent = defineComponent({
    render: () =>
      withDirectives(h('div'), [
        [Mutation, handler, void 0, { [modifier]: true }]
      ])
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function expectModifier(modifier) {
  const { wrapper } = mountModifier(modifier)

  expect(observers[0].options).toStrictEqual({
    [modifier]: true
  })

  wrapper.unmount()
}

describe('[Mutation API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const handler = vi.fn(() => true)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Mutation, handler]])
      })

      const wrapper = mount(TestComponent)
      const observer = observers[0]
      const mutations = [{ type: 'attributes' }]

      expect(observer.observe).toHaveBeenCalledWith(wrapper.element, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        attributeOldValue: true,
        characterDataOldValue: true
      })

      observer.callback(mutations)

      expect(handler).toHaveBeenCalledWith(mutations)
      expect(wrapper.element.__qmutation).toBeDefined()
    })

    test('as Boolean', async () => {
      const handler = vi.fn(() => true)
      const value = ref(false)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Mutation, value.value]])
      })

      const wrapper = mount(TestComponent)

      expect(observers).toHaveLength(0)
      expect(wrapper.element.__qmutation).toBeDefined()

      value.value = handler
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].observe).toHaveBeenCalledWith(
        wrapper.element,
        expect.any(Object)
      )

      value.value = false
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].disconnect).toHaveBeenCalledOnce()

      value.value = handler
      await nextTick()

      expect(observers).toHaveLength(2)
      expect(observers[1].observe).toHaveBeenCalledWith(
        wrapper.element,
        expect.any(Object)
      )
    })

    test('as undefined', async () => {
      const handler = vi.fn(() => true)
      const value = ref(handler)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Mutation, value.value]])
      })

      mount(TestComponent)

      expect(observers).toHaveLength(1)

      value.value = void 0
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].disconnect).toHaveBeenCalledOnce()
    })

    test('swapping the handler keeps the observer', async () => {
      const first = vi.fn(() => true)
      const second = vi.fn(() => true)
      const value = ref(first)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Mutation, value.value]])
      })

      mount(TestComponent)
      const mutations = [{ type: 'attributes' }]

      value.value = second
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].disconnect).not.toHaveBeenCalled()

      observers[0].callback(mutations)

      expect(first).not.toHaveBeenCalled()
      expect(second).toHaveBeenCalledWith(mutations)
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)once]', () => {
      test('has effect', () => {
        const { handler, wrapper } = mountModifier('once')
        const observer = observers[0]

        observer.callback([{ type: 'childList' }])

        expect(handler).toHaveBeenCalledOnce()
        expect(observer.disconnect).toHaveBeenCalledOnce()
        expect(wrapper.element.__qmutation).toBeUndefined()
      })
    })

    describe('[(modifier)childList]', () => {
      test('has effect', () => {
        expectModifier('childList')
      })
    })

    describe('[(modifier)subtree]', () => {
      test('has effect', () => {
        expectModifier('subtree')
      })
    })

    describe('[(modifier)attributes]', () => {
      test('has effect', () => {
        expectModifier('attributes')
      })
    })

    describe('[(modifier)characterData]', () => {
      test('has effect', () => {
        expectModifier('characterData')
      })
    })

    describe('[(modifier)attributeOldValue]', () => {
      test('has effect', () => {
        expectModifier('attributeOldValue')
      })
    })

    describe('[(modifier)characterDataOldValue]', () => {
      test('has effect', () => {
        expectModifier('characterDataOldValue')
      })
    })
  })
})
