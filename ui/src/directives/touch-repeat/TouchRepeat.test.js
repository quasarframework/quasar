import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

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

function mountTouchRepeat(template, handler = vi.fn()) {
  const TestComponent = defineComponent({
    template,
    directives: { TouchRepeat },
    setup() {
      return { handler }
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
  const { wrapper } = mountTouchRepeat(
    `<div v-touch-repeat.${modifier}="handler" />`
  )

  expect(wrapper.element.__qtouchrepeat.keyboard).toStrictEqual(expected)

  wrapper.unmount()
}

describe('[TouchRepeat API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchRepeat(
        '<div v-touch-repeat.mouse="handler" />'
      )

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
      const { wrapper } = mountTouchRepeat('<div v-touch-repeat.mouse />')

      dispatchMouseDown(wrapper)

      expect(wrapper.element.__qtouchrepeat.handler).toBeUndefined()
      expect(wrapper.element.__qtouchrepeat.event).toBeUndefined()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const { handler, wrapper } = mountTouchRepeat(
        '<div v-touch-repeat:100:40:20.mouse="handler" />'
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
        const { wrapper } = mountTouchRepeat(
          '<div v-touch-repeat.capture="handler" />'
        )

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'touchstart')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat(
          '<div v-touch-repeat.mouse="handler" />'
        )

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'mousedown')[3]
        ).toBe('passive')
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat(
          '<div v-touch-repeat.mouse.mouseCapture="handler" />'
        )

        expect(
          getMainEvent(wrapper.element.__qtouchrepeat, 'mousedown')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)keyCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchRepeat(
          '<div v-touch-repeat.enter.keyCapture="handler" />'
        )

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
})
