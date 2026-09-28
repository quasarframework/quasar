import { afterEach, describe, expect, onTestFinished, test, vi } from 'vitest'

import {
  addFocusFn,
  addFocusWaitFlag,
  isRefocusing,
  refocus,
  removeFocusFn,
  removeFocusWaitFlag
} from './focus-manager.js'

let waitFlagList = []
let fnList = []

afterEach(() => {
  fnList.forEach(fn => {
    removeFocusFn(fn)
  })

  waitFlagList.forEach(obj => {
    removeFocusWaitFlag(obj)
  })

  waitFlagList = []
  fnList = []
})

function createTestFn() {
  const fn = vi.fn()
  fnList.push(fn)
  return fn
}

function createTestWaitFlag() {
  const obj = {}
  waitFlagList.push(obj)
  return obj
}

function createFocusable() {
  const el = document.createElement('button')
  document.body.append(el)
  onTestFinished(() => el.remove())
  return el
}

describe('[focusManager API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addFocusWaitFlag]', () => {
      test('has correct return value', () => {
        const obj = createTestWaitFlag()

        expect(addFocusWaitFlag(obj)).toBeUndefined()
      })

      test('can add multiple wait flags', () => {
        const objFirst = createTestWaitFlag()
        const objLast = createTestWaitFlag()

        addFocusWaitFlag(objFirst)
        addFocusWaitFlag(objLast)
      })
    })

    describe('[(function)removeFocusWaitFlag]', () => {
      test('has correct return value', () => {
        expect(removeFocusWaitFlag({})).toBeUndefined()
      })

      test('calls only last registered fn when there is a wait flag', () => {
        const fnFirst = createTestFn()
        const fnLast = createTestFn()
        const obj = createTestWaitFlag()

        addFocusWaitFlag(obj)

        addFocusFn(fnFirst)
        addFocusFn(fnLast)

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).not.toHaveBeenCalled()

        removeFocusWaitFlag(obj)

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).toHaveBeenCalledTimes(1)
        expect(fnLast).toHaveBeenCalledWith()
      })

      test('calls only last registered fn when there are multiple wait flags', () => {
        const fnFirst = createTestFn()
        const fnLast = createTestFn()

        const objFirst = createTestWaitFlag()
        const objLast = createTestWaitFlag()

        addFocusWaitFlag(objFirst)
        addFocusWaitFlag(objLast)

        addFocusFn(fnFirst)
        addFocusFn(fnLast)

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).not.toHaveBeenCalled()

        removeFocusWaitFlag(objFirst)

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).not.toHaveBeenCalled()

        removeFocusWaitFlag(objLast)

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).toHaveBeenCalledTimes(1)
        expect(fnLast).toHaveBeenCalledWith()
      })
    })

    describe('[(function)addFocusFn]', () => {
      test('has correct return value', () => {
        const fn = createTestFn()

        expect(addFocusFn(fn)).toBeUndefined()
      })

      test('triggers immediately if no wait flags', () => {
        const fn = createTestFn()

        expect(addFocusFn(fn)).toBeUndefined()

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith()
      })

      test('adds to queue if there is a wait flag', () => {
        const fn = createTestFn()
        const obj = createTestWaitFlag()

        addFocusWaitFlag(obj)
        addFocusFn(fn)

        expect(fn).not.toHaveBeenCalled()

        removeFocusWaitFlag(obj)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith()
      })

      test('adds to queue if there are multiple wait flags', () => {
        const fn = createTestFn()

        const objFirst = createTestWaitFlag()
        const objLast = createTestWaitFlag()

        addFocusWaitFlag(objFirst)
        addFocusWaitFlag(objLast)

        addFocusFn(fn)

        expect(fn).not.toHaveBeenCalled()

        removeFocusWaitFlag(objLast)

        expect(fn).not.toHaveBeenCalled()

        removeFocusWaitFlag(objFirst)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith()
      })
    })

    describe('[(function)removeFocusFn]', () => {
      test('works correctly', () => {
        expect(removeFocusFn({})).toBeUndefined()
      })

      test('should not call removed fn', () => {
        const fn = createTestFn()
        const obj = createTestWaitFlag()

        addFocusWaitFlag(obj)
        addFocusFn(fn)

        removeFocusFn(fn)
        expect(fn).not.toHaveBeenCalled()

        removeFocusWaitFlag(obj)
        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(function)refocus]', () => {
      test('has correct return value', () => {
        const target = createFocusable()
        expect(refocus(target)).toBeUndefined()
        expect(document.activeElement).toBe(target)
      })

      test('marks only the synchronous focus return, leaving later focus unmarked', () => {
        const target = createFocusable()
        const observed = []
        target.addEventListener('focusin', () =>
          observed.push(isRefocusing(target))
        )

        refocus(target)
        target.blur()
        target.focus()

        expect(observed).toStrictEqual([true, false])
        expect(isRefocusing(target)).toBe(false)
      })

      test('preserves the outer target across nested focus restoration', () => {
        const outer = createFocusable()
        const inner = createFocusable()
        const observed = []
        const observe = () =>
          observed.push([isRefocusing(outer), isRefocusing(inner)])
        inner.addEventListener('focusin', observe)
        outer.addEventListener('focusin', () => {
          observe()
          refocus(inner)
          observe()
        })

        refocus(outer)

        expect(observed).toStrictEqual([
          [true, false],
          [false, true],
          [true, false]
        ])
        expect(document.activeElement).toBe(inner)
        expect(isRefocusing(outer)).toBe(false)
        expect(isRefocusing(inner)).toBe(false)
      })

      test('clears the marker when a custom focus method throws', () => {
        const error = new Error('Focus failed')
        const target = {
          focus() {
            throw error
          }
        }

        expect(() => refocus(target)).toThrow(error)
        expect(isRefocusing(target)).toBe(false)
      })
    })

    describe('[(function)isRefocusing]', () => {
      test('has correct return value', () => {
        expect(isRefocusing(createFocusable())).toBe(false)
        expect(isRefocusing(null)).toBe(false)
      })
    })
  })
})
