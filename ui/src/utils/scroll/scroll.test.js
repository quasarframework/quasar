import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  animHorizontalScrollTo,
  animVerticalScrollTo,
  getHorizontalScrollPosition,
  getScrollHeight,
  getScrollTarget,
  getScrollWidth,
  getScrollbarWidth,
  getVerticalScrollPosition,
  hasScrollbar,
  scrollTargetProp,
  setHorizontalScrollPosition,
  setVerticalScrollPosition
} from './scroll.js'

const nodes = []
const restoreFns = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  restoreFns.splice(0).forEach(fn => fn())
  vi.restoreAllMocks()
  window.scrollTo(0, 0)
})

/**
 * Overrides a property with a fixed value, then registers the undo so the
 * next test starts from a clean slate. Only used for the legacy window
 * fallback chains: the browser keeps pageX/YOffset, scrollX/Y and the body
 * scroll offsets in sync, so each fallback branch has to be forced by hand.
 */
function mockProperty(target, key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key)

  Object.defineProperty(target, key, { configurable: true, get: () => value })

  restoreFns.push(() => {
    if (descriptor === void 0) delete target[key]
    else Object.defineProperty(target, key, descriptor)
  })
}

/**
 * Creates an attached fixed-size container, optionally holding real
 * overflowing content so it can actually scroll. Every scrollTop/scrollLeft
 * write is still applied for real, but also recorded, so the exact write
 * sequence stays observable.
 */
function createScrollElement({
  className,
  style,
  contentWidth,
  contentHeight,
  scrollable = false
} = {}) {
  const el = document.createElement('div')
  const positions = { top: [], left: [] }

  if (className !== void 0) el.className = className

  if (scrollable === true) {
    el.style.overflow = 'auto'
    if (contentWidth === void 0) contentWidth = 1000
    if (contentHeight === void 0) contentHeight = 1000
  }

  Object.assign(el.style, { width: '100px', height: '100px' }, style)

  if (contentWidth !== void 0 || contentHeight !== void 0) {
    const content = document.createElement('div')
    // a zero-sized axis would contribute no overflow, so default it to 10px
    content.style.width = `${contentWidth ?? 10}px`
    content.style.height = `${contentHeight ?? 10}px`
    el.append(content)
  }

  ;[
    ['scrollTop', positions.top],
    ['scrollLeft', positions.left]
  ].forEach(([key, list]) => {
    const { get, set } = Object.getOwnPropertyDescriptor(Element.prototype, key)

    Object.defineProperty(el, key, {
      configurable: true,
      get() {
        return get.call(this)
      },
      set(value) {
        list.push(value)
        set.call(this, value)
      }
    })
  })

  document.body.append(el)
  nodes.push(el)

  return { el, positions }
}

// gives the document real overflowing content, so window scrolling works;
// the afterEach hook removes the filler and resets the scroll position
function makeDocumentScrollable() {
  const filler = document.createElement('div')
  Object.assign(filler.style, { width: '3000px', height: '3000px' })

  document.body.append(filler)
  nodes.push(filler)
}

/**
 * Replays the supplied frame timestamps synchronously (starting from a "now"
 * of 0), so an animation can be driven to completion without real timers.
 */
function mockAnimationFrames(timestamps) {
  vi.spyOn(performance, 'now').mockReturnValue(0)

  let index = 0

  return vi
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(callback => {
      if (index === timestamps.length) {
        throw new Error(
          'requestAnimationFrame() called more times than expected'
        )
      }

      callback(timestamps[index++])
      return index
    })
}

