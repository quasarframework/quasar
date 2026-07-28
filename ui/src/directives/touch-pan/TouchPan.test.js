import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

import { getMainEvent } from 'testing/runtime/directive.js'

import { client } from '../../plugins/platform/Platform.js'
import TouchPan from './TouchPan.js'

let originalHasTouch

beforeEach(() => {
  originalHasTouch = client.has.touch
  client.has.touch = false
  vi.useFakeTimers()
})

afterEach(() => {
  client.has.touch = originalHasTouch
  document.body.classList.remove(
    'no-pointer-events--children',
    'non-selectable'
  )
  document.documentElement.style.cursor = ''
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountTouchPan(modifiers = 'mouse', handler = vi.fn(() => true)) {
  const TestComponent = defineComponent({
    template: `<div v-touch-pan.${modifiers}="handler" />`,
    directives: { TouchPan },
    setup() {
      return { handler }
    }
  })

  return {
    handler,
    wrapper: mount(TestComponent)
  }
}

function dispatchMousePan(wrapper, x, y) {
  wrapper.element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      cancelable: true,
      clientX: 0,
      clientY: 0
    })
  )
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
  const { wrapper } = mountTouchPan(`${modifier}.mouse`)

  expect(wrapper.element.__qtouchpan.direction).toMatchObject(expected)

  wrapper.unmount()
}

describe('[TouchPan API]', () => {
  describe('[Value]', () => {
    test('as Function', () => {
      const { handler, wrapper } = mountTouchPan()

      dispatchMousePan(wrapper, 40, 5)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'right',
          isFirst: true,
          mouse: true,
          touch: false
        })
      )
    })

    test('as undefined', () => {
      const TestComponent = defineComponent({
        template: '<div v-touch-pan.mouse />',
        directives: { TouchPan }
      })
      const wrapper = mount(TestComponent)

      wrapper.element.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          button: 0
        })
      )

      expect(wrapper.element.__qtouchpan.handler).toBeUndefined()
      expect(wrapper.element.__qtouchpan.event).toBeUndefined()
    })
  })

  describe('[Modifiers]', () => {
    describe('[(modifier)stop]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchPan('stop.mouse')
        const event = new MouseEvent('touchstart', {
          cancelable: true,
          clientX: 0,
          clientY: 0
        })

        wrapper.element.__qtouchpan.start(event, false)

        expect(event.cancelBubble).toBe(true)
      })
    })

    describe('[(modifier)prevent]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchPan('prevent.mouse')
        const ctx = wrapper.element.__qtouchpan
        const startEvent = new MouseEvent('touchstart', {
          cancelable: true,
          clientX: 0,
          clientY: 0
        })
        const moveEvent = new MouseEvent('touchmove', {
          cancelable: true,
          clientX: 20,
          clientY: 5
        })

        ctx.start(startEvent, false)
        ctx.move(moveEvent)

        expect(moveEvent.defaultPrevented).toBe(true)
      })
    })

    describe('[(modifier)capture]', () => {
      test('has effect', () => {
        client.has.touch = true
        const { wrapper } = mountTouchPan('capture')

        expect(getMainEvent(wrapper.element.__qtouchpan, 'touchstart')[3]).toBe(
          'passiveCapture'
        )
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchPan()

        expect(getMainEvent(wrapper.element.__qtouchpan, 'mousedown')[3]).toBe(
          'passive'
        )
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchPan('mouse.mouseCapture')

        expect(getMainEvent(wrapper.element.__qtouchpan, 'mousedown')[3]).toBe(
          'passiveCapture'
        )
      })
    })

    describe('[(modifier)mouseAllDir]', () => {
      test('has effect', () => {
        const strict = mountTouchPan('right.mouse')

        dispatchMousePan(strict.wrapper, 5, 40)

        expect(strict.handler).not.toHaveBeenCalled()

        const mouseAllDir = mountTouchPan('right.mouse.mouseAllDir')

        dispatchMousePan(mouseAllDir.wrapper, 5, 40)

        expect(mouseAllDir.handler).toHaveBeenCalledWith(
          expect.objectContaining({
            direction: 'right',
            distance: {
              x: 5,
              y: 40
            }
          })
        )
      })
    })

    describe('[(modifier)preserveCursor]', () => {
      test('has effect', () => {
        const { wrapper } = mountTouchPan('mouse.preserveCursor')
        document.documentElement.style.cursor = 'crosshair'

        dispatchMousePan(wrapper, 40, 5)

        expect(document.documentElement.style.cursor).toBe('crosshair')
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
