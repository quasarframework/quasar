import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'

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
    modifiers
      .split('.')
      .filter(mod => mod !== '')
      .map(mod => [mod, true])
  )
  const TestComponent = defineComponent({
    setup() {
      return () =>
        withDirectives(h('div', [h('span')]), [
          [TouchPan, handler, void 0, modifierMap]
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
      clientX: 0,
      clientY: 0
    })
  )
}

function mouseMove(x, y) {
  document.dispatchEvent(
    new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    })
  )
}

function dispatchMousePan(wrapper, x, y) {
  mouseDown(wrapper.element)
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

function touchEvent(el, type, x = 0, y = 0) {
  return new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches:
      type === 'touchend'
        ? []
        : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })]
  })
}

function dispatchTouchPan(el, x, y) {
  el.dispatchEvent(touchEvent(el, 'touchstart'))
  el.dispatchEvent(touchEvent(el, 'touchmove', x, y))
  el.dispatchEvent(touchEvent(el, 'touchend'))
}

// a child that keeps the press to itself: only a capture-phase
// listener on the element still sees it
function stopAtChild(wrapper, type) {
  wrapper.get('span').element.addEventListener(type, evt => {
    evt.stopPropagation()
  })
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
        client.has.touch = true
        const plain = mountTouchPan('')
        const stop = mountTouchPan('stop')
        const plainSeen = vi.fn()
        const stopSeen = vi.fn()

        plain.wrapper.element.parentElement.addEventListener(
          'touchstart',
          plainSeen
        )
        stop.wrapper.element.parentElement.addEventListener(
          'touchstart',
          stopSeen
        )

        plain.wrapper.element.dispatchEvent(
          touchEvent(plain.wrapper.element, 'touchstart')
        )
        stop.wrapper.element.dispatchEvent(
          touchEvent(stop.wrapper.element, 'touchstart')
        )

        expect(plainSeen).toHaveBeenCalledTimes(1)
        expect(stopSeen).not.toHaveBeenCalled()
      })
    })

    describe('[(modifier)prevent]', () => {
      test('has effect', () => {
        client.has.touch = true
        const plain = mountTouchPan('')
        const prevent = mountTouchPan('prevent')

        plain.wrapper.element.dispatchEvent(
          touchEvent(plain.wrapper.element, 'touchstart')
        )
        const plainMove = touchEvent(plain.wrapper.element, 'touchmove', 20, 5)
        plain.wrapper.element.dispatchEvent(plainMove)

        prevent.wrapper.element.dispatchEvent(
          touchEvent(prevent.wrapper.element, 'touchstart')
        )
        const preventMove = touchEvent(
          prevent.wrapper.element,
          'touchmove',
          20,
          5
        )
        prevent.wrapper.element.dispatchEvent(preventMove)

        expect(plain.handler).toHaveBeenCalledTimes(1)
        expect(plainMove.defaultPrevented).toBe(false)
        expect(prevent.handler).toHaveBeenCalledTimes(1)
        expect(preventMove.defaultPrevented).toBe(true)
      })
    })

    describe('[(modifier)capture]', () => {
      test('has effect', () => {
        client.has.touch = true
        const bubble = mountTouchPan('')
        const capture = mountTouchPan('capture')

        stopAtChild(bubble.wrapper, 'touchstart')
        stopAtChild(capture.wrapper, 'touchstart')

        dispatchTouchPan(bubble.wrapper.get('span').element, 40, 5)
        dispatchTouchPan(capture.wrapper.get('span').element, 40, 5)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledWith(
          expect.objectContaining({ direction: 'right', touch: true })
        )
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        client.has.touch = true
        const touchOnly = mountTouchPan('')
        const withMouse = mountTouchPan()

        dispatchMousePan(touchOnly.wrapper, 40, 5)
        dispatchMousePan(withMouse.wrapper, 40, 5)

        expect(touchOnly.handler).not.toHaveBeenCalled()
        expect(withMouse.handler).toHaveBeenCalled()
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
        const bubble = mountTouchPan()
        const capture = mountTouchPan('mouse.mouseCapture')

        stopAtChild(bubble.wrapper, 'mousedown')
        stopAtChild(capture.wrapper, 'mousedown')

        mouseDown(bubble.wrapper.get('span').element)
        mouseMove(40, 5)
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        mouseDown(capture.wrapper.get('span').element)
        mouseMove(40, 5)
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalled()
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

  describe('[Generic]', () => {
    test('follows the modifiers when they change at runtime', async () => {
      const handler = vi.fn(() => true)
      const modifiers = ref({ left: true })
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchPan, handler, void 0, modifiers.value]
            ])
        }
      })
      const wrapper = mount(TestComponent)

      // no mouse modifier on a device without touch: inert
      dispatchMousePan(wrapper, -40, 5)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { mouse: true, left: true }
      await nextTick()

      dispatchMousePan(wrapper, 40, 5)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { mouse: true, right: true }
      await nextTick()

      dispatchMousePan(wrapper, 40, 5)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'right' })
      )

      // preserveCursor is read from the new modifiers too
      modifiers.value = { mouse: true, right: true, preserveCursor: true }
      await nextTick()
      document.documentElement.style.cursor = 'crosshair'

      dispatchMousePan(wrapper, 40, 5)

      expect(document.documentElement.style.cursor).toBe('crosshair')
    })

    test('re-emits a press it did not claim to the element under it', () => {
      const { handler, wrapper } = mountTouchPan('right.mouse')
      const seen = vi.fn()
      wrapper.element.parentElement.addEventListener('mousedown', seen)

      // the pan stops the original press right away (an upper
      // v-touch-pan must not see it) ...
      mouseDown(wrapper.element)

      expect(seen).not.toHaveBeenCalled()

      // ... and re-emits a clone once the gesture turns out not
      // to be one of its directions
      mouseMove(5, 40)

      expect(handler).not.toHaveBeenCalled()
      expect(seen).toHaveBeenCalledTimes(1)
      expect(seen.mock.calls[0][0].qClonedBy).toStrictEqual([
        wrapper.element.__qtouchpan.uid
      ])
    })

    test('a handler returning false ends the pan', () => {
      const handler = vi.fn(() => false)
      const { wrapper } = mountTouchPan('mouse', handler)

      mouseDown(wrapper.element)
      mouseMove(40, 5)

      expect(wrapper.element.__qtouchpan.event).toBeUndefined()
      expect(document.body.classList.contains('non-selectable')).toBe(false)

      // the mouse style cleanup defers the final call by 50ms
      vi.advanceTimersByTime(50)

      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ isFinal: true })
      )

      const calls = handler.mock.calls.length
      mouseMove(80, 5)
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(calls)
    })

    test('delivers the final payload when unmounted mid-pan', () => {
      const { handler, wrapper } = mountTouchPan()
      const el = wrapper.element

      mouseDown(el)
      mouseMove(40, 5)

      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ isFirst: true, isFinal: false })
      )
      expect(document.documentElement.style.cursor).toBe('grabbing')

      wrapper.unmount()

      expect(document.documentElement.style.cursor).toBe('')
      expect(
        document.body.classList.contains('no-pointer-events--children')
      ).toBe(false)

      // the mouse style cleanup defers the final call by 50ms
      vi.advanceTimersByTime(50)

      expect(handler).toHaveBeenLastCalledWith(
        expect.objectContaining({ isFinal: true })
      )

      mouseMove(80, 5)
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      dispatchMousePan(wrapper, 40, 5)

      expect(handler).toHaveBeenCalledTimes(2)
      expect(el.__qtouchpan).toBeUndefined()
    })
  })
})
