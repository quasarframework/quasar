import { describe, test, expect } from 'vitest'

import format from './format.js'

describe('[format API]', () => {
  describe('[Functions]', () => {
    describe('[(function)humanStorageSize]', () => {
      test.each([
        [ '100.0B', 100 ],
        [ '1.0KB', 1024 ],
        [ '2.3KB', 1024 * 2.25 ],
        [ '1.0MB', 1024 * 1024 ],
        [ '1.0GB', 1024 * 1024 * 1024 ],
        [ '1.0TB', 1024 * 1024 * 1024 * 1024 ],
        [ '1.0PB', 1024 * 1024 * 1024 * 1024 * 1024 ]
      ])('handles %s correctly', (expected, value) => {
        expect(
          format.humanStorageSize(value)
        ).toBe(expected)
      })

      test.each([
        [ '100.000B', 3, 100 ],
        [ '1KB', 0, 1024 ],
        [ '2.25KB', 2, 1024 * 2.25 ],
        [ '2.2500KB', 4, 1024 * 2.25 ]
      ])('handles %s with %d decimals correctly', (expected, decimals, value) => {
        expect(
          format.humanStorageSize(value, decimals)
        ).toBe(expected)
      })
    })

    describe('[(function)capitalize]', () => {
      test('has correct return value', () => {
        expect(
          format.capitalize('abc')
        ).toBe('Abc')
      })
    })

    describe('[(function)between]', () => {
      test.each([
        [ 1, 0, 2, 1 ],
        [ 10, 0, 5, 5 ],
        [ 0, 0, 5, 0 ],
        [ 5, 5, 5, 5 ],
        [ 5, 5, 0, 5 ]
      ])('between(%d, %d, %d)', (value, min, max, expected) => {
        expect(
          format.between(value, min, max)
        ).toBe(expected)
      })
    })

    describe('[(function)normalizeToInterval]', () => {
      test.each([
        [ 1, 0, 2, 1 ],
        [ 10, 1, 5, 5 ],
        [ 0, 0, 5, 0 ],
        [ 5, 5, 5, 5 ],
        [ 5, 5, 0, 5 ],
        [ 15, 1, 5, 5 ],
        [ 16, 1, 5, 1 ]
      ])('normalizeToInterval(%d, %d, %d)', (value, min, max, expected) => {
        expect(
          format.normalizeToInterval(value, min, max)
        ).toBe(expected)
      })
    })

    describe('[(function)pad]', () => {
      test.each([
        [ '1', '01' ],
        [ '10', '10' ],
        [ '100', '100' ],
        [ 'a', '0a' ]
      ])('pad(%s)', (value, expected) => {
        expect(
          format.pad(value)
        ).toBe(expected)
      })

      test.each([
        [ 'A', '00A' ],
        [ 'A0', '0A0' ],
        [ 'A00', 'A00' ],
        [ 'a', '00a' ]
      ])('pad(%s, 3)', (value, expected) => {
        expect(
          format.pad(value, 3)
        ).toBe(expected)
      })

      test.each([
        [ 'A', '-', '--A' ],
        [ 'A0', '-', '-A0' ],
        [ 'A00', '*', 'A00' ],
        [ 'a', '*', '**a' ]
      ])('pad(%s, 3, %s)', (value, char, expected) => {
        expect(
          format.pad(value, 3, char)
        ).toBe(expected)
      })
    })
  })
})
