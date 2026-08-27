import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  parsePosition,
  supportsCssAnchor,
  validateOffset,
  validatePosition
} from './position-engine.js'

afterEach(() => {
  vi.restoreAllMocks()
})

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
  })
})
