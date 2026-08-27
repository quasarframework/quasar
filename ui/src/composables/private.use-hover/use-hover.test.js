import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import useHover, { useHoverProps } from './use-hover.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.useRealTimers()
})

function mountHover({ props = {}, options = {} } = {}) {
  const callbacks = {
    canShow: vi.fn(() => true),
    show: vi.fn(),
    canHide: vi.fn(() => true),
    hide: vi.fn(),
    ...options
  }
  let controls

  wrapper = mount(
    defineComponent({
      props: { ...useHoverProps },

      setup(componentProps) {
        controls = useHover({ props: componentProps, ...callbacks })
        return () => h('div')
      }
    }),
    { props: { hover: true, ...props } }
  )

  return { controls, ...callbacks }
}

const mouseEvt = { pointerType: 'mouse' }
const touchEvt = { pointerType: 'touch' }

describe('[useHover API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useHoverProps]', () => {
      test('is defined correctly', () => {
        expect(useHoverProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('shows on pointer enter, hides on leave after the grace period', () => {
        vi.useFakeTimers()

        const { controls, show, hide } = mountHover()

        controls.hoverShow(mouseEvt)
        expect(show).toHaveBeenCalledExactlyOnceWith(mouseEvt)

        controls.hoverHide(mouseEvt)
        expect(hide).not.toHaveBeenCalled()

        // hover-hide-delay defaults to 150ms
        vi.advanceTimersByTime(149)
        expect(hide).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(hide).toHaveBeenCalledExactlyOnceWith(mouseEvt)
      })

      test('stays inert without the hover prop and for touch pointers', () => {
        vi.useFakeTimers()

        const { controls, show, hide } = mountHover({
          props: { hover: false }
        })

        controls.hoverShow(mouseEvt)
        controls.hoverHide(mouseEvt)
        vi.runAllTimers()

        expect(show).not.toHaveBeenCalled()
        expect(hide).not.toHaveBeenCalled()

        const withHover = mountHover()

        withHover.controls.hoverShow(touchEvt)
        withHover.controls.hoverHide(touchEvt)
        vi.runAllTimers()

        expect(withHover.show).not.toHaveBeenCalled()
        expect(withHover.hide).not.toHaveBeenCalled()
      })

      test('postpones the show by hover-delay and a leave cancels it', () => {
        vi.useFakeTimers()

        const { controls, show, canHide } = mountHover({
          props: { hoverDelay: 300 },
          // the component-side gate rejects the hide of a not-yet-shown
          // popup, like every consumer's does
          options: { canHide: vi.fn(() => false) }
        })

        controls.hoverShow(mouseEvt)
        vi.advanceTimersByTime(299)
        expect(show).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(show).toHaveBeenCalledExactlyOnceWith(mouseEvt)

        // a pending (delayed) show dies when the pointer leaves
        show.mockClear()
        controls.hoverShow(mouseEvt)
        vi.advanceTimersByTime(299)
        controls.hoverHide(mouseEvt)
        expect(canHide).toHaveBeenCalledWith(mouseEvt)
        vi.runAllTimers()

        expect(show).not.toHaveBeenCalled()
      })

      test('consults the canShow and canHide gates', () => {
        vi.useFakeTimers()

        const { controls, canShow, show, canHide, hide } = mountHover({
          options: {
            canShow: vi.fn(() => false),
            canHide: vi.fn(() => false)
          }
        })

        controls.hoverShow(mouseEvt)
        expect(canShow).toHaveBeenCalledExactlyOnceWith(mouseEvt)
        expect(show).not.toHaveBeenCalled()

        controls.hoverHide(mouseEvt)
        expect(canHide).toHaveBeenCalledExactlyOnceWith(mouseEvt)
        vi.runAllTimers()
        expect(hide).not.toHaveBeenCalled()
      })

      test('scheduleHoverHide skips the pointer guards for proxied leaves', () => {
        vi.useFakeTimers()

        // a proxied leave (a descendant popup notifying its hover
        // ancestors) must work even for an event the guards would drop
        const { controls, hide } = mountHover({ props: { hover: false } })

        controls.scheduleHoverHide(touchEvt)
        vi.runAllTimers()

        expect(hide).toHaveBeenCalledExactlyOnceWith(touchEvt)
      })

      test('re-entering the popup content or clearing cancels a pending hide', () => {
        vi.useFakeTimers()

        const { controls, hide } = mountHover()

        controls.hoverShow(mouseEvt)
        controls.hoverHide(mouseEvt)
        controls.onHoverContentEnter(mouseEvt)
        vi.runAllTimers()
        expect(hide).not.toHaveBeenCalled()

        // a touch pointerenter on the content does not cancel it
        controls.hoverHide(mouseEvt)
        controls.onHoverContentEnter(touchEvt)
        vi.runAllTimers()
        expect(hide).toHaveBeenCalledOnce()

        // clearHoverTimer cancels whatever is pending
        hide.mockClear()
        controls.hoverHide(mouseEvt)
        controls.clearHoverTimer()
        vi.runAllTimers()
        expect(hide).not.toHaveBeenCalled()
      })
    })
  })
})
