import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

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
            template: '<div />',
            setup () {
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
            template: '<div />',
            setup () {
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
            template: '<div />',
            setup () {
              const {
                registerInterval,
                removeInterval
              } = useInterval()

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
            template: '<div />',
            setup () {
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
            template: '<div />',
            setup () {
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
    })
  })
})
