import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, nextTick, ref, withDirectives } from 'vue'

import Resize from './Resize.js'

enableAutoUnmount(afterEach)

function box(width, height) {
  return `width: ${width}px; height: ${height}px`
}

// a real ResizeObserver delivers during the rendering steps of the next
// frame, after the animation frame callbacks
function frames(count) {
  return new Promise(resolve => {
    const step = () => {
      count--
      if (count > 0) {
        requestAnimationFrame(step)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(step)
  })
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// mounts a div carrying the directive; `value` and `arg` may be refs
// (read on every render) so that a test can swap them in place
function mountResize(value, { arg, modifiers, style = box(120, 80) } = {}) {
  const TestComponent = defineComponent({
    render: () =>
      withDirectives(h('div', { style }), [
        [
          Resize,
          isRef(value) ? value.value : value,
          isRef(arg) ? arg.value : arg,
          modifiers
        ]
      ])
  })

  const wrapper = mount(TestComponent)
  return { wrapper, el: wrapper.element }
}

describe('[Resize API]', () => {
  describe('[Value]', () => {
    test('as Boolean', async () => {
      const handler = vi.fn()
      const value = ref(false)
      const { el } = mountResize(value)

      expect(el.__qresize).toBeDefined()
      expect(el.__qresize.observer).toBeUndefined()

      // arming reports the current size right away
      value.value = handler
      await nextTick()

      expect(handler).toHaveBeenCalledExactlyOnceWith({
        width: 120,
        height: 80
      })

      value.value = false
      await nextTick()

      expect(el.__qresize.observer).toBeUndefined()

      // disabled: nothing is reported
      el.style.width = '150px'
      await frames(2)
      expect(handler).toHaveBeenCalledOnce()

      // re-arming catches up with the missed change
      value.value = handler
      await nextTick()

      expect(handler).toHaveBeenCalledTimes(2)
      expect(handler).toHaveBeenLastCalledWith({ width: 150, height: 80 })
    })

    test('as undefined', async () => {
      const handler = vi.fn()
      const value = ref(void 0)
      const { el } = mountResize(value)

      expect(el.__qresize.observer).toBeUndefined()

      value.value = handler
      await nextTick()

      expect(handler).toHaveBeenCalledOnce()

      value.value = void 0
      await nextTick()

      expect(el.__qresize.observer).toBeUndefined()
    })

    test('as Function', async () => {
      const handler = vi.fn()
      const { el } = mountResize(handler)

      expect(el.__qresize.observer).toBeDefined()
      expect(handler).toHaveBeenCalledExactlyOnceWith({
        width: 120,
        height: 80
      })

      el.style.cssText = box(200, 50)

      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(2)
      })
      expect(handler).toHaveBeenLastCalledWith({ width: 200, height: 50 })
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)once]', () => {
      test('has effect', async () => {
        const handler = vi.fn()
        const { el } = mountResize(handler, { modifiers: { once: true } })

        // the initial size is the one and only report
        expect(handler).toHaveBeenCalledExactlyOnceWith({
          width: 120,
          height: 80
        })
        expect(el.__qresize).toBeUndefined()

        el.style.width = '150px'
        await frames(2)

        expect(handler).toHaveBeenCalledOnce()
      })
    })
  })

  describe('[Generic]', () => {
    test('reports the initial size, even a 0x0 one', () => {
      const handler = vi.fn()
      const { el } = mountResize(handler, { style: '' })

      expect(el.offsetHeight).toBe(0)
      expect(handler).toHaveBeenCalledExactlyOnceWith({
        width: el.offsetWidth,
        height: 0
      })
    })

    test('tracks the border box of the element', async () => {
      const handler = vi.fn()
      const { el } = mountResize(handler, {
        style: `box-sizing: content-box; ${box(120, 80)}`
      })

      // padding grows the border box but leaves the content box untouched
      el.style.padding = '10px 5px'

      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(2)
      })
      expect(handler).toHaveBeenLastCalledWith({ width: 130, height: 100 })
    })

    test('swaps the handler in place', async () => {
      const first = vi.fn()
      const second = vi.fn()
      const value = ref(first)
      const { el } = mountResize(value)
      const { observer } = el.__qresize

      value.value = second
      await nextTick()

      // same observer, no re-report of an unchanged size
      expect(el.__qresize.observer).toBe(observer)
      expect(second).not.toHaveBeenCalled()

      el.style.width = '150px'

      await vi.waitFor(() => {
        expect(second).toHaveBeenCalledOnce()
      })
      expect(first).toHaveBeenCalledOnce()
    })

    test('returning false from the handler stops observing', async () => {
      const handler = vi.fn(size => size.width < 150)
      const { el } = mountResize(handler)

      el.style.width = '150px'

      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(2)
      })
      expect(el.__qresize).toBeUndefined()

      el.style.width = '200px'
      await frames(2)

      expect(handler).toHaveBeenCalledTimes(2)
    })

    test('a pending debounced measurement is dropped when disabled', async () => {
      const handler = vi.fn()
      const value = ref(handler)
      const { el } = mountResize(value, { arg: 100 })

      el.style.width = '150px'
      await frames(2)

      value.value = false
      await nextTick()

      await sleep(150)
      expect(handler).toHaveBeenCalledOnce()
    })

    test('stops observing on unmount', async () => {
      const handler = vi.fn()
      const { el, wrapper } = mountResize(handler, { arg: 100 })

      // keep the element in the document so that it could still resize
      wrapper.unmount()
      document.body.append(el)

      expect(el.__qresize).toBeUndefined()

      el.style.width = '150px'
      await sleep(150)

      expect(handler).toHaveBeenCalledOnce()

      el.remove()
    })
  })

  describe('[Argument]', () => {
    test('has effect', async () => {
      const handler = vi.fn()
      const { el } = mountResize(handler, { arg: 100 })

      expect(handler).toHaveBeenCalledExactlyOnceWith({
        width: 120,
        height: 80
      })

      el.style.width = '150px'
      await frames(2)

      // the observer has reported, the window has not elapsed yet
      expect(handler).toHaveBeenCalledOnce()

      el.style.width = '200px'

      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(2)
      })

      // the measurement at the end of the window sees the latest width
      expect(handler).toHaveBeenLastCalledWith({ width: 200, height: 80 })

      await sleep(150)
      expect(handler).toHaveBeenCalledTimes(2)
    })

    test('accepts a String', async () => {
      const handler = vi.fn()
      const { el } = mountResize(handler, { arg: '100' })

      el.style.width = '150px'
      await frames(2)

      expect(handler).toHaveBeenCalledOnce()

      await vi.waitFor(() => {
        expect(handler).toHaveBeenCalledTimes(2)
      })
      expect(handler).toHaveBeenLastCalledWith({ width: 150, height: 80 })
    })

    test('a dynamic arg applies from the next change', async () => {
      const handler = vi.fn()
      const arg = ref(100)
      const { el } = mountResize(handler, { arg })

      arg.value = 0
      await nextTick()

      el.style.width = '150px'
      await frames(2)

      // no window anymore: the observer's report is the measurement
      expect(handler).toHaveBeenCalledTimes(2)
      expect(handler).toHaveBeenLastCalledWith({ width: 150, height: 80 })
    })
  })
})
