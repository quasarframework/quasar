import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

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
        withDirectives(h('div', [h('span')]), [
          [TouchHold, handler, options.arg, modifiers]
        ])
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function mouseDown(el, opts) {
  el.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, button: 0, ...opts })
  )
}

function touch(el, type, identifier = 1) {
  el.dispatchEvent(
    new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches:
        type === 'touchend' ? [] : [new Touch({ identifier, target: el })]
    })
  )
}

// a child that keeps the press to itself: only a capture-phase
// listener on the element still sees it
function stopAtChild(wrapper, type) {
  wrapper.get('span').element.addEventListener(type, evt => {
    evt.stopPropagation()
  })
}

describe('[TouchHold API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchHold({ mouse: true })

      mouseDown(wrapper.element, { clientX: 10, clientY: 20 })
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

      mouseDown(wrapper.element)

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
        const bubble = mountTouchHold({})
        const capture = mountTouchHold({ capture: true })

        stopAtChild(bubble.wrapper, 'touchstart')
        stopAtChild(capture.wrapper, 'touchstart')

        touch(bubble.wrapper.get('span').element, 'touchstart')
        touch(capture.wrapper.get('span').element, 'touchstart')
        vi.advanceTimersByTime(600)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        client.has.touch = true
        const touchOnly = mountTouchHold({})
        const withMouse = mountTouchHold({ mouse: true })

        mouseDown(touchOnly.wrapper.element)
        mouseDown(withMouse.wrapper.element)
        vi.advanceTimersByTime(600)

        expect(touchOnly.handler).not.toHaveBeenCalled()
        expect(withMouse.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const bubble = mountTouchHold({ mouse: true })
        const capture = mountTouchHold({ mouse: true, mouseCapture: true })

        stopAtChild(bubble.wrapper, 'mousedown')
        stopAtChild(capture.wrapper, 'mousedown')

        mouseDown(bubble.wrapper.get('span').element)
        mouseDown(capture.wrapper.get('span').element)
        vi.advanceTimersByTime(600)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Generic]', () => {
    test('suppresses text selection for touch holds only', () => {
      client.has.touch = true
      const { wrapper } = mountTouchHold({ mouse: true })

      // a held mouse button selects nothing, so nothing to suppress
      mouseDown(wrapper.element)

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      document.dispatchEvent(new MouseEvent('click'))

      // a touch hold starts native selection on ANY touch-capable
      // device, so it is suppressed right from the press
      touch(wrapper.element, 'touchstart')

      expect(document.body.classList.contains('non-selectable')).toBe(true)

      touch(wrapper.element, 'touchend')
      vi.advanceTimersByTime(50)

      expect(document.body.classList.contains('non-selectable')).toBe(false)
    })

    test('cancels the hold once the press moves past the sensitivity', () => {
      const { handler, wrapper } = mountTouchHold({ mouse: true })

      mouseDown(wrapper.element, { clientX: 10, clientY: 10 })
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 17, clientY: 10 })
      )
      vi.advanceTimersByTime(600)

      expect(handler).not.toHaveBeenCalled()

      // the release still ends the press, so the next one is tracked
      document.dispatchEvent(new MouseEvent('click'))
      mouseDown(wrapper.element, { clientX: 10, clientY: 10 })
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 16, clientY: 10 })
      )
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('swallows the click that ends a triggered hold', () => {
      const { handler, wrapper } = mountTouchHold({ mouse: true })

      mouseDown(wrapper.element)
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(1)

      const click = new MouseEvent('click', { cancelable: true })
      document.dispatchEvent(click)

      expect(click.defaultPrevented).toBe(true)

      // an untriggered press leaves its click alone
      mouseDown(wrapper.element)
      const quick = new MouseEvent('click', { cancelable: true })
      document.dispatchEvent(quick)

      expect(quick.defaultPrevented).toBe(false)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('tracks one press at a time', () => {
      client.has.touch = true
      const { handler, wrapper } = mountTouchHold({})

      touch(wrapper.element, 'touchstart', 1)
      touch(wrapper.element, 'touchstart', 2)
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(1)

      touch(wrapper.element, 'touchend')
      touch(wrapper.element, 'touchstart', 3)
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(2)
    })

    test('an undefined value mid-press cancels the hold', async () => {
      const handler = vi.fn()
      const value = ref(handler)
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchHold, value.value, void 0, { mouse: true }]
            ])
        }
      })
      const wrapper = mount(TestComponent)

      mouseDown(wrapper.element)
      value.value = void 0
      await flushPromises()
      vi.advanceTimersByTime(600)

      expect(handler).not.toHaveBeenCalled()

      value.value = handler
      await flushPromises()
      mouseDown(wrapper.element)
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('follows the argument and the modifiers when they change at runtime', async () => {
      client.has.touch = true
      const handler = vi.fn()
      const arg = ref(void 0)
      const modifiers = ref({})
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchHold, handler, arg.value, modifiers.value]
            ])
        }
      })
      const wrapper = mount(TestComponent)
      const el = wrapper.element

      // no mouse modifier: a press with the mouse is not a hold
      mouseDown(el)
      vi.advanceTimersByTime(600)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { mouse: true }
      arg.value = '100'
      await flushPromises()

      mouseDown(el)
      vi.advanceTimersByTime(100)

      expect(handler).toHaveBeenCalledTimes(1)
      document.dispatchEvent(new MouseEvent('click', { cancelable: true }))

      // back to touch only: the mouse listener is gone again
      modifiers.value = {}
      await flushPromises()

      mouseDown(el)
      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(1)

      touch(el, 'touchstart')
      vi.advanceTimersByTime(100)

      expect(handler).toHaveBeenCalledTimes(2)
      touch(el, 'touchend')
    })

    test('lets go of everything on unmount', () => {
      client.has.touch = true
      const { handler, wrapper } = mountTouchHold({ mouse: true })
      const el = wrapper.element

      touch(el, 'touchstart')
      wrapper.unmount()

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      vi.advanceTimersByTime(600)
      touch(el, 'touchstart')
      mouseDown(el)
      vi.advanceTimersByTime(600)

      expect(handler).not.toHaveBeenCalled()
      expect(el.__qtouchhold).toBeUndefined()
    })
  })
})
