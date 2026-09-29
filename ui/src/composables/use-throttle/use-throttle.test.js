import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { KeepAlive, defineComponent, h } from 'vue'

import useThrottle from './use-throttle.js'

enableAutoUnmount(afterEach)

const limit = 100

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountThrottle(...args) {
  let throttleFn
  const wrapper = mount(
    defineComponent({
      setup() {
        throttleFn = useThrottle(...args)
        return () => h('div')
      }
    })
  )

  return { wrapper, throttleFn }
}

describe('[useThrottle API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { throttleFn } = mountThrottle(vi.fn())

        expect(throttleFn).toBeTypeOf('function')
        expect(throttleFn.cancel).toBeTypeOf('function')
        expect(throttleFn.flush).toBeTypeOf('function')
      })

      test('runs fn right away, then drops the calls made during the window', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit)
        const context = { throttleFn }

        context.throttleFn('a')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(fn.mock.contexts[0]).toBe(context)

        throttleFn('b')
        vi.advanceTimersByTime(limit - 1)
        throttleFn('c')
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()

        throttleFn('d')
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('returns the last result', () => {
        let n = 0
        const { throttleFn } = mountThrottle(() => ++n, limit)

        expect(throttleFn()).toBe(1)
        expect(throttleFn()).toBe(1)

        vi.advanceTimersByTime(limit)
        expect(throttleFn()).toBe(2)
      })

      test('defaults to a 250ms limit', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn)

        throttleFn()
        vi.advanceTimersByTime(249)
        throttleFn()
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        throttleFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('"trailing" runs the last call made during the window at its end', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit, true)
        const context = { throttleFn }

        throttleFn('a')
        throttleFn('b')
        context.throttleFn('c')
        vi.advanceTimersByTime(limit - 1)
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('c')
        expect(fn.mock.contexts[1]).toBe(context)

        // the trailing run opens a window of its own
        throttleFn('d')
        expect(fn).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(limit)
        expect(fn).toHaveBeenCalledTimes(3)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('throttleFn.cancel() drops the waiting call and closes the window', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit, true)

        throttleFn()
        throttleFn()
        throttleFn.cancel()
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()

        throttleFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('throttleFn.flush() runs the waiting call right away and opens a fresh window', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit, true)

        throttleFn('a')
        throttleFn('b')
        throttleFn.flush()
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('b')

        throttleFn('c')
        expect(fn).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(limit)
        expect(fn).toHaveBeenCalledTimes(3)
        expect(fn).toHaveBeenLastCalledWith('c')
      })

      test('drops the waiting call when the component gets destroyed', () => {
        const fn = vi.fn()
        const { wrapper, throttleFn } = mountThrottle(fn, limit, true)

        throttleFn()
        throttleFn()

        wrapper.unmount()
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('drops the waiting call when the component gets deactivated', async () => {
        const fn = vi.fn()
        let throttleFn
        const Child = defineComponent({
          setup() {
            throttleFn = useThrottle(fn, limit, true)
            return () => h('div')
          }
        })
        const wrapper = mount(
          defineComponent({
            props: { show: Boolean },
            setup(props) {
              return () => h(KeepAlive, props.show ? h(Child) : null)
            }
          }),
          { props: { show: true } }
        )

        throttleFn()
        throttleFn()

        await wrapper.setProps({ show: false })
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('warns outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const throttleFn = useThrottle(vi.fn(), limit)

        // the lifecycle hooks are the Vue ones; use the throttle() util
        // outside of a component instead
        expect(warn).toHaveBeenCalled()
        expect(warn.mock.calls[0][0]).toMatch(/no active component instance/)
        expect(throttleFn).toBeTypeOf('function')
      })
    })
  })
})
