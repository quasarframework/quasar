import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, withDirectives } from 'vue'

import { getMainEvent } from 'testing/runtime/directive.js'

import { client } from '../../plugins/platform/Platform.js'
import TouchHold from './TouchHold.js'

let originalHasTouch

beforeEach(() => {
  originalHasTouch = client.has.touch
  client.has.touch = false
  vi.useFakeTimers()
})

afterEach(() => {
  client.has.touch = originalHasTouch
  document.body.classList.remove('non-selectable')
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountTouchHold(modifiers, options = {}) {
  const handler = 'handler' in options ? options.handler : vi.fn()
  const TestComponent = defineComponent({
    setup() {
      return () =>
        withDirectives(h('div'), [[TouchHold, handler, options.arg, modifiers]])
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

describe('[TouchHold API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchHold({ mouse: true })

      wrapper.element.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          button: 0,
          clientX: 10,
          clientY: 20
        })
      )
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          mouse: true,
          touch: false,
          position: {
            left: 10,
            top: 20
          },
          duration: 600
        })
      )

      wrapper.unmount()
    })

    test('as undefined', () => {
      const { wrapper } = mountTouchHold({ mouse: true }, { handler: void 0 })

      wrapper.element.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          button: 0
        })
      )

      expect(wrapper.element.__qtouchhold.handler).toBeUndefined()
      expect(wrapper.element.__qtouchhold.timer).toBeUndefined()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const { wrapper } = mountTouchHold({ mouse: true }, { arg: '25:11:13' })
      const ctx = wrapper.element.__qtouchhold

      expect(ctx.duration).toBe(25)
      expect(ctx.touchSensitivity).toBe(11)
      expect(ctx.mouseSensitivity).toBe(13)
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)capture]', () => {
      test('has effect', () => {
        client.has.touch = true
        const { wrapper } = mountTouchHold({ capture: true })

        expect(
          getMainEvent(wrapper.element.__qtouchhold, 'touchstart')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchHold({ mouse: true })

        expect(getMainEvent(wrapper.element.__qtouchhold, 'mousedown')[3]).toBe(
          'passive'
        )
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchHold({
          mouse: true,
          mouseCapture: true
        })

        expect(getMainEvent(wrapper.element.__qtouchhold, 'mousedown')[3]).toBe(
          'passiveCapture'
        )
      })
    })
  })

  describe('[Generic]', () => {
    test('suppresses text selection for touch holds only', () => {
      client.has.touch = true
      const { wrapper } = mountTouchHold({ mouse: true })

      // a held mouse button selects nothing, so nothing to suppress
      wrapper.element.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, button: 0 })
      )

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      document.dispatchEvent(new MouseEvent('mouseup'))

      // a touch hold starts native selection on ANY touch-capable
      // device, so it is suppressed right from the press
      wrapper.element.dispatchEvent(
        new TouchEvent('touchstart', {
          bubbles: true,
          touches: [new Touch({ identifier: 1, target: wrapper.element })]
        })
      )

      expect(document.body.classList.contains('non-selectable')).toBe(true)

      wrapper.element.dispatchEvent(
        new TouchEvent('touchend', { bubbles: true, touches: [] })
      )
      vi.advanceTimersByTime(50)

      expect(document.body.classList.contains('non-selectable')).toBe(false)
    })
  })
})
