import { describe, expect, test } from 'vitest'

import { getOptionSizeStyle } from './option-sizes.js'

// The getter is consumed as a "size name -> font-size style" lookup,
// so what matters is that every standard name resolves to a usable
// pixel value and that the scale grows monotonically from the smallest
// to the largest name.
const sizeNames = ['xs', 'sm', 'md', 'lg', 'xl']

function pxOf(name) {
  const { fontSize } = getOptionSizeStyle(name)
  expect(fontSize).toMatch(/^\d+px$/)
  return Number.parseInt(fontSize, 10)
}

describe('[optionSizes API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)getOptionSizeStyle]', () => {
      test('resolves every standard size name to a positive pixel size', () => {
        sizeNames.forEach(name => {
          expect(pxOf(name)).toBeGreaterThan(0)
        })
      })

      test('grows monotonically from "xs" to "xl"', () => {
        sizeNames.slice(1).forEach((name, index) => {
          expect(pxOf(name)).toBeGreaterThan(pxOf(sizeNames[index]))
        })
      })

      test('passes through custom CSS sizes', () => {
        expect(getOptionSizeStyle(void 0)).toBeNull()
        expect(getOptionSizeStyle('2em')).toStrictEqual({ fontSize: '2em' })
      })

      test('returns shared, reference-stable style objects', () => {
        expect(getOptionSizeStyle('md')).toBe(getOptionSizeStyle('md'))
      })
    })
  })
})
