import { describe, test, expect } from 'vitest'

import useAlign, { alignMap, alignValues, useAlignProps } from './use-align.js'

describe('[useAlign API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)alignMap]', () => {
      test('is defined correctly', () => {
        expect(alignMap).toBeTypeOf('object')
        expect(Object.keys(alignMap)).not.toHaveLength(0)
      })
    })

    describe('[(variable)alignValues]', () => {
      test('is defined correctly', () => {
        expect(Array.isArray(alignValues)).toBe(true)
        expect(alignValues).not.toHaveLength(0)
      })
    })

    describe('[(variable)useAlignProps]', () => {
      test('is defined correctly', () => {
        expect(useAlignProps).toBeTypeOf('object')
        expect(Object.keys(useAlignProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns correctly', () => {
        expect(
          useAlign({})
        ).$ref()
      })

      test('horizontal', () => {
        expect(
          useAlign({}).value
        ).toMatch(/^justify-/)
      })

      test('vertical', () => {
        expect(
          useAlign({ vertical: true }).value
        ).toMatch(/^items-/)
      })

      test.each([
        [ 'empty', {}, 'justify-start' ],
        [ 'vertical', { vertical: true }, 'items-stretch' ],
        [ 'align right', { align: 'right' }, 'justify-end' ],
        [ 'align evenly', { align: 'evenly' }, 'justify-evenly' ],
        [ 'vertical right', { vertical: true, align: 'right' }, 'items-end' ]
      ])('useAlign: %s', (_, arg, expected) => {
        expect(
          useAlign(arg)
        ).$ref(expected)
      })
    })
  })
})
