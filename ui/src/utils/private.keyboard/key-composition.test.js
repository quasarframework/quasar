import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import {
  isKeyCode,
  onKeyDownComposition,
  shouldIgnoreKey
} from './key-composition.js'

// The module holds a private "last composition status" flag which is shared
// between all three exports, so it must be reset around each test.
function resetCompositionStatus() {
  onKeyDownComposition({ isComposing: false })
}

beforeEach(resetCompositionStatus)
afterEach(resetCompositionStatus)

describe('[keyComposition API]', () => {
  describe('[Functions]', () => {
    describe('[(function)onKeyDownComposition]', () => {
      test('returns nothing', () => {
        expect(onKeyDownComposition({ isComposing: true })).toBeUndefined()
      })

      test('makes further keys be ignored while composing', () => {
        onKeyDownComposition({ isComposing: true })

        expect(shouldIgnoreKey({ keyCode: 13 })).toBeTruthy()
        expect(isKeyCode({ keyCode: 13 }, 13)).toBe(false)
      })

      test('stops ignoring keys once composition ended', () => {
        onKeyDownComposition({ isComposing: true })
        onKeyDownComposition({ isComposing: false })

        expect(shouldIgnoreKey({ keyCode: 13 })).toBeFalsy()
        expect(isKeyCode({ keyCode: 13 }, 13)).toBe(true)
      })

      test.each([[void 0], [null], ['true'], [1]])(
        'treats a non-strictly-true "isComposing" (%s) as not composing',
        isComposing => {
          onKeyDownComposition({ isComposing })
          expect(shouldIgnoreKey({ keyCode: 13 })).toBeFalsy()
        }
      )
    })

    describe('[(function)shouldIgnoreKey]', () => {
      test('does not ignore a regular key event', () => {
        expect(shouldIgnoreKey({ keyCode: 13 })).toBeFalsy()
      })

      test.each([[void 0], [null], [13], ['Enter'], [true]])(
        'ignores a non-object event (%s)',
        evt => {
          expect(shouldIgnoreKey(evt)).toBeTruthy()
        }
      )

      test('ignores an event which is currently composing', () => {
        expect(shouldIgnoreKey({ keyCode: 13, isComposing: true })).toBeTruthy()
      })

      test('ignores an event already handled by Quasar', () => {
        expect(shouldIgnoreKey({ keyCode: 13, qKeyEvent: true })).toBeTruthy()
      })
    })

    describe('[(function)isKeyCode]', () => {
      test('matches against a single key code', () => {
        expect(isKeyCode({ keyCode: 13 }, 13)).toBe(true)
        expect(isKeyCode({ keyCode: 27 }, 13)).toBe(false)
      })

      test('matches against a list of key codes', () => {
        expect(isKeyCode({ keyCode: 32 }, [13, 32])).toBe(true)
        expect(isKeyCode({ keyCode: 27 }, [13, 32])).toBe(false)
      })

      test('returns false for events that should be ignored', () => {
        expect(isKeyCode({ keyCode: 13, isComposing: true }, 13)).toBe(false)
        expect(isKeyCode({ keyCode: 13, qKeyEvent: true }, 13)).toBe(false)
        expect(isKeyCode(13, 13)).toBe(false)
      })
    })
  })
})
