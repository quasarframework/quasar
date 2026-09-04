import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'

import Intersection from './Intersection.js'

// observers are pooled per config, so every test must give its element
// back or the next test would silently reuse this one's observer
enableAutoUnmount(afterEach)

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

    test('as undefined', async () => {
      const handler = vi.fn(() => true)
      const value = ref(void 0)
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

      value.value = void 0
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

      const wrapper = mount(TestComponent)
      const observer = observers[0]
      const target = wrapper.element

      value.value = false
      await nextTick()

      // the observer callback reads the ctx at call time, so an entry queued
      // before the disable must find no handler and no observer to touch
      observer.callback(
        [{ target, isIntersecting: true, rootBounds: {} }],
        observer
      )
      observer.callback(
        [{ target, isIntersecting: true, rootBounds: null }],
        observer
      )

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
        target: wrapper.element,
        isIntersecting: false,
        rootBounds: {}
      }

      expect(observer.options).toStrictEqual({
        root,
        rootMargin: '10px 20px 30px 40px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      })
      expect(observer.observe).toHaveBeenCalledWith(wrapper.element)

      observer.callback([entry], observer)

      expect(handler).toHaveBeenCalledWith(entry)
    })

    test('as Function', () => {
      const handler = vi.fn(() => true)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Intersection, handler]])
      })

      const wrapper = mount(TestComponent)
      const observer = observers[0]
      const entry = {
        target: wrapper.element,
        isIntersecting: false,
        rootBounds: {}
      }

      expect(observer.options).toStrictEqual({
        root: null,
        rootMargin: '0px',
        threshold: 0
      })

      observer.callback([entry], observer)

      expect(handler).toHaveBeenCalledWith(entry)
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
        const entry = {
          target: wrapper.element,
          isIntersecting: true,
          rootBounds: {}
        }

        observer.callback([entry], observer)

        // the handler must see the very entry that retires the element
        expect(handler).toHaveBeenCalledExactlyOnceWith(entry)
        expect(observer.disconnect).toHaveBeenCalledOnce()
        expect(wrapper.element.__qvisible).toBeUndefined()
      })
    })
  })

  describe('[Generic]', () => {
    function entryFor(target, isIntersecting = true) {
      return { target, isIntersecting, rootBounds: {} }
    }

    function mountPair(valueA, valueB) {
      const TestComponent = defineComponent({
        render: () =>
          h('div', [
            withDirectives(h('div', { class: 'a' }), [[Intersection, valueA]]),
            withDirectives(h('div', { class: 'b' }), [[Intersection, valueB]])
          ])
      })

      const wrapper = mount(TestComponent)

      return {
        wrapper,
        a: wrapper.get('.a').element,
        b: wrapper.get('.b').element
      }
    }

    test('elements with the same config share one observer', () => {
      const handlerA = vi.fn()
      const handlerB = vi.fn()
      const { a, b } = mountPair(handlerA, handlerB)

      expect(observers).toHaveLength(1)
      const [observer] = observers
      expect(observer.observe).toHaveBeenCalledTimes(2)
      expect(observer.observe).toHaveBeenCalledWith(a)
      expect(observer.observe).toHaveBeenCalledWith(b)

      const entryA = entryFor(a)
      const entryB = entryFor(b)
      observer.callback([entryA, entryB], observer)

      expect(handlerA).toHaveBeenCalledExactlyOnceWith(entryA)
      expect(handlerB).toHaveBeenCalledExactlyOnceWith(entryB)
    })

    test('elements with different configs get separate observers', () => {
      const cfgA = { rootMargin: '10px', threshold: [0, 1] }
      const cfgB = { rootMargin: '10px', threshold: [0, 0.5] }
      mountPair(
        { handler: vi.fn(), cfg: cfgA },
        { handler: vi.fn(), cfg: cfgB }
      )

      expect(observers).toHaveLength(2)
      expect(observers[0].options.threshold).toBe(cfgA.threshold)
      expect(observers[1].options.threshold).toBe(cfgB.threshold)
    })

    test('an equal inline config does not re-register the element', async () => {
      const handler = vi.fn()
      const tick = ref(0)
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div', { 'data-tick': tick.value }), [
            [
              Intersection,
              { handler, cfg: { rootMargin: '5px', threshold: [0, 0.5] } }
            ]
          ])
      })

      mount(TestComponent)

      tick.value++
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(observers[0].observe).toHaveBeenCalledOnce()
      expect(observers[0].unobserve).not.toHaveBeenCalled()
    })

    test('a config change moves the element to another observer', async () => {
      const handler = vi.fn()
      const threshold = ref(0)
      const TestComponent = defineComponent({
        render: () =>
          withDirectives(h('div'), [
            [Intersection, { handler, cfg: { threshold: threshold.value } }]
          ])
      })

      const wrapper = mount(TestComponent)
      const [first] = observers

      threshold.value = 1
      await nextTick()

      expect(observers).toHaveLength(2)
      expect(first.disconnect).toHaveBeenCalledOnce()
      expect(observers[1].observe).toHaveBeenCalledWith(wrapper.element)

      // an entry the old observer had already queued must be ignored
      first.callback([entryFor(wrapper.element)], first)
      expect(handler).not.toHaveBeenCalled()

      observers[1].callback([entryFor(wrapper.element)], observers[1])
      expect(handler).toHaveBeenCalledOnce()
    })

    test('leaving elements unobserve, the last one disconnects', () => {
      const { a, b } = mountPair(
        vi.fn(),
        vi.fn(() => false)
      )
      const [observer] = observers

      observer.callback([entryFor(b)], observer)

      expect(observer.unobserve).toHaveBeenCalledExactlyOnceWith(b)
      expect(observer.disconnect).not.toHaveBeenCalled()
      expect(b.__qvisible).toBeUndefined()
      expect(a.__qvisible).toBeDefined()

      observer.callback([entryFor(a)], observer)
      expect(a.__qvisible).toBeDefined()
    })

    test('once only retires its own element from the shared observer', () => {
      const handlerA = vi.fn()
      const handlerB = vi.fn()
      const TestComponent = defineComponent({
        render: () =>
          h('div', [
            withDirectives(h('div', { class: 'a' }), [
              [Intersection, handlerA, void 0, { once: true }]
            ]),
            withDirectives(h('div', { class: 'b' }), [[Intersection, handlerB]])
          ])
      })

      const wrapper = mount(TestComponent)
      const a = wrapper.get('.a').element
      const b = wrapper.get('.b').element
      const [observer] = observers

      // a second entry for a retired element in the same batch is dropped
      observer.callback(
        [entryFor(a, false), entryFor(a), entryFor(a), entryFor(b)],
        observer
      )

      expect(handlerA).toHaveBeenCalledTimes(2)
      expect(handlerB).toHaveBeenCalledOnce()
      expect(observer.unobserve).toHaveBeenCalledExactlyOnceWith(a)
      expect(observer.disconnect).not.toHaveBeenCalled()

      wrapper.unmount()

      expect(observer.disconnect).toHaveBeenCalledOnce()
      expect(observers).toHaveLength(1)
    })

    // the stub above cannot tell whether the directive drives a real
    // observer correctly (entry order, batching, retire timing), so this
    // block runs against the browser's own IntersectionObserver inside a
    // scroll container
    describe('with the real IntersectionObserver', () => {
      beforeEach(() => {
        vi.unstubAllGlobals()
      })

      const seen = fn => fn.mock.calls.map(([entry]) => entry.isIntersecting)

      function mountScroller(observed) {
        const TestComponent = defineComponent({
          render: () =>
            h(
              'div',
              { class: 'area', style: 'height: 200px; overflow: auto' },
              [
                h('div', { style: 'height: 400px' }),
                ...observed.map(([id, value, modifiers]) =>
                  withDirectives(h('div', { id, style: 'height: 20px' }), [
                    [Intersection, value, void 0, modifiers]
                  ])
                ),
                h('div', { style: 'height: 400px' })
              ]
            )
        })

        const wrapper = mount(TestComponent, { attachTo: document.body })

        return { wrapper, area: wrapper.element }
      }

      async function scrollAndDeliver(area, top, probe) {
        const before = probe.mock.calls.length
        area.scrollTop = top
        await vi.waitFor(() =>
          expect(probe.mock.calls.length).toBeGreaterThan(before)
        )
      }

      test('once fires the handler with the intersecting entry, then retires only its element', async () => {
        const onceFn = vi.fn()
        const plainFn = vi.fn()
        const { wrapper, area } = mountScroller([
          ['once', onceFn, { once: true }],
          ['plain', plainFn, {}]
        ])
        const onceEl = wrapper.get('#once').element

        // the initial delivery reports both as hidden
        await vi.waitFor(() => expect(seen(plainFn)).toEqual([false]))
        expect(seen(onceFn)).toEqual([false])
        expect(onceEl.__qvisible).toBeDefined()

        await scrollAndDeliver(area, 350, plainFn)

        expect(seen(onceFn)).toEqual([false, true])
        expect(onceEl.__qvisible).toBeUndefined()

        // the sibling still shares the observer and keeps reporting
        await scrollAndDeliver(area, 0, plainFn)
        await scrollAndDeliver(area, 350, plainFn)

        expect(seen(plainFn)).toEqual([false, true, false, true])
        expect(seen(onceFn)).toEqual([false, true])
      })

      test('returning false from the handler stops observing that element only', async () => {
        const stopFn = vi.fn(() => false)
        const plainFn = vi.fn()
        const { wrapper, area } = mountScroller([
          ['stop', stopFn, {}],
          ['plain', plainFn, {}]
        ])

        // the initial (hidden) entry already returns false
        await vi.waitFor(() => expect(seen(stopFn)).toEqual([false]))
        expect(wrapper.get('#stop').element.__qvisible).toBeUndefined()

        await scrollAndDeliver(area, 350, plainFn)

        expect(seen(plainFn)).toEqual([false, true])
        expect(seen(stopFn)).toEqual([false])
      })
    })
  })
})
