import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import { listenOpts } from '../event/event.js'
import preventScroll from './prevent-scroll.js'

const forceScrollbarClasses = [
  'q-body--force-scrollbar-x',
  'q-body--force-scrollbar-y'
]

const restoreFns = []

afterEach(() => {
  // the module keeps an internal counter, so always end up unregistered
  preventScroll(false)

  restoreFns.splice(0).forEach(fn => fn())
  vi.restoreAllMocks()
  vi.useRealTimers()

  document.documentElement.classList.remove('q-document--prevent-scroll')
  document.body.classList.remove(...forceScrollbarClasses)
  document.body.removeAttribute('style')
})

/**
 * jsdom has no layout, so the properties the util reads are stubbed;
 * the undo is registered so the next test starts from a clean slate.
 */
function mockProperty(target, key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key)

  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value
  })

  restoreFns.push(() => {
    if (descriptor === void 0) delete target[key]
    else Object.defineProperty(target, key, descriptor)
  })
}

function mockPlatform(props) {
  Object.entries(props).forEach(([key, value]) => {
    const original = client.is[key]

    client.is[key] = value
    restoreFns.push(() => {
      client.is[key] = original
    })
  })
}

function mockVisualViewport() {
  const viewport = {
    height: 500,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }

  mockProperty(window, 'visualViewport', viewport)
  return viewport
}

function isPrevented() {
  return (
    document.documentElement.classList.contains('q-document--prevent-scroll') &&
    document.qScrollPrevented === true
  )
}

describe('[preventScroll API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('applies the prevention only once, for the outermost request', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

        preventScroll(true)
        expect(isPrevented()).toBe(true)

        preventScroll(true)
        expect(isPrevented()).toBe(true)

        // one registration is still active
        preventScroll(false)
        expect(isPrevented()).toBe(true)

        preventScroll(false)
        expect(isPrevented()).toBe(false)
      })

      test('ignores a removal when nothing is registered', () => {
        const scrollTo = vi
          .spyOn(window, 'scrollTo')
          .mockImplementation(() => {})

        preventScroll(false)

        expect(isPrevented()).toBe(false)
        expect(scrollTo).not.toHaveBeenCalled()
      })

      test('locks the body in place at the current scroll position', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        mockProperty(window, 'pageXOffset', 30)
        mockProperty(window, 'pageYOffset', 180)

        preventScroll(true)

        expect(document.body.style.left).toBe('-30px')
        expect(document.body.style.top).toBe('-180px')
      })

      test('restores the previous body offsets and scroll position', () => {
        const scrollTo = vi
          .spyOn(window, 'scrollTo')
          .mockImplementation(() => {})
        document.body.style.left = '5px'
        document.body.style.top = '10px'
        mockProperty(window, 'pageXOffset', 30)
        mockProperty(window, 'pageYOffset', 180)

        preventScroll(true)
        preventScroll(false)

        expect(document.body.style.left).toBe('5px')
        expect(document.body.style.top).toBe('10px')
        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(30, 180)
      })

      test('does not scroll back when the route changed meanwhile', () => {
        const scrollTo = vi
          .spyOn(window, 'scrollTo')
          .mockImplementation(() => {})
        const { pathname, search, hash } = window.location

        restoreFns.push(() => {
          window.history.replaceState({}, '', `${pathname}${search}${hash}`)
        })

        preventScroll(true)
        window.history.replaceState({}, '', '/some-other-route')
        preventScroll(false)

        expect(isPrevented()).toBe(false)
        expect(scrollTo).not.toHaveBeenCalled()
      })

      test.each([
        [
          'both axes',
          { scrollWidth: 5000, scrollHeight: 5000 },
          forceScrollbarClasses
        ],
        [
          'the vertical axis only',
          { scrollWidth: 0, scrollHeight: 5000 },
          ['q-body--force-scrollbar-y']
        ],
        ['neither axis', { scrollWidth: 0, scrollHeight: 0 }, []]
      ])('forces the scrollbar for %s', (_, sizes, expectedClasses) => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        Object.entries(sizes).forEach(([key, value]) =>
          mockProperty(document.body, key, value)
        )

        preventScroll(true)

        expect(
          forceScrollbarClasses.filter(cls =>
            document.body.classList.contains(cls)
          )
        ).toStrictEqual(expectedClasses)

        preventScroll(false)

        expect(
          forceScrollbarClasses.some(cls =>
            document.body.classList.contains(cls)
          )
        ).toBe(false)
      })

      test('keeps iOS scrollable through a scroll listener when there is no visual viewport', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        const addEventListener = vi.spyOn(window, 'addEventListener')
        const removeEventListener = vi.spyOn(window, 'removeEventListener')
        mockPlatform({ ios: true, nativeMobile: false })
        mockProperty(window, 'visualViewport', void 0)

        preventScroll(true)

        expect(addEventListener).toHaveBeenCalledExactlyOnceWith(
          'scroll',
          expect.any(Function),
          listenOpts.passiveCapture
        )

        const handler = addEventListener.mock.calls[0][1]

        preventScroll(false)

        expect(removeEventListener).toHaveBeenCalledExactlyOnceWith(
          'scroll',
          handler,
          listenOpts.passiveCapture
        )
      })

      test('watches the iOS visual viewport when it is available', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        mockPlatform({ ios: true, nativeMobile: false })
        const viewport = mockVisualViewport()

        preventScroll(true)

        expect(viewport.addEventListener.mock.calls).toStrictEqual([
          ['resize', expect.any(Function), listenOpts.passiveCapture],
          ['scroll', expect.any(Function), listenOpts.passiveCapture]
        ])

        const [[, resizeHandler], [, scrollHandler]] =
          viewport.addEventListener.mock.calls

        preventScroll(false)

        expect(viewport.removeEventListener.mock.calls).toStrictEqual([
          ['resize', resizeHandler, listenOpts.passiveCapture],
          ['scroll', scrollHandler, listenOpts.passiveCapture]
        ])
      })

      test('drags the iOS viewport back into view when it shrinks', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
          cb(0)
          return 0
        })
        mockPlatform({ ios: true, nativeMobile: false })

        const viewport = mockVisualViewport()

        // jsdom does not implement document.scrollingElement
        const scrollingElement = document.createElement('div')
        mockProperty(document, 'scrollingElement', scrollingElement)
        mockProperty(scrollingElement, 'clientHeight', 800)
        mockProperty(scrollingElement, 'scrollTop', 500)

        preventScroll(true)

        const resizeHandler = viewport.addEventListener.mock.calls[0][1]

        // maxScrollTop becomes 800 - 500 = 300, so the 500px scrollTop
        // gets pulled back by ceil((500 - 300) / 8)
        resizeHandler({ target: viewport })

        expect(scrollingElement.scrollTop).toBe(475)
      })

      test('defers the removal on native iOS and cancels it when re-requested', () => {
        vi.useFakeTimers()
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
        mockPlatform({ ios: true, nativeMobile: true })
        mockProperty(window, 'visualViewport', void 0)

        preventScroll(true)
        preventScroll(false)

        // not removed yet
        expect(isPrevented()).toBe(true)

        // a new request within the grace period cancels the removal
        preventScroll(true)
        vi.advanceTimersByTime(1000)

        expect(isPrevented()).toBe(true)

        preventScroll(false)
        expect(isPrevented()).toBe(true)

        vi.advanceTimersByTime(100)
        expect(isPrevented()).toBe(false)
      })
    })
  })
})
