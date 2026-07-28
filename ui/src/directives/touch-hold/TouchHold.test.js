import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

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

function mountTouchHold(template, handler = vi.fn()) {
  const TestComponent = defineComponent({
    template,
    directives: { TouchHold },
    setup() {
      return { handler }
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
      const { handler, wrapper } = mountTouchHold(
        '<div v-touch-hold.mouse="handler" />'
      )

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
      const { wrapper } = mountTouchHold('<div v-touch-hold.mouse />')

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
      const { wrapper } = mountTouchHold(
        '<div v-touch-hold:25:11:13.mouse="handler" />'
      )
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
        const { wrapper } = mountTouchHold(
          '<div v-touch-hold.capture="handler" />'
        )

        expect(
          getMainEvent(wrapper.element.__qtouchhold, 'touchstart')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchHold(
          '<div v-touch-hold.mouse="handler" />'
        )

        expect(getMainEvent(wrapper.element.__qtouchhold, 'mousedown')[3]).toBe(
          'passive'
        )
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchHold(
          '<div v-touch-hold.mouse.mouseCapture="handler" />'
        )

        expect(getMainEvent(wrapper.element.__qtouchhold, 'mousedown')[3]).toBe(
          'passiveCapture'
        )
      })
    })
  })
})
