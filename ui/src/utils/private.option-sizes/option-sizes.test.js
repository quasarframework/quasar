import { describe, expect, test } from 'vitest'

import optionSizes from './option-sizes.js'

// The map is consumed as a "size name -> pixel size" lookup (by useSize()),
// so what matters is that every entry is a usable pixel value and that the
// scale grows monotonically from the smallest to the largest name.
const sizeNames = ['xs', 'sm', 'md', 'lg', 'xl']

function expectValidPixelSize(value) {
  expect(value).toBeTypeOf('number')
  expect(Number.isFinite(value)).toBe(true)
  expect(value).toBeGreaterThan(0)
}

describe('[optionSizes API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)xs]', () => {
      test('is a positive pixel size', () => {
        expectValidPixelSize(optionSizes.xs)
      })

      test('is the smallest size of the scale', () => {
        sizeNames.slice(1).forEach(name => {
          expect(optionSizes.xs).toBeLessThan(optionSizes[name])
        })
      })
    })

    describe('[(variable)sm]', () => {
      test('is a positive pixel size', () => {
        expectValidPixelSize(optionSizes.sm)
      })

      test('sits between "xs" and "md"', () => {
        expect(optionSizes.sm).toBeGreaterThan(optionSizes.xs)
        expect(optionSizes.sm).toBeLessThan(optionSizes.md)
      })
    })

    describe('[(variable)md]', () => {
      test('is a positive pixel size', () => {
        expectValidPixelSize(optionSizes.md)
      })

      test('sits between "sm" and "lg"', () => {
        expect(optionSizes.md).toBeGreaterThan(optionSizes.sm)
        expect(optionSizes.md).toBeLessThan(optionSizes.lg)
      })
    })

    describe('[(variable)lg]', () => {
      test('is a positive pixel size', () => {
        expectValidPixelSize(optionSizes.lg)
      })

      test('sits between "md" and "xl"', () => {
        expect(optionSizes.lg).toBeGreaterThan(optionSizes.md)
        expect(optionSizes.lg).toBeLessThan(optionSizes.xl)
      })
    })

    describe('[(variable)xl]', () => {
      test('is a positive pixel size', () => {
        expectValidPixelSize(optionSizes.xl)
      })

      test('is the largest size of the scale', () => {
        sizeNames.slice(0, -1).forEach(name => {
          expect(optionSizes.xl).toBeGreaterThan(optionSizes[name])
        })
      })
    })
  })
})
