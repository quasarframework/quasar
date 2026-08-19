import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, withDirectives } from 'vue'

import { getMainEvent } from 'testing/runtime/directive.js'

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
        withDirectives(h('div'), [
          [TouchRepeat, handler, options.arg, modifiers]
        ])
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function dispatchMouseDown(wrapper) {
  wrapper.element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      cancelable: true,
      clientX: 10,
      clientY: 20
    })
  )
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

      dispatchMouseDown(wrapper)

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

      dispatchMouseDown(wrapper)

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

      dispatchMouseDown(wrapper)
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
        const { wrapper } = mountTouchRepeat({ capture: true })

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'touchstart')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat({ mouse: true })

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'mousedown')[3]
        ).toBe('passive')
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat({
          mouse: true,
          mouseCapture: true
        })

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'mousedown')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)keyCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat({
          enter: true,
          keyCapture: true
        })

        expect(getMainEvent(wrapper.element.__qtouchrepeat, 'keydown')[3]).toBe(
          'notPassiveCapture'
        )
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
      dispatchMouseDown(wrapper)

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      vi.advanceTimersByTime(100)

      expect(document.body.classList.contains('non-selectable')).toBe(true)

      document.dispatchEvent(new MouseEvent('click', { cancelable: true }))
      vi.advanceTimersByTime(50)

      expect(document.body.classList.contains('non-selectable')).toBe(false)

      // a touch press starts native selection on ANY touch-capable
      // device, so it is suppressed right away
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
