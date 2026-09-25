import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, toValue } from 'vue'

import useScroll from './use-scroll.js'

enableAutoUnmount(afterEach)

const nodes = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  window.scrollTo(0, 0)
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// a real browser only accepts scrollTop/scrollLeft changes
// on an element that actually overflows
const containerStyle = 'width: 200px; height: 200px; overflow: auto;'
const contentStyle = 'width: 500px; height: 500px;'

function createContainer(id) {
  const container = document.createElement('div')
  if (id !== void 0) container.id = id
  // the class is what the auto detection looks for
  container.className = 'scroll'
  container.style.cssText = containerStyle

  const content = document.createElement('div')
  content.style.cssText = contentStyle
  container.append(content)

  document.body.append(container)
  nodes.push(container)
  return container
}

// the browser fires its own scroll event a frame later; dispatching one
// right away keeps the tests synchronous, and the composable ignores the
// late duplicate since the position is unchanged by then
function scrollTo(container, top, left = container.scrollLeft) {
  container.scrollTop = top
  container.scrollLeft = left
  container.dispatchEvent(new Event('scroll'))
}

// mounts a component tracking a container through `scrollTarget`;
// `options` (object, ref or getter) is merged in through a getter
function mountTracker(options, container = createContainer()) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useScroll(() => ({
          scrollTarget: container,
          debounce: 0,
          ...toValue(options)
        }))
        return () => h('div')
      }
    })
  )

  return { wrapper, container, ...result }
}

function frame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

function details(
  position,
  direction,
  directionChanged,
  delta,
  inflectionPoint
) {
  return { position, direction, directionChanged, delta, inflectionPoint }
}

