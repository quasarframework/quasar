import { describe, expect, test, vi } from 'vitest'

import TouchPan from './TouchPan.js'

describe('[TouchPan API]', () => {
  describe('[Functions]', () => {
    describe('[(hook)updated]', () => {
      test('does not end an active pan when the handler reference changes to another function', () => {
        const end = vi.fn()
        const fnA = () => {}
        const fnB = () => {}
        const el = { __qtouchpan: { end, handler: fnA, direction: {} } }

        TouchPan.updated(el, { oldValue: fnA, value: fnB, modifiers: {} })

        expect(end).not.toHaveBeenCalled()
        expect(el.__qtouchpan.handler).toBe(fnB)
      })
    })
  })
})
