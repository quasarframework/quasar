import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'

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
    test('as Boolean', async () => {
      const handler = vi.fn(() => true)
      const value = ref(false)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Intersection, value.value]])
      })

      const wrapper = mount(TestComponent)

      expect(observers).toHaveLength(0)
      expect(wrapper.element.__qvisible).toBeDefined()

      value.value = handler
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].observe).toHaveBeenCalledWith(wrapper.element)

      value.value = false
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].disconnect).toHaveBeenCalledOnce()
    })

    test('as Boolean false leaves no handler for a queued entry', async () => {
      const handler = vi.fn(() => true)
      const value = ref(handler)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Intersection, value.value]])
      })

      mount(TestComponent)
      const observer = observers[0]

      value.value = false
      await nextTick()

      // the observer callback reads the ctx at call time, so an entry queued
      // before the disable must find no handler and no observer to touch
      observer.callback([{ isIntersecting: true, rootBounds: {} }])
      observer.callback([{ isIntersecting: true, rootBounds: null }])

      expect(handler).not.toHaveBeenCalled()
      expect(observer.unobserve).not.toHaveBeenCalled()
    })

    test('as Object', () => {
      const handler = vi.fn(() => true)
      const root = document.createElement('div')
      const TestComponent = defineComponent({
        setup() {
          const val = {
            handler,
            cfg: {
              root,
              rootMargin: '10px 20px 30px 40px',
              threshold: [0, 0.25, 0.5, 0.75, 1]
            }
          }
          return () => withDirectives(h('div'), [[Intersection, val]])
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
        render: () => withDirectives(h('div'), [[Intersection, handler]])
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
          render: () =>
            withDirectives(h('div'), [
              [Intersection, handler, void 0, { once: true }]
            ])
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
