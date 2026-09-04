import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

import { client } from '../../plugins/platform/Platform.js'
import TouchRepeat from './TouchRepeat.js'

let originalHasTouch

beforeEach(() => {
  originalHasTouch = client.has.touch
  client.has.touch = false
  vi.useFakeTimers()
})

afterEach(() => {
  client.has.touch = originalHasTouch
  document.body.classList.remove('non-selectable')
  document.documentElement.style.cursor = ''
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountTouchRepeat(modifiers, options = {}) {
  const handler = 'handler' in options ? options.handler : vi.fn()
  const TestComponent = defineComponent({
    setup() {
      return () =>
        withDirectives(h('div', [h('span')]), [
          [TouchRepeat, handler, options.arg, modifiers]
        ])
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function mouseDown(el) {
  el.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      cancelable: true,
      clientX: 10,
      clientY: 20
    })
  )
}

function keyDown(el, keyCode) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode })
  )
}

function touch(el, type) {
  el.dispatchEvent(
    new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches:
        type === 'touchend' ? [] : [new Touch({ identifier: 1, target: el })]
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

function expectKeyboard(modifier, expected) {
  const { wrapper } = mountTouchRepeat({ [modifier]: true })

  expect(wrapper.element.__qtouchrepeat.keyboard).toStrictEqual(expected)

  wrapper.unmount()
}

describe('[TouchRepeat API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchRepeat({ mouse: true })

      mouseDown(wrapper.element)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          mouse: true,
          repeatCount: 1,
          touch: false
        })
      )

      vi.advanceTimersByTime(600)

      expect(handler).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })

    test('as undefined', () => {
      const { wrapper } = mountTouchRepeat({ mouse: true }, { handler: void 0 })

      mouseDown(wrapper.element)

      expect(wrapper.element.__qtouchrepeat.handler).toBeUndefined()
      expect(wrapper.element.__qtouchrepeat.event).toBeUndefined()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const { handler, wrapper } = mountTouchRepeat(
        { mouse: true },
        { arg: '100:40:20' }
      )

      mouseDown(wrapper.element)
      vi.advanceTimersByTime(99)

      expect(handler).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)

      expect(handler).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(40)

      expect(handler).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)capture]', () => {
      test('has effect', () => {
        client.has.touch = true
        const bubble = mountTouchRepeat({})
        const capture = mountTouchRepeat({ capture: true })

        stopAtChild(bubble.wrapper, 'touchstart')
        stopAtChild(capture.wrapper, 'touchstart')

        touch(bubble.wrapper.get('span').element, 'touchstart')
        touch(capture.wrapper.get('span').element, 'touchstart')

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        client.has.touch = true
        const touchOnly = mountTouchRepeat({})
        const withMouse = mountTouchRepeat({ mouse: true })

        mouseDown(touchOnly.wrapper.element)
        mouseDown(withMouse.wrapper.element)

        expect(touchOnly.handler).not.toHaveBeenCalled()
        expect(withMouse.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const bubble = mountTouchRepeat({ mouse: true })
        const capture = mountTouchRepeat({ mouse: true, mouseCapture: true })

        stopAtChild(bubble.wrapper, 'mousedown')
        stopAtChild(capture.wrapper, 'mousedown')

        mouseDown(bubble.wrapper.get('span').element)
        mouseDown(capture.wrapper.get('span').element)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)keyCapture]', () => {
      test('has effect', () => {
        const bubble = mountTouchRepeat({ enter: true })
        const capture = mountTouchRepeat({ enter: true, keyCapture: true })

        stopAtChild(bubble.wrapper, 'keydown')
        stopAtChild(capture.wrapper, 'keydown')

        keyDown(bubble.wrapper.get('span').element, 13)
        keyDown(capture.wrapper.get('span').element, 13)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(modifier)esc]', () => {
      test('has effect', () => {
        expectKeyboard('esc', [27])
      })
    })

    describe('[(modifier)tab]', () => {
      test('has effect', () => {
        expectKeyboard('tab', [9])
      })
    })

    describe('[(modifier)enter]', () => {
      test('has effect', () => {
        expectKeyboard('enter', [13])
      })
    })

    describe('[(modifier)space]', () => {
      test('has effect', () => {
        expectKeyboard('space', [32])
      })
    })

    describe('[(modifier)up]', () => {
      test('has effect', () => {
        expectKeyboard('up', [38])
      })
    })

    describe('[(modifier)left]', () => {
      test('has effect', () => {
        expectKeyboard('left', [37])
      })
    })

    describe('[(modifier)right]', () => {
      test('has effect', () => {
        expectKeyboard('right', [39])
      })
    })

    describe('[(modifier)down]', () => {
      test('has effect', () => {
        expectKeyboard('down', [40])
      })
    })

    describe('[(modifier)delete]', () => {
      test('has effect', () => {
        expectKeyboard('delete', [8, 46])
      })
    })

    describe('[(modifier)[keycode]]', () => {
      test('has effect', () => {
        expectKeyboard('10', [10])
      })
    })
  })

  describe('[Generic]', () => {
    test('suppresses selection immediately for touch, lazily for mouse', () => {
      client.has.touch = true
      const { wrapper } = mountTouchRepeat({ mouse: true }, { arg: '100:100' })

      // a mouse press waits for the first repeat, so a quick
      // click never flashes the suppression styles
      mouseDown(wrapper.element)

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      vi.advanceTimersByTime(100)

      expect(document.body.classList.contains('non-selectable')).toBe(true)

      document.dispatchEvent(new MouseEvent('click', { cancelable: true }))
      vi.advanceTimersByTime(50)

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      // a touch press starts native selection on ANY touch-capable
      // device, so it is suppressed right away
      touch(wrapper.element, 'touchstart')

      expect(document.body.classList.contains('non-selectable')).toBe(true)

      touch(wrapper.element, 'touchend')
      vi.advanceTimersByTime(50)

      expect(document.body.classList.contains('non-selectable')).toBe(false)
    })

    test('repeats while a key is held and stops on its release', () => {
      const { handler, wrapper } = mountTouchRepeat(
        { space: true },
        { arg: '0:100' }
      )

      keyDown(wrapper.element, 32)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ keyboard: true, keyCode: 32, repeatCount: 1 })
      )

      // the browser's own key repeat must not start a second run
      keyDown(wrapper.element, 32)
      vi.advanceTimersByTime(100)

      expect(handler).toHaveBeenCalledTimes(2)

      const keyup = new KeyboardEvent('keyup', {
        cancelable: true,
        keyCode: 32
      })
      document.dispatchEvent(keyup)
      vi.advanceTimersByTime(300)

      expect(handler).toHaveBeenCalledTimes(2)
      expect(keyup.defaultPrevented).toBe(true)
    })

    test('stops repeating once the press moves away', () => {
      const { handler, wrapper } = mountTouchRepeat({ mouse: true })

      mouseDown(wrapper.element)
      document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 10, clientY: 30 })
      )
      vi.advanceTimersByTime(1000)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('an undefined value mid-press stops the repeats', async () => {
      const handler = vi.fn()
      const value = ref(handler)
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchRepeat, value.value, void 0, { mouse: true }]
            ])
        }
      })
      const wrapper = mount(TestComponent)

      mouseDown(wrapper.element)

      expect(handler).toHaveBeenCalledTimes(1)

      value.value = void 0
      await flushPromises()
      vi.advanceTimersByTime(1000)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(document.body.classList.contains('non-selectable')).toBe(false)

      value.value = handler
      await flushPromises()
      mouseDown(wrapper.element)

      expect(handler).toHaveBeenCalledTimes(2)
    })

    test('follows the argument and the modifiers when they change at runtime', async () => {
      const handler = vi.fn()
      const arg = ref(void 0)
      const modifiers = ref({ mouse: true })
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchRepeat, handler, arg.value, modifiers.value]
            ])
        }
      })
      const wrapper = mount(TestComponent)
      const el = wrapper.element

      keyDown(el, 13)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { enter: true }
      arg.value = '100'
      await flushPromises()

      // the mouse listener is gone, the keyboard one is on, and
      // the first repeat now waits for the new initial delay
      mouseDown(el)
      keyDown(el, 13)

      expect(handler).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ keyboard: true, keyCode: 13 })
      )
    })

    test('lets go of everything on unmount', () => {
      client.has.touch = true
      const { handler, wrapper } = mountTouchRepeat({
        mouse: true,
        enter: true
      })
      const el = wrapper.element

      mouseDown(el)
      wrapper.unmount()
      vi.advanceTimersByTime(1000)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(document.body.classList.contains('non-selectable')).toBe(false)
      expect(document.documentElement.style.cursor).toBe('')

      mouseDown(el)
      touch(el, 'touchstart')
      keyDown(el, 13)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(el.__qtouchrepeat).toBeUndefined()
    })
  })
})
