import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { KeepAlive, computed, defineComponent, h, nextTick, watch } from 'vue'

import useDebounce from './use-debounce.js'

enableAutoUnmount(afterEach)

const wait = 100

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function mountDebounce(...args) {
  let debounceFn
  const wrapper = mount(
    defineComponent({
      setup() {
        debounceFn = useDebounce(...args)
        return () => h('div', debounceFn.isPending ? 'pending' : 'idle')
      }
    })
  )

  return { wrapper, debounceFn }
}

describe('[useDebounce API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { debounceFn } = mountDebounce(vi.fn())

        expect(debounceFn).toBeTypeOf('function')
        expect(debounceFn.cancel).toBeTypeOf('function')
        expect(debounceFn.flush).toBeTypeOf('function')
        expect(debounceFn.isPending).toBe(false)
      })

      test('runs fn once the wait elapses after the last call', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        vi.advanceTimersByTime(wait - 1)
        expect(fn).not.toHaveBeenCalled()

        debounceFn()
        vi.advanceTimersByTime(wait - 1)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('defaults to a 250ms wait', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn)

        debounceFn()
        vi.advanceTimersByTime(249)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()
      })

      test('passes the last call arguments and "this" to fn', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)
        const context = { debounceFn }

        debounceFn('first', 1)
        context.debounceFn('last', 2)
        vi.advanceTimersByTime(wait)

        expect(fn).toHaveBeenCalledExactlyOnceWith('last', 2)
        expect(fn.mock.contexts[0]).toBe(context)
      })

      test('debounceFn.cancel() drops the waiting call', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        debounceFn.cancel()
        vi.runAllTimers()

        expect(fn).not.toHaveBeenCalled()
        expect(vi.getTimerCount()).toBe(0)
      })

      test('debounceFn.flush() runs the waiting call right away', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn('a')
        debounceFn.flush()

        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(vi.getTimerCount()).toBe(0)

        debounceFn.flush()
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('isPending is true while a call to fn is waiting', () => {
        let pendingWhenRun = null
        const fn = vi.fn(() => {
          pendingWhenRun = debounceFn.isPending
        })
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        expect(debounceFn.isPending).toBe(true)

        vi.advanceTimersByTime(wait - 1)
        expect(debounceFn.isPending).toBe(true)

        vi.advanceTimersByTime(1)
        expect(pendingWhenRun).toBe(false)
        expect(debounceFn.isPending).toBe(false)

        debounceFn()
        debounceFn.cancel()
        expect(debounceFn.isPending).toBe(false)

        debounceFn()
        debounceFn.flush()
        expect(debounceFn.isPending).toBe(false)
      })

      test('isPending is reactive: render, watch and computed track it', async () => {
        const { wrapper, debounceFn } = mountDebounce(vi.fn(), wait)
        const seen = []
        watch(
          () => debounceFn.isPending,
          value => seen.push(value)
        )
        const pendingRef = computed(() => debounceFn.isPending)

        expect(wrapper.text()).toBe('idle')
        expect(pendingRef.value).toBe(false)

        debounceFn()
        await nextTick()
        expect(wrapper.text()).toBe('pending')
        expect(pendingRef.value).toBe(true)

        vi.advanceTimersByTime(wait)
        await nextTick()
        expect(wrapper.text()).toBe('idle')
        expect(pendingRef.value).toBe(false)
        expect(seen).toEqual([true, false])
      })

      test('isPending stays true when fn calls debounceFn again', () => {
        let runs = 0
        const { debounceFn } = mountDebounce(() => {
          if (runs++ < 2) {
            debounceFn()
          }
        }, wait)

        debounceFn()
        vi.advanceTimersByTime(wait)
        expect(runs).toBe(1)
        expect(debounceFn.isPending).toBe(true)

        vi.advanceTimersByTime(wait)
        expect(runs).toBe(2)
        expect(debounceFn.isPending).toBe(true)

        vi.advanceTimersByTime(wait)
        expect(runs).toBe(3)
        expect(debounceFn.isPending).toBe(false)
      })

      test('"true" runs fn on the first call and swallows the rest', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, true)
        const context = { debounceFn }

        context.debounceFn('a')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(fn.mock.contexts[0]).toBe(context)

        debounceFn('b')
        vi.advanceTimersByTime(wait - 1)
        debounceFn('c')
        vi.advanceTimersByTime(wait - 1)
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()

        debounceFn('d')
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('"true" never has a call waiting', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, true)

        debounceFn()
        debounceFn()
        expect(debounceFn.isPending).toBe(false)

        // nothing to flush, the wait period keeps running
        debounceFn.flush()
        debounceFn()
        expect(fn).toHaveBeenCalledOnce()

        // debounceFn.cancel() ends the wait period
        debounceFn.cancel()
        debounceFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('{ leading: true } runs on both edges; a call waits only after the leading one', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, { leading: true })

        debounceFn('a')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(debounceFn.isPending).toBe(false)

        debounceFn('b')
        expect(debounceFn.isPending).toBe(true)

        vi.advanceTimersByTime(wait)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('b')
        expect(debounceFn.isPending).toBe(false)
      })

      test('{ leading: true, trailing: false } is the "true" mode', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, {
          leading: true,
          trailing: false
        })

        debounceFn('a')
        debounceFn('b')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(debounceFn.isPending).toBe(false)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('maxWait runs fn while the calls keep coming', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, { maxWait: 2 * wait })

        for (let i = 1; i <= 4; i++) {
          debounceFn(i)
          expect(debounceFn.isPending).toBe(true)
          vi.advanceTimersByTime(wait / 2)
        }

        expect(fn).toHaveBeenCalledExactlyOnceWith(4)
        expect(debounceFn.isPending).toBe(false)

        debounceFn(5)
        expect(debounceFn.isPending).toBe(true)
        vi.advanceTimersByTime(wait)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith(5)
        expect(debounceFn.isPending).toBe(false)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('drops the waiting call when the component gets destroyed', () => {
        const fn = vi.fn()
        const { wrapper, debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        expect(debounceFn.isPending).toBe(true)

        wrapper.unmount()
        expect(debounceFn.isPending).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).not.toHaveBeenCalled()
      })

      test('drops the waiting call when the component gets deactivated', async () => {
        const fn = vi.fn()
        let debounceFn
        const Child = defineComponent({
          setup() {
            debounceFn = useDebounce(fn, wait)
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

        debounceFn()
        expect(debounceFn.isPending).toBe(true)

        await wrapper.setProps({ show: false })
        expect(debounceFn.isPending).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).not.toHaveBeenCalled()
      })

      test('warns outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const debounceFn = useDebounce(vi.fn(), wait)

        // the lifecycle hooks are the Vue ones; use the debounce() util
        // outside of a component instead
        expect(warn).toHaveBeenCalled()
        expect(warn.mock.calls[0][0]).toMatch(/no active component instance/)
        expect(debounceFn).toBeTypeOf('function')
      })
    })
  })
})
