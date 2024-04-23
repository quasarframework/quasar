import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useTimeout from './use-timeout.js'

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

describe('[useTimeout API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('correctly registers a timeout (int)', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTimeout } = useTimeout()

              registerTimeout(fn, 100)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(99)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('correctly registers a timeout (str)', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTimeout } = useTimeout()

              registerTimeout(fn, '100')
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(99)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('removeTimeout works correctly', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const {
                registerTimeout,
                removeTimeout
              } = useTimeout()

              registerTimeout(fn, 100)
              return { registerTimeout, removeTimeout }
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(200)
        expect(fn).toHaveBeenCalledTimes(1)

        wrapper.vm.removeTimeout()
        vi.runAllTimers()

        expect(fn).toHaveBeenCalledTimes(1)

        wrapper.vm.registerTimeout(fn, 100)
        wrapper.unmount()

        vi.runAllTimers()

        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('unmount stops timeout', () => {
        const fn = vi.fn()

        wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { registerTimeout } = useTimeout()

              registerTimeout(fn, 100)
              return {}
            }
          })
        )

        expect(fn).not.toHaveBeenCalled()

        wrapper.unmount()
        wrapper = null

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
              const { registerTimeout } = useTimeout()
              return { registerTimeout }
            }
          })
        )

        wrapper.vm.registerTimeout(fn1, 100)
        vi.advanceTimersByTime(99)
        expect(fn1).not.toHaveBeenCalled()

        wrapper.vm.registerTimeout(fn2, 200)
        vi.advanceTimersByTime(199)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)

        vi.runAllTimers()
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)
      })
    })
  })
})
