import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

import Scroll from './Scroll.js'

let addEventListener
let removeEventListener

beforeEach(() => {
  addEventListener = vi.spyOn(window, 'addEventListener')
  removeEventListener = vi.spyOn(window, 'removeEventListener')

  Object.defineProperties(window, {
    scrollX: {
      configurable: true,
      value: 12
    },
    scrollY: {
      configurable: true,
      value: 45
    }
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  // remove the own-property shadows so the Window.prototype
  // getters take over again
  delete window.scrollX
  delete window.scrollY
})

describe('[Scroll API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const handler = vi.fn()
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Scroll, handler]])
      })

      const wrapper = mount(TestComponent)

      expect(addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.anything()
      )

      window.dispatchEvent(new Event('scroll'))

      expect(handler).toHaveBeenCalledWith(45, 12)

      wrapper.unmount()

      expect(removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.anything()
      )
    })

    test('as undefined', () => {
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Scroll]])
      })

      mount(TestComponent)

      window.dispatchEvent(new Event('scroll'))

      expect(addEventListener).not.toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        expect.anything()
      )
    })
  })

  describe('[Generic]', () => {
    function mountMany(handlers) {
      const TestComponent = defineComponent({
        render: () =>
          h(
            'div',
            handlers.map((handler, i) =>
              withDirectives(h('div', { key: i }), [[Scroll, handler]])
            )
          )
      })

      return mount(TestComponent)
    }

    function scrollListeners(spy) {
      return spy.mock.calls.filter(([name]) => name === 'scroll').length
    }

    test('shares one listener per scroll target', () => {
      const handlers = [vi.fn(), vi.fn(), vi.fn()]
      const wrapper = mountMany(handlers)

      expect(scrollListeners(addEventListener)).toBe(1)

      window.dispatchEvent(new Event('scroll'))

      for (const handler of handlers) {
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(45, 12)
      }

      wrapper.unmount()

      expect(scrollListeners(removeEventListener)).toBe(1)
    })

    test('keeps the listener until the last element leaves', async () => {
      const handlers = [vi.fn(), vi.fn()]
      const count = ref(2)
      const TestComponent = defineComponent({
        render: () =>
          h(
            'div',
            handlers
              .slice(0, count.value)
              .map((handler, i) =>
                withDirectives(h('div', { key: i }), [[Scroll, handler]])
              )
          )
      })

      const wrapper = mount(TestComponent)

      count.value = 1
      await flushPromises()

      expect(scrollListeners(removeEventListener)).toBe(0)

      window.dispatchEvent(new Event('scroll'))

      expect(handlers[0]).toHaveBeenCalledTimes(1)
      expect(handlers[1]).not.toHaveBeenCalled()

      count.value = 0
      await flushPromises()

      expect(scrollListeners(removeEventListener)).toBe(1)

      wrapper.unmount()
    })

    test('unsubscribes on a non-function value and resubscribes on a function', async () => {
      const handler = vi.fn()
      const value = ref(handler)
      const TestComponent = defineComponent({
        render: () => withDirectives(h('div'), [[Scroll, value.value]])
      })

      mount(TestComponent)

      value.value = void 0
      await flushPromises()

      expect(scrollListeners(removeEventListener)).toBe(1)

      window.dispatchEvent(new Event('scroll'))

      expect(handler).not.toHaveBeenCalled()

      value.value = handler
      await flushPromises()

      expect(scrollListeners(addEventListener)).toBe(2)

      window.dispatchEvent(new Event('scroll'))

      expect(handler).toHaveBeenCalledWith(45, 12)
    })

    test('listens on the closest scroll container instead of window', () => {
      const handler = vi.fn()
      const TestComponent = defineComponent({
        render: () =>
          h('div', { class: 'scroll', style: 'height: 50px' }, [
            withDirectives(h('div', { style: 'height: 500px' }), [
              [Scroll, handler]
            ])
          ])
      })

      const wrapper = mount(TestComponent)

      expect(scrollListeners(addEventListener)).toBe(0)

      wrapper.element.scrollTop = 30
      wrapper.element.dispatchEvent(new Event('scroll'))

      expect(handler).toHaveBeenCalledWith(30, 0)
    })

    test('survives a handler unmounting a sibling during dispatch', async () => {
      const show = ref(true)
      const second = vi.fn()
      const first = vi.fn(() => {
        show.value = false
      })
      const TestComponent = defineComponent({
        render: () =>
          h('div', [
            withDirectives(h('div', { key: 'a' }), [[Scroll, first]]),
            show.value
              ? withDirectives(h('div', { key: 'b' }), [[Scroll, second]])
              : null
          ])
      })

      mount(TestComponent)

      window.dispatchEvent(new Event('scroll'))
      await flushPromises()

      window.dispatchEvent(new Event('scroll'))

      expect(first).toHaveBeenCalledTimes(2)
      expect(second).toHaveBeenCalledTimes(1)
    })
  })
})
