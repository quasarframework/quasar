import { describe, test, expect } from 'vitest'

import History from './History.js'

/**
 * Can't really fully test it since it handles
 * Capacitor and Cordova platforms
 */

describe('[History API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)__history]', () => {
      test('is defined correctly', () => {
        expect(Array.isArray(History.__history)).toBe(true)
      })
    })

    describe('[(variable)add]', () => {
      test('is defined correctly', () => {
        expect(History.add).toBeTypeOf('function')
      })
    })

    describe('[(variable)remove]', () => {
      test('is defined correctly', () => {
        expect(History.remove).toBeTypeOf('function')
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)install]', () => {
      test('is defined correctly', () => {
        expect(History.install).toBeTypeOf('function')
      })
    })
  })
})
