import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import { addFocusout, removeFocusout } from './focusout.js'

let fnList = []

afterEach(() => {
  fnList.forEach(fn => {
    removeFocusout(fn)
  })

  fnList = []
})

function createTestFn() {
  const fn = vi.fn()
  fnList.push(fn)
  return fn
}

function triggerEvt(name = 'focusin') {
  const evt = new Event(name)
  document.body.dispatchEvent(evt)

  return evt
}

describe('[focusout API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addFocusout]', () => {
      test('registers correctly', () => {
        const fn = createTestFn()

        expect(addFocusout(fn)).toBeUndefined()

        expect(fn).not.toHaveBeenCalled()

        const evt = triggerEvt()

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(evt)
      })

      test('calls only last registered fn', () => {
        const fnFirst = createTestFn()
        const fnLast = createTestFn()

        expect(addFocusout(fnFirst)).toBeUndefined()

        expect(addFocusout(fnLast)).toBeUndefined()

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).not.toHaveBeenCalled()

        const evt = triggerEvt()

        expect(fnFirst).not.toHaveBeenCalled()
        expect(fnLast).toHaveBeenCalledTimes(1)
        expect(fnLast).toHaveBeenCalledWith(evt)

        removeFocusout(fnLast)

        const evtSecond = triggerEvt()

        expect(fnFirst).toHaveBeenCalledTimes(1)
        expect(fnFirst).toHaveBeenCalledWith(evtSecond)
      })

      test('registers on mobile platforms too', () => {
        // a hardware keyboard can Tab focus out of a modal on mobile
        // devices too, so focus containment must be armed there as well
        const original = {
          mobile: client.is.mobile,
          desktop: client.is.desktop
        }
        Object.assign(client.is, { mobile: true, desktop: false })

        try {
          const fn = createTestFn()
          addFocusout(fn)

          const evt = triggerEvt()

          expect(fn).toHaveBeenCalledTimes(1)
          expect(fn).toHaveBeenCalledWith(evt)
        } finally {
          Object.assign(client.is, original)
        }
      })

      test('triggers only on focusin evt', () => {
        const fn = createTestFn()

        expect(addFocusout(fn)).toBeUndefined()

        expect(fn).not.toHaveBeenCalled()

        triggerEvt('focusout')

        expect(fn).not.toHaveBeenCalled()
      })
    })

    describe('[(function)removeFocusout]', () => {
      test('has correct return value', () => {
        const fn = createTestFn()

        addFocusout(fn)

        expect(removeFocusout(fn)).toBeUndefined()

        triggerEvt()

        expect(fn).not.toHaveBeenCalled()
      })

      test('does not error out if fn is not registered', () => {
        const fn = createTestFn()

        expect(removeFocusout(fn)).toBeUndefined()
      })
    })
  })
})
