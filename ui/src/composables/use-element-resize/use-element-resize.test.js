import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, toValue } from 'vue'

import useElementResize from './use-element-resize.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.restoreAllMocks()
})

function box(width, height) {
  return `width: ${width}px; height: ${height}px`
}

// mounts a component watching a child element through a template ref;
// `options` (object, ref or getter) is merged in through a getter
function mountTarget(options, style = box(120, 80)) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        const target = ref(null)
        result = useElementResize(() => ({ target, ...toValue(options) }))
        return () => h('div', [h('div', { ref: target, style })])
      }
    })
  )

  return { wrapper, el: wrapper.element.firstElementChild, ...result }
}

function sizeOf(el) {
  return { width: el.offsetWidth, height: el.offsetHeight }
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

describe('[useElementResize API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        let result
        const wrapper = mount(
          defineComponent({
            setup() {
              result = useElementResize()
              return () => h('div', { style: box(120, 80) })
            }
          })
        )

        // no target: the component's root element is measured at mount
        expect(result.width.value).toBe(wrapper.element.offsetWidth)
        expect(result.height.value).toBe(wrapper.element.offsetHeight)
        expect(result.width.value).toBe(120)
        expect(result.height.value).toBe(80)
        expect(result.refresh).toBeTypeOf('function')
        expect(result.stop).toBeTypeOf('function')
      })

      test('does not measure a fragment root', () => {
        let result
        mount(
          defineComponent({
            setup() {
              result = useElementResize()
              return () => [h('div'), h('div')]
            }
          })
        )

        expect(result.width.value).toBe(0)
        expect(result.height.value).toBe(0)
      })

      test('measures the target instead of the root when given', () => {
        const { el, wrapper, width, height } = mountTarget()

        expect(el).not.toBe(wrapper.element)
        expect(width.value).toBe(el.offsetWidth)
        expect(height.value).toBe(el.offsetHeight)
      })

      test('accepts a plain options object', () => {
        const el = document.createElement('div')
        el.style.cssText = box(30, 20)
        document.body.append(el)

        let result
        mount(
          defineComponent({
            setup() {
              result = useElementResize({ target: el })
              return () => h('div')
            }
          })
        )

        expect(result.width.value).toBe(30)
        expect(result.height.value).toBe(20)

        result.stop()
        el.remove()
      })

      test('works outside of a component instance', () => {
        const el = document.createElement('div')
        el.style.cssText = box(30, 20)
        document.body.append(el)

        const { width, height, stop } = useElementResize({ target: el })

        expect(width.value).toBe(30)
        expect(height.value).toBe(20)

        stop()
        el.remove()
      })

      test('reports the initial size through onResize, even a 0x0 one', () => {
        const onResize = vi.fn()
        const { el } = mountTarget({ onResize }, '')

        expect(el.offsetHeight).toBe(0)
        expect(onResize).toHaveBeenCalledExactlyOnceWith({
          width: el.offsetWidth,
          height: 0
        })
      })

      test('follows the element size', async () => {
        const onResize = vi.fn()
        const { el, width, height } = mountTarget({ onResize })

        expect(onResize).toHaveBeenCalledOnce()

        el.style.cssText = box(200, 50)

        await vi.waitFor(() => {
          expect(onResize).toHaveBeenCalledTimes(2)
        })

        expect(onResize).toHaveBeenLastCalledWith({ width: 200, height: 50 })
        expect(width.value).toBe(200)
        expect(height.value).toBe(50)
      })

      test('tracks the border box of the element', async () => {
        const onResize = vi.fn()
        const { el, width, height } = mountTarget(
          { onResize },
          `box-sizing: content-box; ${box(120, 80)}`
        )

        // padding grows the border box but leaves the content box untouched
        el.style.padding = '10px 5px'

        await vi.waitFor(() => {
          expect(onResize).toHaveBeenCalledTimes(2)
        })

        expect(sizeOf(el)).toStrictEqual({ width: 130, height: 100 })
        expect(width.value).toBe(130)
        expect(height.value).toBe(100)
      })

      test('measures at most once per debounce window', async () => {
        const onResize = vi.fn()
        const { el, width } = mountTarget({ onResize, debounce: 100 })

        expect(onResize).toHaveBeenCalledOnce()

        el.style.width = '150px'
        await frames(2)

        // the observer has reported, the window has not elapsed yet
        expect(width.value).toBe(120)

        el.style.width = '200px'

        await vi.waitFor(() => {
          expect(onResize).toHaveBeenCalledTimes(2)
        })

        // the measurement at the end of the window sees the latest width
        expect(width.value).toBe(200)

        await sleep(150)
        expect(onResize).toHaveBeenCalledTimes(2)
      })

      test('accepts the debounce as a String', async () => {
        const onResize = vi.fn()
        const { el, width } = mountTarget({ onResize, debounce: '100' })

        el.style.width = '150px'
        await frames(2)

        expect(width.value).toBe(120)

        await vi.waitFor(() => {
          expect(width.value).toBe(150)
        })
        expect(onResize).toHaveBeenCalledTimes(2)
      })

      test('keeps the last size while disabled and catches up on resume', async () => {
        const disabled = ref(false)
        const onResize = vi.fn()
        const { el, width } = mountTarget(() => ({
          onResize,
          disabled: disabled.value
        }))

        disabled.value = true
        el.style.width = '150px'

        // give a still-running observer the chance to report
        await frames(2)

        expect(onResize).toHaveBeenCalledOnce()
        expect(width.value).toBe(120)

        disabled.value = false

        // resuming measures right away
        expect(onResize).toHaveBeenCalledTimes(2)
        expect(width.value).toBe(150)

        // ...and observes again
        el.style.width = '200px'
        await vi.waitFor(() => {
          expect(width.value).toBe(200)
        })
      })

      test('resuming an unchanged element reports nothing', () => {
        const disabled = ref(false)
        const onResize = vi.fn()
        mountTarget(() => ({ onResize, disabled: disabled.value }))

        disabled.value = true
        disabled.value = false

        expect(onResize).toHaveBeenCalledOnce()
      })

      test('follows a target ref pointing to another element', async () => {
        const onResize = vi.fn()
        let target
        const wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              useElementResize({ target, onResize })
              return () =>
                h('div', [
                  h('div', { ref: target, style: box(120, 80) }),
                  h('div', { style: box(120, 80) }),
                  h('div', { style: box(50, 30) })
                ])
            }
          })
        )
        const [first, same, other] = wrapper.element.children

        expect(onResize).toHaveBeenCalledExactlyOnceWith(sizeOf(first))

        // another element gets reported even with the same box
        target.value = same
        expect(onResize).toHaveBeenCalledTimes(2)
        expect(onResize).toHaveBeenLastCalledWith(sizeOf(same))

        target.value = other
        expect(onResize).toHaveBeenCalledTimes(3)
        expect(onResize).toHaveBeenLastCalledWith({ width: 50, height: 30 })

        // the old element is not watched anymore
        first.style.width = '300px'
        other.style.width = '60px'
        await vi.waitFor(() => {
          expect(onResize).toHaveBeenCalledTimes(4)
        })
        expect(onResize).toHaveBeenLastCalledWith({ width: 60, height: 30 })
      })

      test('picks up a target that appears later', async () => {
        const show = ref(false)
        let target
        let result
        mount(
          defineComponent({
            setup() {
              target = ref(null)
              result = useElementResize({ target })
              return () =>
                h('div', [
                  show.value
                    ? h('div', { ref: target, style: box(120, 80) })
                    : null
                ])
            }
          })
        )

        expect(result.width.value).toBe(0)

        show.value = true
        await nextTick()

        expect(result.width.value).toBe(120)
        expect(result.height.value).toBe(80)
      })

      test('swaps the onResize handler while running', async () => {
        const first = vi.fn()
        const second = vi.fn()
        const onResize = ref(first)
        const { el } = mountTarget(() => ({ onResize: onResize.value }))

        expect(first).toHaveBeenCalledOnce()

        onResize.value = second
        el.style.width = '150px'

        await vi.waitFor(() => {
          expect(second).toHaveBeenCalledOnce()
        })
        expect(first).toHaveBeenCalledOnce()
      })

      test('refresh() measures right away, skipping the debounce', async () => {
        const onResize = vi.fn()
        const { el, width, refresh } = mountTarget({ onResize, debounce: 100 })

        el.style.width = '150px'
        await frames(2)

        expect(width.value).toBe(120)

        refresh()

        expect(width.value).toBe(150)
        expect(onResize).toHaveBeenCalledTimes(2)

        // the pending window measurement is dropped
        await sleep(150)
        expect(onResize).toHaveBeenCalledTimes(2)
      })

      test('refresh() is a no-op without an element', () => {
        const onResize = vi.fn()
        const { refresh, stop } = mountTarget({ onResize })

        stop()
        refresh()

        expect(onResize).toHaveBeenCalledOnce()
      })

      test('stop() ends the observation for good', async () => {
        const disabled = ref(false)
        const onResize = vi.fn()
        const { el, stop } = mountTarget(() => ({
          onResize,
          disabled: disabled.value
        }))

        stop()

        el.style.width = '150px'
        disabled.value = true
        disabled.value = false

        await frames(2)

        expect(onResize).toHaveBeenCalledOnce()
      })

      test('stops observing on unmount', async () => {
        // an element outliving the component
        const el = document.createElement('div')
        el.style.cssText = box(30, 20)
        document.body.append(el)

        const onResize = vi.fn()
        const wrapper = mount(
          defineComponent({
            setup() {
              useElementResize({ target: el, onResize })
              return () => h('div')
            }
          })
        )

        expect(onResize).toHaveBeenCalledOnce()

        wrapper.unmount()

        el.style.width = '150px'
        await frames(2)

        expect(onResize).toHaveBeenCalledOnce()

        el.remove()
      })
    })
  })
})
