import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import Intersection from './Intersection.js'

let observers

beforeEach(() => {
  observers = []

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback, options) {
        this.callback = callback
        this.options = options
        this.observe = vi.fn()
        this.unobserve = vi.fn()
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('[Intersection API]', () => {
  describe('[Value]', () => {
    test('as Object', () => {
      const handler = vi.fn(() => true)
      const root = document.createElement('div')
      const TestComponent = defineComponent({
        template: '<div v-intersection="val" />',
        directives: { Intersection },
        setup() {
          return {
            val: {
              handler,
              cfg: {
                root,
                rootMargin: '10px 20px 30px 40px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
              }
            }
          }
        }
      })

      const wrapper = mount(TestComponent)
      const observer = observers[0]
      const entry = {
        isIntersecting: false,
        rootBounds: {}
      }

      expect(observer.options).toStrictEqual({
        root,
        rootMargin: '10px 20px 30px 40px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      })
      expect(observer.observe).toHaveBeenCalledWith(wrapper.element)

      observer.callback([entry])

      expect(handler).toHaveBeenCalledWith(entry, observer)
    })

    test('as Function', () => {
      const handler = vi.fn(() => true)
      const TestComponent = defineComponent({
        template: '<div v-intersection="handler" />',
        directives: { Intersection },
        setup() {
          return { handler }
        }
      })

      const wrapper = mount(TestComponent)
      const observer = observers[0]
      const entry = {
        isIntersecting: false,
        rootBounds: {}
      }

      expect(observer.options).toStrictEqual({
        root: null,
        rootMargin: '0px',
        threshold: 0
      })

      observer.callback([entry])

      expect(handler).toHaveBeenCalledWith(entry, observer)
      expect(wrapper.element.__qvisible).toBeDefined()
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)once]', () => {
      test('has effect', () => {
        const handler = vi.fn(() => true)
        const TestComponent = defineComponent({
          template: '<div v-intersection.once="handler" />',
          directives: { Intersection },
          setup() {
            return { handler }
          }
        })

        const wrapper = mount(TestComponent)
        const observer = observers[0]

        observer.callback([
          {
            isIntersecting: true,
            rootBounds: {}
          }
        ])

        expect(handler).toHaveBeenCalledOnce()
        expect(observer.disconnect).toHaveBeenCalledOnce()
        expect(wrapper.element.__qvisible).toBeUndefined()
      })
    })
  })
})
