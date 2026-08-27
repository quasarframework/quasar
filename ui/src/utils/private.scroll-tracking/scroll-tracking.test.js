import { afterEach, describe, expect, test, vi } from 'vitest'

import { addScrollTracking, removeScrollTracking } from './scroll-tracking.js'

const nodes = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  vi.restoreAllMocks()
})

describe('[scrollTracking API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addScrollTracking]', () => {
      test('fans a scroll from any container out to every subscriber', () => {
        const container = document.createElement('div')
        document.body.append(container)
        nodes.push(container)

        const first = vi.fn()
        const second = vi.fn()

        addScrollTracking(first)
        addScrollTracking(second)

        try {
          // a nested container no per-element listener was ever bound to
          container.dispatchEvent(new Event('scroll'))

          expect(first).toHaveBeenCalledTimes(1)
          expect(second).toHaveBeenCalledTimes(1)
          expect(first.mock.calls[0][0].target).toBe(container)
        } finally {
          removeScrollTracking(first)
          removeScrollTracking(second)
        }
      })

      test('installs one shared document listener, refcounted', () => {
        const addSpy = vi.spyOn(document, 'addEventListener')
        const first = vi.fn()
        const second = vi.fn()

        addScrollTracking(first)
        addScrollTracking(second)

        try {
          const scrollRegistrations = addSpy.mock.calls.filter(
            call => call[0] === 'scroll'
          )
          expect(scrollRegistrations).toHaveLength(1)
          expect(scrollRegistrations[0][2]).toMatchObject({
            capture: true,
            passive: true
          })
        } finally {
          removeScrollTracking(first)
          removeScrollTracking(second)
        }
      })
    })

    describe('[(function)removeScrollTracking]', () => {
      test('stops the removed subscriber while others stay live', () => {
        const removed = vi.fn()
        const kept = vi.fn()

        addScrollTracking(removed)
        addScrollTracking(kept)
        removeScrollTracking(removed)

        try {
          document.dispatchEvent(new Event('scroll'))

          expect(removed).not.toHaveBeenCalled()
          expect(kept).toHaveBeenCalledTimes(1)
        } finally {
          removeScrollTracking(kept)
        }
      })

      test('drops the document listener with the last subscriber', () => {
        const removeSpy = vi.spyOn(document, 'removeEventListener')
        const first = vi.fn()
        const second = vi.fn()

        addScrollTracking(first)
        addScrollTracking(second)

        removeScrollTracking(first)
        expect(
          removeSpy.mock.calls.filter(call => call[0] === 'scroll')
        ).toHaveLength(0)

        removeScrollTracking(second)
        expect(
          removeSpy.mock.calls.filter(call => call[0] === 'scroll')
        ).toHaveLength(1)

        document.dispatchEvent(new Event('scroll'))
        expect(first).not.toHaveBeenCalled()
        expect(second).not.toHaveBeenCalled()
      })
    })
  })
})