describe('[scroll API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)scrollTargetProp]', () => {
      test('is defined correctly', () => {
        expect(scrollTargetProp).toStrictEqual([Element, String])

        // it must be usable as a Vue prop type
        expect({ target: { type: scrollTargetProp } }).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getScrollTarget]', () => {
      test('returns the explicitly specified target', () => {
        const { el } = createScrollElement()
        el.id = 'explicit-scroll-target'

        expect(getScrollTarget(document.body, el)).toBe(el)
        expect(getScrollTarget(document.body, '#explicit-scroll-target')).toBe(
          el
        )
      })

      test.each([
        ['scroll', 'scroll'],
        ['scroll-y', 'scroll-y'],
        ['overflow-auto', 'overflow-auto']
      ])('walks up to the closest .%s ancestor', (_, className) => {
        const { el: ancestor } = createScrollElement({ className })
        const child = document.createElement('div')
        ancestor.append(child)

        expect(getScrollTarget(child)).toBe(ancestor)
      })

      test('returns the element itself when it is its own scrolling container', () => {
        const { el } = createScrollElement({ className: 'scroll' })

        expect(getScrollTarget(el)).toBe(el)
      })

      test.each([
        ['no element is supplied', () => void 0],
        ['the element is null', () => null],
        ['no scrolling ancestor exists', () => document.createElement('div')]
      ])('falls back to window when %s', (_, getEl) => {
        expect(getScrollTarget(getEl())).toBe(window)
      })

      test.each([
        ['a missing selector match', () => '#there-is-no-such-element'],
        ['document', () => document],
        ['document.body', () => document.body],
        ['document.documentElement', () => document.documentElement]
      ])('normalizes %s to window', (_, getTarget) => {
        expect(getScrollTarget(void 0, getTarget())).toBe(window)
      })
    })

    describe('[(function)getScrollHeight]', () => {
      test('returns the scrollHeight of the element', () => {
        const { el } = createScrollElement({ contentHeight: 720 })

        expect(getScrollHeight(el)).toBe(720)
      })

      test('reads the body when the target is window', () => {
        makeDocumentScrollable()

        expect(getScrollHeight(window)).toBe(document.body.scrollHeight)
        expect(getScrollHeight(window)).toBeGreaterThanOrEqual(3000)
      })
    })

    describe('[(function)getScrollWidth]', () => {
      test('returns the scrollWidth of the element', () => {
        const { el } = createScrollElement({ contentWidth: 480 })

        expect(getScrollWidth(el)).toBe(480)
      })

      test('reads the body when the target is window', () => {
        makeDocumentScrollable()

        expect(getScrollWidth(window)).toBe(document.body.scrollWidth)
        expect(getScrollWidth(window)).toBeGreaterThanOrEqual(3000)
      })
    })

    describe('[(function)getVerticalScrollPosition]', () => {
      test('returns the scrollTop of the element', () => {
        const { el } = createScrollElement({ scrollable: true })
        el.scrollTop = 42

        expect(getVerticalScrollPosition(el)).toBe(42)
      })

      test.each([
        [
          'pageYOffset',
          { pageYOffset: 120, scrollY: 90, bodyScrollTop: 60 },
          120
        ],
        ['scrollY', { pageYOffset: 0, scrollY: 90, bodyScrollTop: 60 }, 90],
        [
          'the body scrollTop',
          { pageYOffset: 0, scrollY: 0, bodyScrollTop: 60 },
          60
        ],
        ['zero', { pageYOffset: 0, scrollY: 0, bodyScrollTop: 0 }, 0]
      ])(
        'falls back to %s for window',
        (_, { bodyScrollTop, ...windowProps }, expected) => {
          Object.entries(windowProps).forEach(([key, value]) => {
            mockProperty(window, key, value)
          })
          mockProperty(document.body, 'scrollTop', bodyScrollTop)

          expect(getVerticalScrollPosition(window)).toBe(expected)
        }
      )
    })

    describe('[(function)getHorizontalScrollPosition]', () => {
      test('returns the scrollLeft of the element', () => {
        const { el } = createScrollElement({ scrollable: true })
        el.scrollLeft = 24

        expect(getHorizontalScrollPosition(el)).toBe(24)
      })

      test.each([
        [
          'pageXOffset',
          { pageXOffset: 110, scrollX: 70, bodyScrollLeft: 35 },
          110
        ],
        ['scrollX', { pageXOffset: 0, scrollX: 70, bodyScrollLeft: 35 }, 70],
        [
          'the body scrollLeft',
          { pageXOffset: 0, scrollX: 0, bodyScrollLeft: 35 },
          35
        ],
        ['zero', { pageXOffset: 0, scrollX: 0, bodyScrollLeft: 0 }, 0]
      ])(
        'falls back to %s for window',
        (_, { bodyScrollLeft, ...windowProps }, expected) => {
          Object.entries(windowProps).forEach(([key, value]) => {
            mockProperty(window, key, value)
          })
          mockProperty(document.body, 'scrollLeft', bodyScrollLeft)

          expect(getHorizontalScrollPosition(window)).toBe(expected)
        }
      )
    })

    describe('[(function)animVerticalScrollTo]', () => {
      test('scrolls right away when there is nothing to animate', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([])

        animVerticalScrollTo(el, 300)

        expect(positions.top).toStrictEqual([300])
        expect(el.scrollTop).toBe(300)
        expect(raf).not.toHaveBeenCalled()
      })

      test('does not touch the target when it is already there', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        el.scrollTop = 300
        positions.top.length = 0

        animVerticalScrollTo(el, 300)

        expect(positions.top).toStrictEqual([])
      })

      test('eases towards the destination on each frame', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([50, 100])

        animVerticalScrollTo(el, 100, 100)

        expect(positions.top).toStrictEqual([50, 100])
        expect(el.scrollTop).toBe(100)
        expect(raf).toHaveBeenCalledTimes(2)
      })

      test('animates window through window.scrollTo()', () => {
        makeDocumentScrollable()
        window.scrollTo(15, 0)

        const scrollTo = vi.spyOn(window, 'scrollTo')
        mockAnimationFrames([100])

        animVerticalScrollTo(window, 100, 100)

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(15, 100)
        expect(window.scrollX).toBe(15)
        expect(window.scrollY).toBe(100)
      })
    })

    describe('[(function)animHorizontalScrollTo]', () => {
      test('scrolls right away when there is nothing to animate', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([])

        animHorizontalScrollTo(el, 300)

        expect(positions.left).toStrictEqual([300])
        expect(el.scrollLeft).toBe(300)
        expect(raf).not.toHaveBeenCalled()
      })

      test('does not touch the target when it is already there', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        el.scrollLeft = 300
        positions.left.length = 0

        animHorizontalScrollTo(el, 300)

        expect(positions.left).toStrictEqual([])
      })

      test('eases towards the destination on each frame', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([50, 100])

        animHorizontalScrollTo(el, 100, 100)

        expect(positions.left).toStrictEqual([50, 100])
        expect(el.scrollLeft).toBe(100)
        expect(raf).toHaveBeenCalledTimes(2)
      })

      test('animates window through window.scrollTo()', () => {
        makeDocumentScrollable()
        window.scrollTo(0, 25)

        const scrollTo = vi.spyOn(window, 'scrollTo')
        mockAnimationFrames([100])

        animHorizontalScrollTo(window, 100, 100)

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(100, 25)
        expect(window.scrollX).toBe(100)
        expect(window.scrollY).toBe(25)
      })
    })

    describe('[(function)setVerticalScrollPosition]', () => {
      test.each([
        ['no duration', void 0],
        ['a zero duration', 0]
      ])('scrolls synchronously with %s', (_, duration) => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([])

        setVerticalScrollPosition(el, 250, duration)

        expect(positions.top).toStrictEqual([250])
        expect(el.scrollTop).toBe(250)
        expect(raf).not.toHaveBeenCalled()
      })

      test('animates when a duration is given', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([50, 100])

        setVerticalScrollPosition(el, 100, 100)

        expect(raf).toHaveBeenCalledTimes(2)
        expect(positions.top).toStrictEqual([50, 100])
      })

      test('scrolls window synchronously', () => {
        makeDocumentScrollable()
        window.scrollTo(5, 0)

        const scrollTo = vi.spyOn(window, 'scrollTo')

        setVerticalScrollPosition(window, 80)

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(5, 80)
        expect(window.scrollX).toBe(5)
        expect(window.scrollY).toBe(80)
      })
    })

    describe('[(function)setHorizontalScrollPosition]', () => {
      test.each([
        ['no duration', void 0],
        ['a zero duration', 0]
      ])('scrolls synchronously with %s', (_, duration) => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([])

        setHorizontalScrollPosition(el, 250, duration)

        expect(positions.left).toStrictEqual([250])
        expect(el.scrollLeft).toBe(250)
        expect(raf).not.toHaveBeenCalled()
      })

      test('animates when a duration is given', () => {
        const { el, positions } = createScrollElement({ scrollable: true })
        const raf = mockAnimationFrames([50, 100])

        setHorizontalScrollPosition(el, 100, 100)

        expect(raf).toHaveBeenCalledTimes(2)
        expect(positions.left).toStrictEqual([50, 100])
      })

      test('scrolls window synchronously', () => {
        makeDocumentScrollable()
        window.scrollTo(0, 7)

        const scrollTo = vi.spyOn(window, 'scrollTo')

        setHorizontalScrollPosition(window, 80)

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(80, 7)
        expect(window.scrollX).toBe(80)
        expect(window.scrollY).toBe(7)
      })
    })

    describe('[(function)getScrollbarWidth]', () => {
      test('measures once and then serves the cached value', () => {
        const bodyChildrenCount = document.body.children.length
        const width = getScrollbarWidth()

        expect(width).toBeTypeOf('number')
        expect(Number.isNaN(width)).toBe(false)

        // the measuring nodes must not be left behind
        expect(document.body.children).toHaveLength(bodyChildrenCount)

        const createElement = vi.spyOn(document, 'createElement')

        expect(getScrollbarWidth()).toBe(width)
        expect(createElement).not.toHaveBeenCalled()
      })
    })

    describe('[(function)hasScrollbar]', () => {
      test.each([
        ['undefined', () => void 0],
        ['null', () => null],
        ['the document', () => document],
        ['a text node', () => document.createTextNode('text')]
      ])('returns false for %s', (_, getEl) => {
        expect(hasScrollbar(getEl())).toBe(false)
      })

      test.each([
        ['no overflow at all', {}, {}, false],
        [
          'overflowing content but no overflow style',
          { contentHeight: 200 },
          {},
          false
        ],
        [
          'the scroll class',
          { contentHeight: 200 },
          { className: 'scroll' },
          true
        ],
        [
          'the overflow-auto class',
          { contentHeight: 200 },
          { className: 'overflow-auto' },
          true
        ],
        [
          'an auto overflow-y',
          { contentHeight: 200 },
          { style: { overflowY: 'auto' } },
          true
        ],
        [
          'a scroll overflow-y',
          { contentHeight: 200 },
          { style: { overflowY: 'scroll' } },
          true
        ],
        [
          'a scrollable style but no overflowing content',
          { contentHeight: 100 },
          { style: { overflowY: 'scroll' } },
          false
        ]
      ])(
        'detects a vertical scrollbar with %s',
        (_, layout, elProps, expected) => {
          // the container is 100px tall, so 200px tall content really overflows
          const { el } = createScrollElement({ ...elProps, ...layout })

          expect(hasScrollbar(el)).toBe(expected)
        }
      )

      test.each([
        ['no overflow at all', {}, {}, false],
        [
          'overflowing content but no overflow style',
          { contentWidth: 200 },
          {},
          false
        ],
        [
          'the scroll class',
          { contentWidth: 200 },
          { className: 'scroll' },
          true
        ],
        [
          'the overflow-auto class',
          { contentWidth: 200 },
          { className: 'overflow-auto' },
          true
        ],
        [
          'an auto overflow-x',
          { contentWidth: 200 },
          { style: { overflowX: 'auto' } },
          true
        ],
        [
          'a scroll overflow-x',
          { contentWidth: 200 },
          { style: { overflowX: 'scroll' } },
          true
        ],
        [
          'a scrollable style but no overflowing content',
          { contentWidth: 100 },
          { style: { overflowX: 'scroll' } },
          false
        ]
      ])(
        'detects a horizontal scrollbar with %s',
        (_, layout, elProps, expected) => {
          // the container is 100px wide, so 200px wide content really overflows
          const { el } = createScrollElement({ ...elProps, ...layout })

          expect(hasScrollbar(el, false)).toBe(expected)
        }
      )
    })
  })
})
