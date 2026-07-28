import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import { getMainEvent } from 'testing/runtime/directive.js'

import { client } from '../../plugins/platform/Platform.js'
import TouchSwipe from './TouchSwipe.js'

let originalHasTouch

beforeEach(() => {
  originalHasTouch = client.has.touch
  client.has.touch = false
  vi.useFakeTimers()
  vi.setSystemTime(1000)
})

afterEach(() => {
  client.has.touch = originalHasTouch
  document.body.classList.remove(
    'no-pointer-events--children',
    'non-selectable'
  )
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountTouchSwipe(modifiers = 'mouse', handler = vi.fn()) {
  const TestComponent = defineComponent({
    template: `<div v-touch-swipe.${modifiers}="handler" />`,
    directives: { TouchSwipe },
    setup() {
      return { handler }
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function dispatchMouseSwipe(wrapper, x, y) {
  wrapper.element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      cancelable: true,
      clientX: 0,
      clientY: 0
    })
  )
  vi.advanceTimersByTime(100)
  document.dispatchEvent(
    new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    })
  )
  document.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      clientX: x,
      clientY: y
    })
  )
}

function expectDirection(modifier, expected) {
  const { wrapper } = mountTouchSwipe(`${modifier}.mouse`)

  expect(wrapper.element.__qtouchswipe.direction).toMatchObject(expected)

  wrapper.unmount()
}

describe('[TouchSwipe API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchSwipe()

      dispatchMouseSwipe(wrapper, 100, 5)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'right',
          distance: {
            x: 100,
            y: 5
          },
          duration: 100,
          mouse: true,
          touch: false
        })
      )
    })

    test('as undefined', () => {
      const TestComponent = defineComponent({
        template: '<div v-touch-swipe.mouse />',
        directives: { TouchSwipe }
      })
      const wrapper = mount(TestComponent)

      wrapper.element.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          button: 0
        })
      )

      expect(wrapper.element.__qtouchswipe.handler).toBeUndefined()
      expect(wrapper.element.__qtouchswipe.event).toBeUndefined()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const TestComponent = defineComponent({
        template: '<div v-touch-swipe:1:12:80.mouse="handler" />',
        directives: { TouchSwipe },
        setup() {
          return {
            handler: vi.fn()
          }
        }
      })
      const wrapper = mount(TestComponent)

      expect(wrapper.element.__qtouchswipe.sensitivity).toStrictEqual([
        1, 12, 80
      ])
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)capture]', () => {
      test('has effect', () => {
        client.has.touch = true
        const { wrapper } = mountTouchSwipe('capture')

        expect(
          getMainEvent(wrapper.element.__qtouchswipe, 'touchstart')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchSwipe()

        expect(
          getMainEvent(wrapper.element.__qtouchswipe, 'mousedown')[3]
        ).toBe('passive')
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchSwipe('mouse.mouseCapture')

        expect(
          getMainEvent(wrapper.element.__qtouchswipe, 'mousedown')[3]
        ).toBe('passiveCapture')
      })
    })

    describe('[(modifier)horizontal]', () => {
      test('has effect', () => {
        expectDirection('horizontal', {
          horizontal: true,
          left: true,
          right: true
        })
      })
    })

    describe('[(modifier)vertical]', () => {
      test('has effect', () => {
        expectDirection('vertical', {
          down: true,
          up: true,
          vertical: true
        })
      })
    })

    describe('[(modifier)up]', () => {
      test('has effect', () => {
        expectDirection('up', { up: true })
      })
    })

    describe('[(modifier)right]', () => {
      test('has effect', () => {
        expectDirection('right', { right: true })
      })
    })

    describe('[(modifier)down]', () => {
      test('has effect', () => {
        expectDirection('down', { down: true })
      })
    })

    describe('[(modifier)left]', () => {
      test('has effect', () => {
        expectDirection('left', { left: true })
      })
    })
  })
})
