import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

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
    template: `<div v-mutation.${modifier}="handler" />`,
    directives: { Mutation },
    setup() {
      return { handler }
    }
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
        template: '<div v-mutation="handler" />',
        directives: { Mutation },
        setup() {
          return { handler }
        }
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
