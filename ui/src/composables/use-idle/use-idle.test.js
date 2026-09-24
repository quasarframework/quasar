import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, ref } from 'vue'

import useIdle from './use-idle.js'

enableAutoUnmount(afterEach)

const timeout = 1000
const defaultTimeout = 60_000

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountIdle(options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useIdle(options)
        return () => h('div', [h('button', 'target')])
      }
    })
  )

  return { wrapper, el: wrapper.element.firstElementChild, ...result }
}

function activity(type = 'mousemove', target = document.body) {
  target.dispatchEvent(new Event(type, { bubbles: true }))
}

describe('[useIdle API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { isIdle, lastActive, resetIdle, stop } = mountIdle()

        expect(isRef(isIdle)).toBe(true)
        expect(isIdle.value).toBe(false)
        expect(isRef(lastActive)).toBe(true)
        expect(lastActive.value).toBe(Date.now())
        expect(resetIdle).toBeTypeOf('function')
        expect(stop).toBeTypeOf('function')
      })

      test('becomes idle once the timeout elapses', () => {
        const { isIdle } = mountIdle({ timeout })

        vi.advanceTimersByTime(timeout - 1)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('defaults to one minute of inactivity', () => {
        const { isIdle } = mountIdle()

        vi.advanceTimersByTime(defaultTimeout - 1)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('an activity postpones the idle state for a full timeout', () => {
        const { isIdle } = mountIdle({ timeout })

        vi.advanceTimersByTime(600)
        activity()

        vi.advanceTimersByTime(timeout - 1)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('an activity ends the idle state', () => {
        const { isIdle } = mountIdle({ timeout })

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        activity()
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)
      })

      test('keeps a single timer no matter how many activities happen', () => {
        mountIdle({ timeout })

        for (let i = 0; i < 100; i++) {
          vi.advanceTimersByTime(1)
          activity()
        }

        expect(vi.getTimerCount()).toBe(1)
      })

      test('updates lastActive on every activity', () => {
        const { lastActive } = mountIdle({ timeout })
        const start = Date.now()

        vi.advanceTimersByTime(100)
        activity()
        expect(lastActive.value).toBe(start + 100)

        vi.advanceTimersByTime(100)
        activity('keydown')
        expect(lastActive.value).toBe(start + 200)
      })

      test('counts the default events as activities', () => {
        const { isIdle } = mountIdle({ timeout })

        ;['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(
          type => {
            vi.advanceTimersByTime(timeout)
            expect(isIdle.value).toBe(true)

            activity(type)
            expect(isIdle.value).toBe(false)
          }
        )
      })

      test('ignores other events', () => {
        const { isIdle } = mountIdle({ timeout })

        vi.advanceTimersByTime(timeout)
        activity('click')

        expect(isIdle.value).toBe(true)
      })

      test('counts an activity whose propagation got stopped', () => {
        const { isIdle, el } = mountIdle({ timeout })
        el.addEventListener('mousemove', evt => {
          evt.stopPropagation()
        })

        vi.advanceTimersByTime(timeout)
        activity('mousemove', el)

        expect(isIdle.value).toBe(false)
      })

      test('listens to the "events" option instead of the default ones', () => {
        const { isIdle } = mountIdle({ timeout, events: ['click'] })

        vi.advanceTimersByTime(timeout)
        activity('mousemove')
        expect(isIdle.value).toBe(true)

        activity('click')
        expect(isIdle.value).toBe(false)
      })

      test('never reports idle while "disabled"', () => {
        const { isIdle } = mountIdle({ timeout, disabled: true })

        vi.advanceTimersByTime(timeout * 2)

        expect(isIdle.value).toBe(false)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('pauses and restarts with the "disabled" option', () => {
        const options = ref({ timeout })
        const { isIdle, lastActive } = mountIdle(options)

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        options.value = { timeout, disabled: true }
        expect(isIdle.value).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        const pausedAt = lastActive.value
        vi.advanceTimersByTime(timeout)
        activity()
        expect(lastActive.value).toBe(pausedAt)

        // re-enabling counts as an activity
        options.value = { timeout }
        expect(lastActive.value).toBe(Date.now())

        vi.advanceTimersByTime(timeout - 1)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('follows a "timeout" change', () => {
        const options = ref({ timeout })
        const { isIdle } = mountIdle(options)

        vi.advanceTimersByTime(500)

        // shorter than the time already elapsed: idle right away
        options.value = { timeout: 400 }
        expect(isIdle.value).toBe(true)

        // longer: active again, for the remainder
        options.value = { timeout: 800 }
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(299)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('accepts the options as a getter', () => {
        const ms = ref(timeout)
        const { isIdle } = mountIdle(() => ({ timeout: ms.value }))

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        ms.value = timeout * 2
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)
      })

      test('resetIdle() counts as an activity', () => {
        const { isIdle, lastActive, resetIdle } = mountIdle({ timeout })

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        resetIdle()
        expect(isIdle.value).toBe(false)
        expect(lastActive.value).toBe(Date.now())

        vi.advanceTimersByTime(timeout - 1)
        expect(isIdle.value).toBe(false)

        vi.advanceTimersByTime(1)
        expect(isIdle.value).toBe(true)
      })

      test('resetIdle() does nothing while "disabled"', () => {
        const { lastActive, resetIdle } = mountIdle({ timeout, disabled: true })

        vi.advanceTimersByTime(100)
        resetIdle()

        expect(lastActive.value).toBe(0)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('stop() ends the tracking for good', () => {
        const { isIdle, lastActive, stop } = mountIdle({ timeout })

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        stop()
        expect(isIdle.value).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        const stoppedAt = lastActive.value
        vi.advanceTimersByTime(timeout)
        activity()

        expect(isIdle.value).toBe(false)
        expect(lastActive.value).toBe(stoppedAt)
      })

      test('clears its timer when the component gets destroyed', () => {
        const { wrapper } = mountIdle({ timeout })

        expect(vi.getTimerCount()).toBe(1)

        wrapper.unmount()

        expect(vi.getTimerCount()).toBe(0)
      })

      test('settles the state as soon as the page becomes visible', () => {
        const { isIdle } = mountIdle({ timeout })

        // a throttled timer did not fire yet, but the time has passed
        vi.setSystemTime(Date.now() + timeout)
        expect(isIdle.value).toBe(false)

        document.dispatchEvent(new Event('visibilitychange'))

        expect(isIdle.value).toBe(true)
      })

      test('calls "onIdle" on every transition only', () => {
        const onIdle = vi.fn()
        const options = ref({ timeout, onIdle })
        mountIdle(options)

        // the initial active state is not a transition
        expect(onIdle).not.toHaveBeenCalled()

        vi.advanceTimersByTime(timeout)
        expect(onIdle).toHaveBeenCalledOnce()
        expect(onIdle).toHaveBeenLastCalledWith(true)

        // a re-evaluation that keeps the state is not a transition
        options.value = { timeout: timeout / 2, onIdle }
        expect(onIdle).toHaveBeenCalledOnce()

        activity()
        expect(onIdle).toHaveBeenCalledTimes(2)
        expect(onIdle).toHaveBeenLastCalledWith(false)

        vi.advanceTimersByTime(timeout / 2)
        expect(onIdle).toHaveBeenCalledTimes(3)
        expect(onIdle).toHaveBeenLastCalledWith(true)

        // pausing while idle ends the idle state
        options.value = { timeout, onIdle, disabled: true }
        expect(onIdle).toHaveBeenCalledTimes(4)
        expect(onIdle).toHaveBeenLastCalledWith(false)
      })

      test('follows an "onIdle" change', () => {
        const first = vi.fn()
        const second = vi.fn()
        const options = ref({ timeout, onIdle: first })
        mountIdle(options)

        options.value = { timeout, onIdle: second }
        vi.advanceTimersByTime(timeout)

        expect(first).not.toHaveBeenCalled()
        expect(second).toHaveBeenCalledExactlyOnceWith(true)
      })

      test('works outside of a component instance', () => {
        const { isIdle, stop } = useIdle({ timeout })

        vi.advanceTimersByTime(timeout)
        expect(isIdle.value).toBe(true)

        activity()
        expect(isIdle.value).toBe(false)

        stop()
        expect(vi.getTimerCount()).toBe(0)
      })
    })
  })
})
