import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import useInterval from './use-interval.js'

let wrapper

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()

  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('[useInterval API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('correctly registers an interval (int)', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval } = useInterval()

              registerInterval(fn, 100)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(99)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(100)

        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('correctly registers an interval (str)', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval } = useInterval()

              registerInterval(fn, '100')
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(99)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(100)

        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('removeInterval works correctly', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval, removeInterval } = useInterval()

              registerInterval(fn, 100)
              return { registerInterval, removeInterval }
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(200)
        expect(fn).toHaveBeenCalledTimes(2)

        wrapper.vm.removeInterval()
        vi.advanceTimersToNextTimer()

        expect(fn).toHaveBeenCalledTimes(2)

        wrapper.vm.registerInterval(fn, 100)
        wrapper.unmount()

        vi.advanceTimersToNextTimer()
        vi.runAllTimers()

        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('unmount stops timeout', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval } = useInterval()

              registerInterval(fn, 100)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()

        wrapper.unmount()
        wrapper = null

        vi.advanceTimersToNextTimer()
        vi.runAllTimers()

        expect(fn).not.toHaveBeenCalled()
      })

      test('can override timeout', () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval } = useInterval()
              return { registerInterval }
            }
          })
        )

        wrapper.vm.registerInterval(fn1, 100)
        vi.advanceTimersByTime(99)
        expect(fn1).not.toHaveBeenCalled()

        wrapper.vm.registerInterval(fn2, 200)
        vi.advanceTimersByTime(199)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)

        vi.advanceTimersToNextTimer()
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(2)
      })

      test('isIntervalActive tracks the running state', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const { registerInterval, removeInterval, isIntervalActive } =
                useInterval()
              return { registerInterval, removeInterval, isIntervalActive }
            }
          })
        )

        expect(wrapper.vm.isIntervalActive).toBe(false)

        wrapper.vm.registerInterval(fn, 100)
        expect(wrapper.vm.isIntervalActive).toBe(true)

        vi.advanceTimersByTime(250)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(wrapper.vm.isIntervalActive).toBe(true)

        wrapper.vm.registerInterval(fn, 100)
        expect(wrapper.vm.isIntervalActive).toBe(true)

        wrapper.vm.removeInterval()
        expect(wrapper.vm.isIntervalActive).toBe(false)

        vi.advanceTimersToNextTimer()
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('isIntervalActive resets on unmount and stays false afterwards', () => {
        const fn = vi.fn()
        let api

        wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              api = useInterval()
              api.registerInterval(fn, 100)
              return {}
            }
          })
        )

        expect(api.isIntervalActive.value).toBe(true)

        wrapper.unmount()
        wrapper = null

        expect(api.isIntervalActive.value).toBe(false)

        api.registerInterval(fn, 100)
        expect(api.isIntervalActive.value).toBe(false)

        vi.advanceTimersToNextTimer()
        vi.runAllTimers()
        expect(fn).not.toHaveBeenCalled()
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const fn = vi.fn()

        const { registerInterval, removeInterval, isIntervalActive } =
          useInterval()

        // no lifecycle hook gets registered without an instance
        expect(warn).not.toHaveBeenCalled()

        registerInterval(fn, 100)
        expect(isIntervalActive.value).toBe(true)

        vi.advanceTimersByTime(200)
        expect(fn).toHaveBeenCalledTimes(2)

        removeInterval()
        expect(isIntervalActive.value).toBe(false)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(2)
      })
    })
  })
})
