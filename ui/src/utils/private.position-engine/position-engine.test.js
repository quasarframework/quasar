import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  applyBoundary,
  applyPointBoundary,
  parsePosition,
  supportsCssAnchor,
  validateOffset,
  validatePosition
} from './position-engine.js'

const nodes = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  vi.restoreAllMocks()
})

/**
 * Creates a real fixed-positioned element so the boundary passes under
 * test measure through the actual layout engine.
 */
function createAnchor({ top, left, width, height }) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  document.body.append(el)
  nodes.push(el)
  return el
}

/**
 * Creates a popup-like fixed element of a known natural size.
 */
function createTarget({ width = 150, height = 50 } = {}) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    position: 'fixed',
    width: `${width}px`,
    height: `${height}px`
  })

  document.body.append(el)
  nodes.push(el)
  return el
}

const origin = pos => parsePosition(pos, false)

describe('[positionEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)supportsCssAnchor]', () => {
      test('reports the Chromium test browser as supported', () => {
        // the tests run in a real Chromium, which both passes the brand
        // gate and implements every probed CSS anchor positioning piece
        expect(supportsCssAnchor()).toBe(true)
      })

      test('returns a stable, cached verdict', () => {
        expect(supportsCssAnchor()).toBe(supportsCssAnchor())
      })
    })

    describe('[(function)validatePosition]', () => {
      test.each([
        'top left',
        'top middle',
        'top right',
        'top start',
        'top end',
        'center left',
        'center middle',
        'bottom right',
        'bottom start',
        'bottom end'
      ])('accepts "%s"', pos => {
        expect(validatePosition(pos)).toBe(true)
      })

      test.each(['top', 'top left right', ''])(
        'rejects "%s" without complaining',
        pos => {
          const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

          expect(validatePosition(pos)).toBe(false)
          expect(errorSpy).not.toHaveBeenCalled()
        }
      )

      test('rejects an unknown vertical part', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(validatePosition('middle left')).toBe(false)
        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('top/center/bottom')
        )
      })

      test('rejects an unknown horizontal part', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(validatePosition('top center')).toBe(false)
        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('left/middle/right/start/end')
        )
      })
    })

    describe('[(function)validateOffset]', () => {
      test.each([
        ['undefined', void 0],
        ['null', null],
        ['a pair of numbers', [10, 20]],
        ['a pair of negative numbers', [-10, -20]]
      ])('accepts %s', (_, val) => {
        expect(validateOffset(val)).toBe(true)
      })

      test.each([
        ['an empty array', []],
        ['a single value', [10]],
        ['more than two values', [10, 20, 30]],
        ['a non-number first value', ['10', 20]],
        ['a non-number second value', [10, '20']]
      ])('rejects %s', (_, val) => {
        expect(validateOffset(val)).toBe(false)
      })
    })

    describe('[(function)parsePosition]', () => {
      test.each([
        ['top left', false, { vertical: 'top', horizontal: 'left' }],
        ['center middle', false, { vertical: 'center', horizontal: 'middle' }],
        ['bottom right', false, { vertical: 'bottom', horizontal: 'right' }],
        ['top left', true, { vertical: 'top', horizontal: 'left' }],
        ['center middle', true, { vertical: 'center', horizontal: 'middle' }],
        ['bottom right', true, { vertical: 'bottom', horizontal: 'right' }]
      ])('splits "%s" (rtl: %s)', (pos, rtl, expected) => {
        expect(parsePosition(pos, rtl)).toStrictEqual(expected)
      })

      test.each([
        ['top start', false, 'left'],
        ['top start', true, 'right'],
        ['top end', false, 'right'],
        ['top end', true, 'left']
      ])('resolves "%s" (rtl: %s) to %s', (pos, rtl, horizontal) => {
        expect(parsePosition(pos, rtl).horizontal).toBe(horizontal)
      })
    })

    describe('[(function)applyBoundary]', () => {
      test('keeps the intended origins when the placement fits', () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 30
        })
        const anchorOrigin = origin('bottom left')
        const selfOrigin = origin('top left')

        const res = applyBoundary({
          el: createTarget(),
          anchorEl,
          anchorOrigin,
          selfOrigin
        })

        expect(res).toStrictEqual({
          anchorOrigin,
          selfOrigin,
          maxHeight: null,
          maxWidth: null
        })
      })

      test('flips above and caps the height when there is no room below', () => {
        const viewportHeight = document.documentElement.clientHeight
        const anchorEl = createAnchor({
          top: viewportHeight - 60,
          left: 100,
          width: 100,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ height: 5000 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.anchorOrigin.vertical).toBe('top')
        expect(res.selfOrigin.vertical).toBe('bottom')
        // capped to the space above the anchor's top edge
        expect(res.maxHeight).toBe(`${viewportHeight - 60}px`)
      })

      test('keeps the intended side while it has at least as much room', () => {
        // the anchor straddles the viewport middle: its bottom edge is
        // below the middle, yet there is more room below than above
        // (#16443)
        const viewportHeight = document.documentElement.clientHeight
        const anchorHeight = 36
        const top = viewportHeight / 2 - anchorHeight + 4
        const anchorEl = createAnchor({
          top,
          left: 100,
          width: 100,
          height: anchorHeight
        })

        const res = applyBoundary({
          el: createTarget({ height: 5000 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.anchorOrigin.vertical).toBe('bottom')
        expect(res.selfOrigin.vertical).toBe('top')
        expect(res.maxHeight).toBe(`${viewportHeight - top - anchorHeight}px`)
      })

      test('keeps the intended side on a tie', () => {
        const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
          document.documentElement
        const anchorEl = createAnchor({
          top: viewportHeight / 2 - 18,
          left: viewportWidth / 2 - 50,
          width: 100,
          height: 36
        })
        const anchorOrigin = origin('top right')
        const selfOrigin = origin('bottom right')

        const res = applyBoundary({
          el: createTarget({ width: 5000, height: 5000 }),
          anchorEl,
          anchorOrigin,
          selfOrigin
        })

        expect(res.anchorOrigin).toStrictEqual(anchorOrigin)
        expect(res.selfOrigin).toStrictEqual(selfOrigin)
        expect(res.maxHeight).toBe(`${viewportHeight / 2 - 18}px`)
        expect(res.maxWidth).toBe(`${viewportWidth / 2 + 50}px`)
      })

      test('flips a straddling anchor once the mirrored side is roomier', () => {
        const viewportWidth = document.documentElement.clientWidth
        const anchorEl = createAnchor({
          top: 100,
          left: viewportWidth / 2 - 4,
          width: 100,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ width: 5000 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.anchorOrigin.horizontal).toBe('right')
        expect(res.selfOrigin.horizontal).toBe('right')
        expect(res.maxWidth).toBe(`${viewportWidth / 2 + 96}px`)
      })

      test('flips towards the left and caps the width at the right edge', () => {
        const viewportWidth = document.documentElement.clientWidth
        const anchorEl = createAnchor({
          top: 100,
          left: viewportWidth - 120,
          width: 100,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ width: 5000 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.anchorOrigin.horizontal).toBe('right')
        expect(res.selfOrigin.horizontal).toBe('right')
        expect(res.maxWidth).toBe(`${viewportWidth - 20}px`)
      })

      test('leaves a popup that fits the mirrored side uncapped', () => {
        // a cap at the popup's own measured size would round a
        // fractional natural size down (offsetWidth/offsetHeight are
        // integers) and wrap or scroll content that fit before the flip
        const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
          document.documentElement
        const anchorEl = createAnchor({
          top: viewportHeight - 60,
          left: viewportWidth - 120,
          width: 100,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ width: 150.5, height: 50.5 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.anchorOrigin).toStrictEqual(origin('top right'))
        expect(res.selfOrigin).toStrictEqual(origin('bottom right'))
        expect(res.maxHeight).toBeNull()
        expect(res.maxWidth).toBeNull()
      })

      test('measures the natural size by lifting previous caps', () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 30
        })
        const el = createTarget()
        el.style.maxHeight = '10px'
        el.style.maxWidth = '10px'
        el.style.visibility = 'hidden'

        applyBoundary({
          el,
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(el.style.maxHeight).toBe('')
        expect(el.style.maxWidth).toBe('')
        expect(el.style.visibility).toBe('')
      })

      test('leaves the element at the caps it decided', () => {
        // the engines restore the popup's scroll offset right after the
        // pass, which needs the popup scrollable again by then (#18534)
        const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
          document.documentElement
        const anchorEl = createAnchor({
          top: viewportHeight - 60,
          left: viewportWidth - 120,
          width: 100,
          height: 30
        })
        const el = createTarget({ width: 5000, height: 5000 })

        const res = applyBoundary({
          el,
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(res.maxHeight).not.toBeNull()
        expect(res.maxWidth).not.toBeNull()
        expect(el.style.maxHeight).toBe(res.maxHeight)
        expect(el.style.maxWidth).toBe(res.maxWidth)
      })

      test('expands the anchor by the offset before measuring the space', () => {
        const viewportHeight = document.documentElement.clientHeight
        const anchorEl = createAnchor({
          top: viewportHeight - 60,
          left: 100,
          width: 100,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ height: 5000 }),
          anchorEl,
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left'),
          offset: [0, 10]
        })

        // the expanded top edge sits 10px higher
        expect(res.maxHeight).toBe(`${viewportHeight - 70}px`)
      })

      test('leaves natively clamped center axes alone', () => {
        const viewportWidth = document.documentElement.clientWidth
        const anchorEl = createAnchor({
          top: 100,
          left: viewportWidth - 50,
          width: 40,
          height: 30
        })

        const res = applyBoundary({
          el: createTarget({ width: 300 }),
          anchorEl,
          anchorOrigin: origin('bottom middle'),
          selfOrigin: origin('top middle')
        })

        expect(res.maxWidth).toBeNull()
        expect(res.selfOrigin.horizontal).toBe('middle')
      })
    })

    describe('[(function)applyPointBoundary]', () => {
      test('returns null while the intended sides fit', () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 50
        })

        const res = applyPointBoundary({
          el: createTarget(),
          anchorEl,
          point: { top: 25, left: 50 },
          selfOrigin: origin('top left')
        })

        expect(res).toBeNull()
      })

      test('mirrors vertically and moves the point by twice the offset', () => {
        const viewportHeight = document.documentElement.clientHeight
        const anchorEl = createAnchor({
          top: viewportHeight - 40,
          left: 100,
          width: 100,
          height: 30
        })

        const res = applyPointBoundary({
          el: createTarget({ height: 100 }),
          anchorEl,
          point: { top: 20, left: 10 },
          selfOrigin: origin('top left'),
          offset: [4, 6]
        })

        expect(res.selfOrigin).toStrictEqual({
          vertical: 'bottom',
          horizontal: 'left'
        })
        expect(res.point).toStrictEqual({ top: 20 - 12, left: 10 })
      })

      test('mirrors horizontally at the right viewport edge', () => {
        const viewportWidth = document.documentElement.clientWidth
        const anchorEl = createAnchor({
          top: 100,
          left: viewportWidth - 40,
          width: 30,
          height: 30
        })

        const res = applyPointBoundary({
          el: createTarget({ width: 100 }),
          anchorEl,
          point: { top: 10, left: 20 },
          selfOrigin: origin('top left'),
          offset: [4, 6]
        })

        expect(res.selfOrigin).toStrictEqual({
          vertical: 'top',
          horizontal: 'right'
        })
        expect(res.point).toStrictEqual({ top: 10, left: 20 - 8 })
      })

      test('mirrors back when a flipped side stops fitting', () => {
        const anchorEl = createAnchor({
          top: 0,
          left: 100,
          width: 100,
          height: 30
        })

        // an already-flipped popup (opening upwards) with no room above
        const res = applyPointBoundary({
          el: createTarget({ height: 100 }),
          anchorEl,
          point: { top: 10, left: 10 },
          selfOrigin: origin('bottom left'),
          offset: [4, 6]
        })

        expect(res.selfOrigin.vertical).toBe('top')
        expect(res.point.top).toBe(10 + 12)
      })

      test('leaves centered axes alone', () => {
        const viewportHeight = document.documentElement.clientHeight
        const anchorEl = createAnchor({
          top: viewportHeight - 20,
          left: 100,
          width: 100,
          height: 30
        })

        const res = applyPointBoundary({
          el: createTarget({ height: 400 }),
          anchorEl,
          point: { top: 10, left: 10 },
          selfOrigin: origin('center middle'),
          offset: [4, 6]
        })

        expect(res).toBeNull()
      })
    })
  })
})
