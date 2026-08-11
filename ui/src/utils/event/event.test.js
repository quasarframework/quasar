// oxlint-disable import/no-named-as-default-member
import { afterEach, describe, expect, test, vi } from 'vitest'

import event, { addEvt, cleanEvt, noop } from './event.js'

const { listenOpts } = event

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[event API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)listenOpts]', () => {
      test('advertises passive support detection', () => {
        expect(listenOpts).toBeTypeOf('object')
        expect(listenOpts.hasPassive).toBeTypeOf('boolean')
      })

      test('exposes capture variants usable by addEventListener', () => {
        // when passive is unsupported the values degrade to the boolean
        // "useCapture" form, which addEventListener also accepts
        expect(listenOpts.passiveCapture).$any([
          true,
          { passive: true, capture: true }
        ])
        expect(listenOpts.notPassiveCapture).$any([
          true,
          { passive: false, capture: true }
        ])
      })

      test('exposes the non-capture variants only when passive is supported', () => {
        if (listenOpts.hasPassive === true) {
          expect(listenOpts.passive).toStrictEqual({ passive: true })
          expect(listenOpts.notPassive).toStrictEqual({ passive: false })
        } else {
          expect(listenOpts.passive).toBeUndefined()
          expect(listenOpts.notPassive).toBeUndefined()
        }
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)leftClick]', () => {
      test.each([
        [0, true],
        [1, false],
        [2, false]
      ])('detects button %i as %s', (button, expected) => {
        expect(event.leftClick({ button })).toBe(expected)
      })
    })

    describe('[(function)middleClick]', () => {
      test.each([
        [0, false],
        [1, true],
        [2, false]
      ])('detects button %i as %s', (button, expected) => {
        expect(event.middleClick({ button })).toBe(expected)
      })
    })

    describe('[(function)rightClick]', () => {
      test.each([
        [0, false],
        [1, false],
        [2, true]
      ])('detects button %i as %s', (button, expected) => {
        expect(event.rightClick({ button })).toBe(expected)
      })
    })

    describe('[(function)position]', () => {
      test('reads the coordinates of a mouse event', () => {
        expect(event.position({ clientX: 10, clientY: 20 })).toStrictEqual({
          left: 10,
          top: 20
        })
      })

      test.each(['touches', 'changedTouches', 'targetTouches'])(
        'reads the coordinates of the first entry of "%s"',
        key => {
          const evt = {
            clientX: 0,
            clientY: 0,
            [key]: [
              { clientX: 10, clientY: 20 },
              { clientX: 30, clientY: 40 }
            ]
          }

          expect(event.position(evt)).toStrictEqual({ left: 10, top: 20 })
        }
      )

      test('prefers "touches" over the other touch lists', () => {
        const evt = {
          touches: [{ clientX: 1, clientY: 2 }],
          changedTouches: [{ clientX: 3, clientY: 4 }],
          targetTouches: [{ clientX: 5, clientY: 6 }]
        }

        expect(event.position(evt)).toStrictEqual({ left: 1, top: 2 })
      })

      test('falls back to the event itself for empty touch lists', () => {
        const evt = { clientX: 10, clientY: 20, touches: [] }

        expect(event.position(evt)).toStrictEqual({ left: 10, top: 20 })
      })
    })

    describe('[(function)getEventPath]', () => {
      test('returns the "path" property when available', () => {
        const path = [document.createElement('div')]

        expect(event.getEventPath({ path })).toBe(path)
      })

      test('calls composedPath() when there is no "path"', () => {
        const path = [document.createElement('div')]
        const composedPath = vi.fn(() => path)

        expect(event.getEventPath({ composedPath })).toBe(path)
        expect(composedPath).toHaveBeenCalledTimes(1)
      })

      test('walks up the DOM tree as a last resort', () => {
        const parent = document.createElement('div')
        const target = document.createElement('span')

        parent.append(target)
        document.body.append(parent)

        try {
          expect(event.getEventPath({ target })).toStrictEqual([
            target,
            parent,
            document.body,
            document.documentElement,
            document,
            window
          ])
        } finally {
          parent.remove()
        }
      })

      test('returns undefined when the target is detached from the document', () => {
        const target = document.createElement('span')

        expect(event.getEventPath({ target })).toBeUndefined()
      })
    })

    describe('[(function)getMouseWheelDistance]', () => {
      test('returns pixel deltas as-is', () => {
        const distance = event.getMouseWheelDistance({
          deltaX: 5,
          deltaY: 10,
          deltaMode: 0
        })

        expect(distance).toStrictEqual({ x: 5, y: 10 })
      })

      test('scales line and page deltas up', () => {
        const lines = event.getMouseWheelDistance({
          deltaX: 1,
          deltaY: 2,
          deltaMode: 1
        })
        const pages = event.getMouseWheelDistance({
          deltaX: 1,
          deltaY: 2,
          deltaMode: 2
        })

        expect(lines.y).toBeGreaterThan(2)
        expect(lines.y).toBe(lines.x * 2)
        // a page must scroll further than a line
        expect(pages.x).toBeGreaterThan(lines.x)
        expect(pages.y).toBe(pages.x * 2)
      })

      test('does not scale a null delta', () => {
        expect(
          event.getMouseWheelDistance({ deltaX: 0, deltaY: 0, deltaMode: 2 })
        ).toStrictEqual({ x: 0, y: 0 })
      })

      test('converts a vertical delta into a horizontal one when shift is held', () => {
        expect(
          event.getMouseWheelDistance({
            deltaX: 0,
            deltaY: 10,
            deltaMode: 0,
            shiftKey: true
          })
        ).toStrictEqual({ x: 10, y: 0 })
      })

      test('keeps an existing horizontal delta when shift is held', () => {
        expect(
          event.getMouseWheelDistance({
            deltaX: 5,
            deltaY: 10,
            deltaMode: 0,
            shiftKey: true
          })
        ).toStrictEqual({ x: 5, y: 10 })
      })
    })

    describe('[(function)stop]', () => {
      test('stops the propagation of the event', () => {
        const evt = { stopPropagation: vi.fn(), preventDefault: vi.fn() }

        expect(event.stop(evt)).toBeUndefined()
        expect(evt.stopPropagation).toHaveBeenCalledTimes(1)
        expect(evt.preventDefault).not.toHaveBeenCalled()
      })
    })

    describe('[(function)prevent]', () => {
      test('prevents the default behavior of a cancelable event', () => {
        const evt = { stopPropagation: vi.fn(), preventDefault: vi.fn() }

        expect(event.prevent(evt)).toBeUndefined()
        expect(evt.preventDefault).toHaveBeenCalledTimes(1)
        expect(evt.stopPropagation).not.toHaveBeenCalled()
      })

      test('does nothing on a non-cancelable event', () => {
        const evt = { cancelable: false, preventDefault: vi.fn() }

        event.prevent(evt)
        expect(evt.preventDefault).not.toHaveBeenCalled()
      })
    })

    describe('[(function)stopAndPrevent]', () => {
      test('stops the propagation and prevents the default behavior', () => {
        const evt = { stopPropagation: vi.fn(), preventDefault: vi.fn() }

        expect(event.stopAndPrevent(evt)).toBeUndefined()
        expect(evt.stopPropagation).toHaveBeenCalledTimes(1)
        expect(evt.preventDefault).toHaveBeenCalledTimes(1)
      })

      test('still stops the propagation of a non-cancelable event', () => {
        const evt = {
          cancelable: false,
          stopPropagation: vi.fn(),
          preventDefault: vi.fn()
        }

        event.stopAndPrevent(evt)
        expect(evt.stopPropagation).toHaveBeenCalledTimes(1)
        expect(evt.preventDefault).not.toHaveBeenCalled()
      })
    })

    describe('[(function)preventDraggable]', () => {
      function createContainer() {
        const el = document.createElement('div')
        el.innerHTML = '<a href="#"></a><img><span></span>'
        document.body.append(el)
        return el
      }

      function dispatchDragStart(el) {
        const evt = new Event('dragstart', { bubbles: true, cancelable: true })
        el.dispatchEvent(evt)
        return evt.defaultPrevented
      }

      test('prevents dragging of the inner anchors and images', () => {
        const el = createContainer()

        try {
          event.preventDraggable(el, true)

          expect(el.__dragPrevented).toBe(true)

          el.querySelectorAll('a, img').forEach(child => {
            expect(dispatchDragStart(child)).toBe(true)
          })

          // other descendants are left alone
          expect(dispatchDragStart(el.querySelector('span'))).toBe(false)
        } finally {
          el.remove()
        }
      })

      test('reverts the dragging prevention', () => {
        const el = createContainer()

        try {
          event.preventDraggable(el, true)
          event.preventDraggable(el, false)

          expect(el.__dragPrevented).toBeUndefined()

          el.querySelectorAll('a, img').forEach(child => {
            expect(dispatchDragStart(child)).toBe(false)
          })
        } finally {
          el.remove()
        }
      })

      test('does the work only once while it stays applied', () => {
        const el = createContainer()
        const walkSpy = vi.spyOn(el, 'querySelectorAll')

        try {
          event.preventDraggable(el, true)
          event.preventDraggable(el, true)

          expect(walkSpy).toHaveBeenCalledTimes(1)
        } finally {
          el.remove()
        }
      })

      test('a single revert is enough no matter how many times it was applied', () => {
        const el = createContainer()

        try {
          event.preventDraggable(el, true)
          event.preventDraggable(el, true)
          event.preventDraggable(el, false)

          expect(dispatchDragStart(el.querySelector('a'))).toBe(false)
        } finally {
          el.remove()
        }
      })

      test('can be applied again after a revert', () => {
        const el = createContainer()

        try {
          event.preventDraggable(el, true)
          event.preventDraggable(el, false)
          event.preventDraggable(el, true)

          expect(el.__dragPrevented).toBe(true)
          expect(dispatchDragStart(el.querySelector('a'))).toBe(true)
        } finally {
          el.remove()
        }
      })

      test('applies to elements added to the DOM before the call only', () => {
        const el = createContainer()

        try {
          event.preventDraggable(el, true)

          const late = document.createElement('a')
          el.append(late)

          expect(dispatchDragStart(late)).toBe(false)
        } finally {
          el.remove()
        }
      })

      test('does nothing when no element is supplied', () => {
        expect(() => event.preventDraggable(void 0, true)).not.toThrow()
        expect(() => event.preventDraggable(void 0, false)).not.toThrow()
      })
    })

    describe('[(function)noop]', () => {
      test('does nothing and returns nothing', () => {
        expect(noop()).toBeUndefined()
        expect(noop('a', 'b')).toBeUndefined()
      })
    })

    describe('[(function)addEvt]', () => {
      test('registers the events on the supplied targets', () => {
        const target = document.createElement('div')
        const ctx = { onClick: vi.fn() }

        expect(
          addEvt(ctx, 'main', [[target, 'click', 'onClick', 'passive']])
        ).toBeUndefined()

        target.dispatchEvent(new Event('click'))
        expect(ctx.onClick).toHaveBeenCalledTimes(1)
      })

      test('accumulates events registered under the same target name', () => {
        const target = document.createElement('div')
        const ctx = { onClick: vi.fn(), onFocus: vi.fn() }

        addEvt(ctx, 'main', [[target, 'click', 'onClick', 'passive']])
        addEvt(ctx, 'main', [[target, 'focus', 'onFocus', 'passive']])

        expect(ctx.__q_main_evt).toHaveLength(2)

        target.dispatchEvent(new Event('click'))
        target.dispatchEvent(new Event('focus'))
        expect(ctx.onClick).toHaveBeenCalledTimes(1)
        expect(ctx.onFocus).toHaveBeenCalledTimes(1)
      })

      test('keeps separate target names apart', () => {
        const target = document.createElement('div')
        const ctx = { onClick: vi.fn() }

        addEvt(ctx, 'main', [[target, 'click', 'onClick', 'passive']])
        addEvt(ctx, 'other', [[target, 'click', 'onClick', 'passive']])

        expect(ctx.__q_main_evt).toHaveLength(1)
        expect(ctx.__q_other_evt).toHaveLength(1)
      })
    })

    describe('[(function)cleanEvt]', () => {
      test('removes the previously registered events', () => {
        const target = document.createElement('div')
        const ctx = { onClick: vi.fn() }

        addEvt(ctx, 'main', [[target, 'click', 'onClick', 'passive']])

        expect(cleanEvt(ctx, 'main')).toBeUndefined()
        expect(ctx.__q_main_evt).toBeUndefined()

        target.dispatchEvent(new Event('click'))
        expect(ctx.onClick).not.toHaveBeenCalled()
      })

      test('only removes the events of the supplied target name', () => {
        const target = document.createElement('div')
        const ctx = { onClick: vi.fn(), onFocus: vi.fn() }

        addEvt(ctx, 'main', [[target, 'click', 'onClick', 'passive']])
        addEvt(ctx, 'other', [[target, 'focus', 'onFocus', 'passive']])

        cleanEvt(ctx, 'main')

        target.dispatchEvent(new Event('click'))
        target.dispatchEvent(new Event('focus'))
        expect(ctx.onClick).not.toHaveBeenCalled()
        expect(ctx.onFocus).toHaveBeenCalledTimes(1)
      })

      test('does nothing for an unknown target name', () => {
        const ctx = {}

        expect(() => cleanEvt(ctx, 'main')).not.toThrow()
        expect(ctx.__q_main_evt).toBeUndefined()
      })
    })
  })
})
