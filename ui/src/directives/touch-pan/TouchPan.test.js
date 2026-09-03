import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'

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
  const modifierMap = Object.fromEntries(
    modifiers.split('.').map(mod => [mod, true])
  )
  const TestComponent = defineComponent({
    setup() {
      return () =>
        withDirectives(h('div'), [[TouchPan, handler, void 0, modifierMap]])
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
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchPan, void 0, void 0, { mouse: true }]
            ])
        }
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

    test('switching to undefined mid-pan still delivers the final payload', async () => {
      const handler = vi.fn(() => true)
      const value = ref(handler)
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchPan, value.value, void 0, { mouse: true }]
            ])
        }
      })
      const wrapper = mount(TestComponent)

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
          clientX: 40,
          clientY: 5
        })
      )

      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ isFirst: true, isFinal: false })
      )

      value.value = void 0
      await nextTick()

      expect(wrapper.element.__qtouchpan.handler).toBeUndefined()
      expect(wrapper.element.__qtouchpan.event).toBeUndefined()

      // the mouse style cleanup defers the final call by 50ms
      vi.advanceTimersByTime(50)

      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ isFirst: false, isFinal: true })
      )
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

      test('shields the page from pointer events only while panning', () => {
        const { wrapper } = mountTouchPan()
        const el = wrapper.element

        el.dispatchEvent(
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
            clientX: 40,
            clientY: 5
          })
        )

        expect(
          document.body.classList.contains('no-pointer-events--children')
        ).toBe(true)

        document.dispatchEvent(
          new MouseEvent('mouseup', {
            bubbles: true,
            clientX: 40,
            clientY: 5
          })
        )

        // the page must become hit-testable again as soon as the pan ended,
        // otherwise a mousedown that follows shortly after resolves to the
        // document element instead of its real target (#18496)
        expect(
          document.body.classList.contains('no-pointer-events--children')
        ).toBe(false)
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
