import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { observe, unobserve } from './intersection.js'

let observers
let elements

beforeEach(() => {
  observers = []
  elements = []

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback, options) {
        this.callback = callback
        this.options = options
        this.observe = vi.fn()
        this.unobserve = vi.fn()
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
  )
})

afterEach(() => {
  // observers are pooled per config, so every element must be given
  // back or the next test would silently reuse this one's observer
  elements.forEach(el => {
    unobserve(el)
    el.remove()
  })
  vi.unstubAllGlobals()
})

function createElement() {
  const el = document.createElement('div')
  elements.push(el)
  return el
}

function createSubscriber(handler = vi.fn(), once = false) {
  return { handler, once, pool: void 0, done: false }
}

function entryFor(target, isIntersecting = true) {
  return { target, isIntersecting, rootBounds: {} }
}

describe('[intersection API]', () => {
  describe('[Functions]', () => {
    describe('[(function)observe]', () => {
      test('shares one observer between elements with the same config', () => {
        const a = createElement()
        const b = createElement()
        const subA = createSubscriber()
        const subB = createSubscriber()

        observe(a, subA, null, '10px', [0, 0.5])
        observe(b, subB, null, '10px', [0, 0.5])

        expect(observers).toHaveLength(1)
        const [observer] = observers
        expect(observer.options).toStrictEqual({
          root: null,
          rootMargin: '10px',
          threshold: [0, 0.5]
        })
        expect(observer.observe).toHaveBeenCalledWith(a)
        expect(observer.observe).toHaveBeenCalledWith(b)

        const entryA = entryFor(a)
        const entryB = entryFor(b)
        observer.callback([entryA, entryB], observer)

        expect(subA.handler).toHaveBeenCalledExactlyOnceWith(entryA)
        expect(subB.handler).toHaveBeenCalledExactlyOnceWith(entryB)
      })

      test('uses default options when none are given', () => {
        observe(createElement(), createSubscriber())

        expect(observers[0].options).toStrictEqual({
          root: null,
          rootMargin: '0px',
          threshold: 0
        })
      })

      test('creates separate observers for different configs', () => {
        const root = document.createElement('div')

        observe(createElement(), createSubscriber(), null, '0px', 0)
        observe(createElement(), createSubscriber(), root, '0px', 0)
        observe(createElement(), createSubscriber(), null, '5px', 0)
        observe(createElement(), createSubscriber(), null, '0px', [0, 1])

        expect(observers).toHaveLength(4)
        expect(observers[1].options.root).toBe(root)
        expect(observers[2].options.rootMargin).toBe('5px')
        expect(observers[3].options.threshold).toStrictEqual([0, 1])
      })

      test('is a no-op for an already observed element with an equal config', () => {
        const el = createElement()
        const sub = createSubscriber()

        observe(el, sub, null, '5px', [0, 0.5])
        // a fresh but equal threshold array counts as the same config
        observe(el, sub, null, '5px', [0, 0.5])

        expect(observers).toHaveLength(1)
        expect(observers[0].observe).toHaveBeenCalledOnce()
        expect(observers[0].unobserve).not.toHaveBeenCalled()
      })

      test('moves an element to another observer when its config changes', () => {
        const el = createElement()
        const sub = createSubscriber()

        observe(el, sub, null, '0px', 0)
        const [first] = observers

        observe(el, sub, null, '0px', 1)

        expect(observers).toHaveLength(2)
        expect(first.disconnect).toHaveBeenCalledOnce()
        expect(observers[1].observe).toHaveBeenCalledWith(el)

        // an entry the former observer had already queued is dropped
        first.callback([entryFor(el)], first)
        expect(sub.handler).not.toHaveBeenCalled()

        observers[1].callback([entryFor(el)], observers[1])
        expect(sub.handler).toHaveBeenCalledOnce()
      })

      test('never observes a done subscriber again', () => {
        const el = createElement()
        const sub = createSubscriber(vi.fn(() => false))

        observe(el, sub)
        observers[0].callback([entryFor(el)], observers[0])

        expect(sub.done).toBe(true)
        expect(el.__qintersection).toBeUndefined()

        observe(el, sub)

        expect(observers).toHaveLength(1)
        expect(observers[0].observe).toHaveBeenCalledOnce()
      })

      test('a handler returning false retires only its element', () => {
        const stop = createElement()
        const keep = createElement()
        const subStop = createSubscriber(vi.fn(() => false))
        const subKeep = createSubscriber()

        observe(stop, subStop)
        observe(keep, subKeep)
        const [observer] = observers

        observer.callback([entryFor(stop), entryFor(keep)], observer)

        expect(observer.unobserve).toHaveBeenCalledExactlyOnceWith(stop)
        expect(observer.disconnect).not.toHaveBeenCalled()
        expect(subStop.done).toBe(true)
        expect(subKeep.done).toBe(false)

        observer.callback([entryFor(stop), entryFor(keep)], observer)

        expect(subStop.handler).toHaveBeenCalledOnce()
        expect(subKeep.handler).toHaveBeenCalledTimes(2)
      })

      test('once retires the element on its first intersecting entry, after the handler saw it', () => {
        const el = createElement()
        const sub = createSubscriber(vi.fn(), true)

        observe(el, sub)
        const [observer] = observers

        const hidden = entryFor(el, false)
        const shown = entryFor(el, true)
        // the batch keeps going after the retire, the extra entries drop
        observer.callback([hidden, shown, shown], observer)

        expect(sub.handler).toHaveBeenCalledTimes(2)
        expect(sub.handler).toHaveBeenNthCalledWith(1, hidden)
        expect(sub.handler).toHaveBeenNthCalledWith(2, shown)
        expect(sub.done).toBe(true)
        expect(observer.disconnect).toHaveBeenCalledOnce()
      })

      test('re-observes an attached element that reports no root bounds', () => {
        const el = createElement()
        document.body.append(el)
        const sub = createSubscriber()

        observe(el, sub)
        const [observer] = observers

        observer.callback(
          [{ target: el, isIntersecting: true, rootBounds: null }],
          observer
        )

        expect(sub.handler).not.toHaveBeenCalled()
        expect(observer.unobserve).toHaveBeenCalledExactlyOnceWith(el)
        expect(observer.observe).toHaveBeenCalledTimes(2)
        expect(el.__qintersection).toBe(sub)
      })

      test('ignores entries for elements that are not observed', () => {
        const el = createElement()
        const stray = createElement()

        observe(el, createSubscriber())
        const [observer] = observers

        expect(() => {
          observer.callback([entryFor(stray)], observer)
        }).not.toThrow()
      })
    })

    describe('[(function)unobserve]', () => {
      test('unobserves the element while others still share the observer', () => {
        const a = createElement()
        const b = createElement()
        const subA = createSubscriber()

        observe(a, subA)
        observe(b, createSubscriber())
        const [observer] = observers

        unobserve(a)

        expect(observer.unobserve).toHaveBeenCalledExactlyOnceWith(a)
        expect(observer.disconnect).not.toHaveBeenCalled()
        expect(a.__qintersection).toBeUndefined()
        expect(subA.pool).toBeUndefined()

        observer.callback([entryFor(a)], observer)
        expect(subA.handler).not.toHaveBeenCalled()
      })

      test('disconnects and drops the observer with its last element', () => {
        const el = createElement()

        observe(el, createSubscriber())
        const [first] = observers

        unobserve(el)

        expect(first.unobserve).not.toHaveBeenCalled()
        expect(first.disconnect).toHaveBeenCalledOnce()

        // the same config now gets a fresh observer
        observe(el, createSubscriber())
        expect(observers).toHaveLength(2)
      })

      test('is a no-op for an element that is not observed', () => {
        const el = createElement()

        expect(() => {
          unobserve(el)
        }).not.toThrow()
        expect(observers).toHaveLength(0)
      })
    })
  })
})
