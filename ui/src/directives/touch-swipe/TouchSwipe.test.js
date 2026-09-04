import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref, withDirectives } from 'vue'

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
          [TouchSwipe, handler, void 0, modifierMap]
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

function dispatchMouseSwipe(wrapper, x, y) {
  mouseDown(wrapper.element)
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

function touch(el, type, x = 0, y = 0) {
  el.dispatchEvent(
    new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches:
        type === 'touchend'
          ? []
          : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })]
    })
  )
}

function dispatchTouchSwipe(el, x, y) {
  touch(el, 'touchstart')
  vi.advanceTimersByTime(100)
  touch(el, 'touchmove', x, y)
  touch(el, 'touchend')
}

// a child that keeps the press to itself: only a capture-phase
// listener on the element still sees it
function stopAtChild(wrapper, type) {
  wrapper.get('span').element.addEventListener(type, evt => {
    evt.stopPropagation()
  })
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
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchSwipe, void 0, void 0, { mouse: true }]
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

      expect(wrapper.element.__qtouchswipe.handler).toBeUndefined()
      expect(wrapper.element.__qtouchswipe.event).toBeUndefined()
    })
  })

  describe('[Argument]', () => {
    test('has effect', () => {
      const TestComponent = defineComponent({
        setup() {
          const handler = vi.fn()
          return () =>
            withDirectives(h('div'), [
              [TouchSwipe, handler, '1:12:80', { mouse: true }]
            ])
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
        const bubble = mountTouchSwipe('')
        const capture = mountTouchSwipe('capture')

        stopAtChild(bubble.wrapper, 'touchstart')
        stopAtChild(capture.wrapper, 'touchstart')

        dispatchTouchSwipe(bubble.wrapper.get('span').element, 100, 5)
        dispatchTouchSwipe(capture.wrapper.get('span').element, 100, 5)

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledWith(
          expect.objectContaining({ direction: 'right', touch: true })
        )
      })
    })

    describe('[(modifier)mouse]', () => {
      test('has effect', () => {
        client.has.touch = true
        const touchOnly = mountTouchSwipe('')
        const withMouse = mountTouchSwipe()

        dispatchMouseSwipe(touchOnly.wrapper, 100, 5)
        dispatchMouseSwipe(withMouse.wrapper, 100, 5)

        expect(touchOnly.handler).not.toHaveBeenCalled()
        expect(withMouse.handler).toHaveBeenCalledTimes(1)
      })

      test('shields the page from pointer events only while swiping', () => {
        const { wrapper } = mountTouchSwipe()
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
        vi.advanceTimersByTime(100)
        document.dispatchEvent(
          new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 5
          })
        )

        expect(
          document.body.classList.contains('no-pointer-events--children')
        ).toBe(true)

        document.dispatchEvent(
          new MouseEvent('mouseup', {
            bubbles: true,
            clientX: 100,
            clientY: 5
          })
        )

        // the page must become hit-testable again as soon as the swipe ended,
        // otherwise a mousedown that follows shortly after resolves to the
        // document element instead of its real target (#18496)
        expect(
          document.body.classList.contains('no-pointer-events--children')
        ).toBe(false)
      })
    })

    describe('[(modifier)mouseCapture]', () => {
      test('has effect', () => {
        const bubble = mountTouchSwipe()
        const capture = mountTouchSwipe('mouse.mouseCapture')

        stopAtChild(bubble.wrapper, 'mousedown')
        stopAtChild(capture.wrapper, 'mousedown')

        mouseDown(bubble.wrapper.get('span').element)
        mouseDown(capture.wrapper.get('span').element)
        vi.advanceTimersByTime(100)
        document.dispatchEvent(
          new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 5
          })
        )
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

        expect(bubble.handler).not.toHaveBeenCalled()
        expect(capture.handler).toHaveBeenCalledTimes(1)
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
    test('follows the argument and the modifiers when they change at runtime', async () => {
      const handler = vi.fn()
      const arg = ref(void 0)
      const modifiers = ref({ left: true })
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchSwipe, handler, arg.value, modifiers.value]
            ])
        }
      })
      const wrapper = mount(TestComponent)

      // no mouse modifier on a device without touch: inert
      dispatchMouseSwipe(wrapper, -100, 5)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { mouse: true, left: true }
      await flushPromises()

      dispatchMouseSwipe(wrapper, 100, 5)

      expect(handler).not.toHaveBeenCalled()

      modifiers.value = { mouse: true, right: true }
      await flushPromises()

      dispatchMouseSwipe(wrapper, 100, 5)

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'right' })
      )

      // a higher desktop distance threshold: the same movement no
      // longer qualifies
      arg.value = '0.06:6:150'
      await flushPromises()

      dispatchMouseSwipe(wrapper, 100, 5)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('an undefined value mid-gesture drops the gesture', async () => {
      const handler = vi.fn()
      const value = ref(handler)
      const TestComponent = defineComponent({
        setup() {
          return () =>
            withDirectives(h('div'), [
              [TouchSwipe, value.value, void 0, { mouse: true }]
            ])
        }
      })
      const wrapper = mount(TestComponent)

      mouseDown(wrapper.element)
      value.value = void 0
      await flushPromises()
      vi.advanceTimersByTime(100)
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 5
        })
      )
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()

      value.value = handler
      await flushPromises()
      dispatchMouseSwipe(wrapper, 100, 5)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('lets go of everything on unmount', () => {
      client.has.touch = true
      const { handler, wrapper } = mountTouchSwipe()
      const el = wrapper.element

      // a swipe in progress: the page shield is up
      mouseDown(el)
      vi.advanceTimersByTime(100)
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 5
        })
      )

      expect(handler).toHaveBeenCalledTimes(1)
      expect(
        document.body.classList.contains('no-pointer-events--children')
      ).toBe(true)

      wrapper.unmount()

      expect(
        document.body.classList.contains('no-pointer-events--children')
      ).toBe(false)
      expect(document.body.classList.contains('non-selectable')).toBe(false)

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      dispatchMouseSwipe(wrapper, 100, 5)
      dispatchTouchSwipe(el, 100, 5)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(el.__qtouchswipe).toBeUndefined()
    })
  })
})