describe('[useScroll API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const {
          scrollPosition,
          scrollDirection,
          scrollDirectionChanged,
          scrollDelta,
          scrollInflectionPoint,
          refreshScroll,
          stopScroll
        } = mountTracker()

        expect(scrollPosition.value).toStrictEqual({ top: 0, left: 0 })
        expect(scrollDirection.value).toBe('down')
        expect(scrollDirectionChanged.value).toBe(false)
        expect(scrollDelta.value).toStrictEqual({ top: 0, left: 0 })
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 0, left: 0 })
        expect(refreshScroll).toBeTypeOf('function')
        expect(stopScroll).toBeTypeOf('function')
      })

      test('can be used in a Vue Component', () => {
        // no options: the closest scrollable parent of the root element
        const container = createContainer()
        const onScroll = vi.fn()
        let result

        mount(
          defineComponent({
            setup() {
              result = useScroll({ debounce: 0, onScroll })
              return () => h('div', { style: contentStyle })
            }
          }),
          { attachTo: container }
        )

        scrollTo(container, 20)

        expect(onScroll).toHaveBeenCalledOnce()
        expect(result.scrollPosition.value).toStrictEqual({ top: 20, left: 0 })
      })

      test('falls back to the window without a scrollable parent', () => {
        const filler = document.createElement('div')
        filler.style.cssText = 'height: 5000px'
        document.body.append(filler)
        nodes.push(filler)

        const addEventListener = vi.spyOn(window, 'addEventListener')
        let result

        mount(
          defineComponent({
            setup() {
              result = useScroll({ debounce: 0 })
              return () => h('div')
            }
          }),
          { attachTo: document.body }
        )

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )

        window.scrollTo(0, 30)
        window.dispatchEvent(new Event('scroll'))

        expect(result.scrollPosition.value.top).toBe(30)
      })

      test('accepts a plain options object', () => {
        const container = createContainer()
        let result

        mount(
          defineComponent({
            setup() {
              result = useScroll({ scrollTarget: container, debounce: 0 })
              return () => h('div')
            }
          })
        )

        scrollTo(container, 20)

        expect(result.scrollPosition.value).toStrictEqual({ top: 20, left: 0 })
      })

      test('works outside of a component instance', () => {
        const container = createContainer()
        const { scrollPosition, stopScroll } = useScroll({
          scrollTarget: container,
          debounce: 0
        })

        scrollTo(container, 20)

        expect(scrollPosition.value).toStrictEqual({ top: 20, left: 0 })

        stopScroll()
      })

      test('accepts a scrollTarget CSS selector', () => {
        const container = createContainer('use-scroll-target')
        const { scrollPosition } = mountTracker({
          scrollTarget: '#use-scroll-target'
        })

        scrollTo(container, 20)

        expect(scrollPosition.value.top).toBe(20)
      })

      test('accepts a scrollTarget component instance', () => {
        // the instance stands for its root element, the scroll container
        const holder = mount(
          {
            // closed, as a script setup component is: its ref is the expose proxy
            setup(_, { expose }) {
              expose({})
              return () =>
                h('div', { style: containerStyle }, [
                  h('div', { style: contentStyle })
                ])
            }
          },
          { attachTo: document.body }
        )
        const { scrollPosition } = mountTracker({ scrollTarget: holder.vm })

        scrollTo(holder.element, 20)

        expect(scrollPosition.value.top).toBe(20)
      })

      test('accepts the window as scrollTarget', () => {
        const addEventListener = vi.spyOn(window, 'addEventListener')

        mountTracker({ scrollTarget: window })

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })

      test('starts the auto detection from the target', () => {
        const container = createContainer()
        const onScroll = vi.fn()
        let target

        // a fragment root has no root element to start from
        mount(
          defineComponent({
            setup() {
              target = ref(null)
              useScroll({ target, debounce: 0, onScroll })
              return () => [
                h('div'),
                h('div', { ref: target, style: contentStyle })
              ]
            }
          }),
          { attachTo: container }
        )

        scrollTo(container, 20)

        expect(onScroll).toHaveBeenCalledOnce()
      })

      test('does not listen without a container', () => {
        const onScroll = vi.fn()
        let result

        mount(
          defineComponent({
            setup() {
              result = useScroll({ target: null, debounce: 0, onScroll })
              return () => h('div')
            }
          })
        )

        result.refreshScroll()

        expect(onScroll).not.toHaveBeenCalled()
      })

      test('reports the initial position when already scrolled', () => {
        const container = createContainer()
        container.scrollTop = 20

        const onScroll = vi.fn()
        const { scrollPosition } = mountTracker({ onScroll }, container)

        expect(scrollPosition.value.top).toBe(20)
        expect(onScroll).toHaveBeenCalledExactlyOnceWith(
          details(
            { top: 20, left: 0 },
            'down',
            false,
            { top: 20, left: 0 },
            { top: 0, left: 0 }
          )
        )
      })

      test('reports nothing for an unscrolled container', () => {
        const onScroll = vi.fn()
        mountTracker({ onScroll })

        expect(onScroll).not.toHaveBeenCalled()
      })

      test('follows the scroll position, direction and delta', () => {
        const onScroll = vi.fn()
        const {
          container,
          scrollPosition,
          scrollDirection,
          scrollDirectionChanged,
          scrollDelta,
          scrollInflectionPoint
        } = mountTracker({ onScroll, axis: 'both' })

        scrollTo(container, 20, 10)

        expect(scrollPosition.value).toStrictEqual({ top: 20, left: 10 })
        expect(scrollDirection.value).toBe('down')
        expect(scrollDirectionChanged.value).toBe(false)
        expect(scrollDelta.value).toStrictEqual({ top: 20, left: 10 })
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 0, left: 0 })
        expect(onScroll).toHaveBeenLastCalledWith(
          details(
            { top: 20, left: 10 },
            'down',
            false,
            { top: 20, left: 10 },
            { top: 0, left: 0 }
          )
        )

        scrollTo(container, 50)

        expect(scrollDelta.value).toStrictEqual({ top: 30, left: 0 })
        expect(scrollDirectionChanged.value).toBe(false)

        // reversing: the direction changes and the inflection point is set
        scrollTo(container, 35)

        expect(scrollDirection.value).toBe('up')
        expect(scrollDirectionChanged.value).toBe(true)
        expect(scrollDelta.value).toStrictEqual({ top: -15, left: 0 })
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 35, left: 10 })
        expect(onScroll).toHaveBeenLastCalledWith(
          details(
            { top: 35, left: 10 },
            'up',
            true,
            { top: -15, left: 0 },
            { top: 35, left: 10 }
          )
        )

        scrollTo(container, 30)

        expect(scrollDirection.value).toBe('up')
        expect(scrollDirectionChanged.value).toBe(false)
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 35, left: 10 })

        // the larger movement wins the direction
        scrollTo(container, 31, 60)

        expect(scrollDirection.value).toBe('right')
        expect(scrollDirectionChanged.value).toBe(true)
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 31, left: 60 })

        scrollTo(container, 31, 40)

        expect(scrollDirection.value).toBe('left')
        expect(onScroll).toHaveBeenCalledTimes(6)
      })

      test('ignores the other axis', () => {
        const onScroll = vi.fn()
        const { container, scrollPosition } = mountTracker({ onScroll })

        scrollTo(container, 0, 10)
        expect(onScroll).not.toHaveBeenCalled()

        scrollTo(container, 20)
        expect(onScroll).toHaveBeenCalledOnce()
        expect(scrollPosition.value).toStrictEqual({ top: 20, left: 10 })

        const horizontal = mountTracker({ onScroll, axis: 'horizontal' })

        scrollTo(horizontal.container, 20)
        expect(onScroll).toHaveBeenCalledOnce()

        scrollTo(horizontal.container, 20, 10)
        expect(onScroll).toHaveBeenCalledTimes(2)
        expect(horizontal.scrollPosition.value).toStrictEqual({
          top: 20,
          left: 10
        })
      })

      test('reports at most once per frame without a debounce', async () => {
        const onScroll = vi.fn()
        const { container, scrollPosition } = mountTracker({
          onScroll,
          debounce: void 0
        })

        scrollTo(container, 10)
        scrollTo(container, 20)
        scrollTo(container, 30)

        expect(onScroll).not.toHaveBeenCalled()
        expect(scrollPosition.value.top).toBe(0)

        await frame()

        expect(onScroll).toHaveBeenCalledOnce()
        expect(scrollPosition.value.top).toBe(30)
      })

      test('reports at most once per debounce window', () => {
        vi.useFakeTimers()
        const onScroll = vi.fn()
        const { container, scrollPosition } = mountTracker({
          onScroll,
          debounce: 100
        })

        scrollTo(container, 10)
        vi.advanceTimersByTime(50)
        scrollTo(container, 20)

        expect(onScroll).not.toHaveBeenCalled()

        vi.advanceTimersByTime(50)

        // the report at the end of the window sees the latest position
        expect(onScroll).toHaveBeenCalledOnce()
        expect(scrollPosition.value.top).toBe(20)

        vi.advanceTimersByTime(200)
        expect(onScroll).toHaveBeenCalledOnce()
      })

      test('accepts the debounce as a String', () => {
        vi.useFakeTimers()
        const onScroll = vi.fn()
        const { container } = mountTracker({ onScroll, debounce: '100' })

        scrollTo(container, 10)
        expect(onScroll).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(onScroll).toHaveBeenCalledOnce()
      })

      test('keeps the last position while disabled and catches up on resume', () => {
        const disabled = ref(false)
        const onScroll = vi.fn()
        const { container, scrollPosition } = mountTracker(() => ({
          onScroll,
          disabled: disabled.value
        }))

        scrollTo(container, 20)
        expect(onScroll).toHaveBeenCalledOnce()

        disabled.value = true
        scrollTo(container, 40)

        expect(onScroll).toHaveBeenCalledOnce()
        expect(scrollPosition.value.top).toBe(20)

        // resuming reports right away
        disabled.value = false

        expect(onScroll).toHaveBeenCalledTimes(2)
        expect(scrollPosition.value.top).toBe(40)

        // ...and listens again
        scrollTo(container, 60)
        expect(onScroll).toHaveBeenCalledTimes(3)
      })

      test('resuming an unmoved container reports nothing', () => {
        const disabled = ref(false)
        const onScroll = vi.fn()
        const { container } = mountTracker(() => ({
          onScroll,
          disabled: disabled.value
        }))

        scrollTo(container, 20)
        disabled.value = true
        disabled.value = false

        expect(onScroll).toHaveBeenCalledOnce()
      })

      test('follows a scrollTarget ref pointing to another container', () => {
        const first = createContainer()
        const second = createContainer()
        const scrollTarget = ref(first)
        const onScroll = vi.fn()
        const { scrollPosition } = mountTracker(() => ({
          onScroll,
          scrollTarget: scrollTarget.value
        }))

        scrollTo(first, 20)
        expect(scrollPosition.value.top).toBe(20)

        // another container starts from scratch
        scrollTarget.value = second
        expect(scrollPosition.value.top).toBe(0)
        expect(onScroll).toHaveBeenCalledOnce()

        // the old container is not tracked anymore
        scrollTo(first, 40)
        expect(onScroll).toHaveBeenCalledOnce()

        scrollTo(second, 10)
        expect(onScroll).toHaveBeenCalledTimes(2)
        expect(onScroll).toHaveBeenLastCalledWith(
          details(
            { top: 10, left: 0 },
            'down',
            false,
            { top: 10, left: 0 },
            { top: 0, left: 0 }
          )
        )
      })

      test('another container resets the direction, delta and inflection point', () => {
        const first = createContainer()
        const second = createContainer()
        const scrollTarget = ref(first)
        const {
          scrollPosition,
          scrollDirection,
          scrollDirectionChanged,
          scrollDelta,
          scrollInflectionPoint
        } = mountTracker(() => ({ scrollTarget: scrollTarget.value }))

        scrollTo(first, 40)
        scrollTo(first, 30)
        expect(scrollDirection.value).toBe('up')
        expect(scrollDirectionChanged.value).toBe(true)
        expect(scrollDelta.value).toStrictEqual({ top: -10, left: 0 })
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 30, left: 0 })

        scrollTarget.value = second
        expect(scrollPosition.value).toStrictEqual({ top: 0, left: 0 })
        expect(scrollDirection.value).toBe('down')
        expect(scrollDirectionChanged.value).toBe(false)
        expect(scrollDelta.value).toStrictEqual({ top: 0, left: 0 })
        expect(scrollInflectionPoint.value).toStrictEqual({ top: 0, left: 0 })
      })

      test('picks up a target that appears later', async () => {
        const container = createContainer()
        const show = ref(false)
        const onScroll = vi.fn()
        let target

        mount(
          defineComponent({
            setup() {
              target = ref(null)
              useScroll({ target, debounce: 0, onScroll })
              return () => [
                h('div'),
                show.value
                  ? h('div', { ref: target, style: contentStyle })
                  : null
              ]
            }
          }),
          { attachTo: container }
        )

        scrollTo(container, 20)
        expect(onScroll).not.toHaveBeenCalled()

        show.value = true
        await nextTick()

        // the container is picked up along with its current position
        expect(onScroll).toHaveBeenCalledOnce()
        expect(onScroll).toHaveBeenLastCalledWith(
          expect.objectContaining({ position: { top: 20, left: 0 } })
        )
      })

      test('swaps the onScroll handler while running', () => {
        const first = vi.fn()
        const second = vi.fn()
        const onScroll = ref(first)
        const { container } = mountTracker(() => ({ onScroll: onScroll.value }))

        scrollTo(container, 20)
        expect(first).toHaveBeenCalledOnce()

        onScroll.value = second
        scrollTo(container, 40)

        expect(first).toHaveBeenCalledOnce()
        expect(second).toHaveBeenCalledOnce()
      })

      test('re-reads the position when the language direction flips', () => {
        const onScroll = vi.fn()
        const { wrapper, container } = mountTracker({
          onScroll,
          axis: 'horizontal'
        })

        scrollTo(container, 0, 10)
        expect(onScroll).toHaveBeenCalledOnce()

        // the horizontal position is mirrored in RTL
        wrapper.vm.$q.lang.rtl = true
        container.dir = 'rtl'
        container.scrollLeft = -20

        wrapper.vm.$q.lang.rtl = false

        expect(onScroll).toHaveBeenCalledTimes(2)
        expect(onScroll).toHaveBeenLastCalledWith(
          expect.objectContaining({ position: { top: 0, left: -20 } })
        )
      })

      test('refreshScroll() reads the position right away, skipping the debounce', () => {
        vi.useFakeTimers()
        const onScroll = vi.fn()
        const { container, scrollPosition, refreshScroll } = mountTracker({
          onScroll,
          debounce: 100
        })

        scrollTo(container, 20)
        expect(scrollPosition.value.top).toBe(0)

        refreshScroll()

        expect(scrollPosition.value.top).toBe(20)
        expect(onScroll).toHaveBeenCalledOnce()

        // the pending window report is dropped
        vi.advanceTimersByTime(200)
        expect(onScroll).toHaveBeenCalledOnce()
      })

      test('refreshScroll() is a no-op without a container', () => {
        const onScroll = vi.fn()
        const { container, refreshScroll, stopScroll } = mountTracker({
          onScroll
        })

        stopScroll()
        container.scrollTop = 20
        refreshScroll()

        expect(onScroll).not.toHaveBeenCalled()
      })

      test('stopScroll() ends the tracking for good', () => {
        const disabled = ref(false)
        const onScroll = vi.fn()
        const { container, stopScroll } = mountTracker(() => ({
          onScroll,
          disabled: disabled.value
        }))

        stopScroll()

        scrollTo(container, 20)
        disabled.value = true
        disabled.value = false

        expect(onScroll).not.toHaveBeenCalled()
      })

      test('stops listening on unmount', () => {
        const container = createContainer()
        const removeEventListener = vi.spyOn(container, 'removeEventListener')
        const onScroll = vi.fn()
        const { wrapper } = mountTracker({ onScroll }, container)

        wrapper.unmount()

        expect(removeEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )

        scrollTo(container, 20)
        expect(onScroll).not.toHaveBeenCalled()
      })
    })
  })
})
