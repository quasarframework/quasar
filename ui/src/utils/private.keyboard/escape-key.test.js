import { describe, test, expect, vi, afterEach } from 'vitest'

import { addEscapeKey, removeEscapeKey } from './escape-key.js'

let fnList = []

afterEach(() => {
  fnList.forEach(fn => {
    removeEscapeKey(fn)
  })

  fnList = []
})

function createTestFn () {
  const fn = vi.fn()
  fnList.push(fn)
  return fn
}

function triggerKey (keyCode = 27) {
  const keydown = new KeyboardEvent('keydown', { keyCode })
  window.dispatchEvent(keydown)

  const keyup = new KeyboardEvent('keyup', { keyCode })
  window.dispatchEvent(keyup)

  return keyup
}

describe('[escapeKey API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addEscapeKey]', () => {
      test('registers correctly', async () => {
        const fn = createTestFn()

        expect(
          addEscapeKey(fn)
        ).toBeUndefined()

        expect(fn).not.toHaveBeenCalled()

        const evt = triggerKey()

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(evt)
      })

      test('calls only last registered fn', async () => {
        const fnFirst = createTestFn()
        const fnLast = createTestFn()

        expect(
          addEscapeKey(fnFirst)
        ).toBeUndefined()

        expect(
          addEscapeKey(fnLast)
        ).toBeUndefined()

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).not.toHaveBeenCalled()

        const evt = triggerKey()

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).toHaveBeenCalledTimes(1)
        expect(fnLast).toHaveBeenCalledWith(evt)

        removeEscapeKey(fnLast)

        const evtSecond = triggerKey()

        expect(fnFirst).toHaveBeenCalledTimes(1)
        expect(fnFirst).toHaveBeenCalledWith(evtSecond)
      })

      test('triggers only on ESC key', () => {
        const fn = createTestFn()

        expect(
          addEscapeKey(fn)
        ).toBeUndefined()

        expect(fn).not.toHaveBeenCalled()

        triggerKey(65)

        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(function)removeEscapeKey]', () => {
      test('has correct return value', () => {
        const fn = createTestFn()

        addEscapeKey(fn)

        expect(
          removeEscapeKey(fn)
        ).toBeUndefined()

        triggerKey()

        expect(fn).not.toHaveBeenCalled()
      })

      test('does not error out if fn is not registered', () => {
        const fn = createTestFn()

        expect(
          removeEscapeKey(fn)
        ).toBeUndefined()
      })
    })
  })
})
