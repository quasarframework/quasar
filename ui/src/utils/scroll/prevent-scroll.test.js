import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import { listenOpts } from '../event/event.js'
import preventScroll, {
  addPreventScrollReleaseListener,
  removePreventScrollReleaseListener
} from './prevent-scroll.js'

const lockClasses = [
  'q-document--prevent-scroll',
  'q-document--clip-scroll',
  'q-document--reserve-scrollbar',
  'q-document--pin-body'
]

const restoreFns = []

afterEach(() => {
  // the module keeps an internal counter, so always end up unregistered
  preventScroll(false)

  restoreFns.splice(0).forEach(fn => fn())
  vi.restoreAllMocks()
  vi.useRealTimers()

  document.documentElement.classList.remove(...lockClasses)
  document.body.removeAttribute('style')
})

/**
 * Overrides a property with a fixed value, then registers the undo so the
 * next test starts from a clean slate. Only used to force branches that real
 * browser state cannot produce, such as a missing window.visualViewport.
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

// observes the real visual viewport, so the handlers
// genuinely get attached to and detached from it
function spyVisualViewport() {
  return {
    addEventListener: vi.spyOn(window.visualViewport, 'addEventListener'),
    removeEventListener: vi.spyOn(window.visualViewport, 'removeEventListener')
  }
}

// gives the document real overflowing content, so window scrolling works;
// the undo removes the filler and resets the scroll position
function makeDocumentScrollable({ width = 3000, height = 3000 } = {}) {
  const filler = document.createElement('div')
  Object.assign(filler.style, {
    width: `${width}px`,
    height: `${height}px`
  })

  document.body.append(filler)

  restoreFns.push(() => {
    filler.remove()
    window.scrollTo(0, 0)
  })
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
        const scrollTo = vi.spyOn(window, 'scrollTo')

        preventScroll(false)

        expect(isPrevented()).toBe(false)
        expect(scrollTo).not.toHaveBeenCalled()
      })

      test('clips the viewport, leaving the page where it is', async () => {
        makeDocumentScrollable()
        window.scrollTo(30, 180)

        preventScroll(true)

        expect(
          document.documentElement.classList.contains('q-document--clip-scroll')
        ).toBe(true)

        // the page stays in the flow, so it keeps its scroll position and
        // needs no compensating body offsets -- that is what keeps
        // position: sticky content sticking while locked (#18183)
        expect(document.body.style.left).toBe('')
        expect(document.body.style.top).toBe('')

        // a body taken out of the flow only gets clamped to the top on the
        // next frames, so give the position the same window to prove that
        // nothing clamps it here
        await new Promise(resolve => {
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        })

        expect(window.scrollX).toBe(30)
        expect(window.scrollY).toBe(180)
      })

      test('pins the body at the current scroll position on iOS', () => {
        // iOS keeps panning a clipped page by touch, so there the body is
        // pinned instead and the offsets stand in for the lost scrolling
        mockPlatform({ ios: true, nativeMobile: false })
        makeDocumentScrollable()
        window.scrollTo(30, 180)

        preventScroll(true)

        expect(
          document.documentElement.classList.contains('q-document--pin-body')
        ).toBe(true)
        expect(document.body.style.left).toBe('-30px')
        expect(document.body.style.top).toBe('-180px')
      })

      test('restores the previous body offsets and scroll position', async () => {
        // only the pinned (iOS) lock can lose the position: the body leaves
        // the flow, so the browser clamps the page to the top
        mockPlatform({ ios: true, nativeMobile: false })
        makeDocumentScrollable()
        document.body.style.left = '5px'
        document.body.style.top = '10px'
        window.scrollTo(30, 180)

        preventScroll(true)

        // the browser clamps the locked (position: fixed) body's scroll
        // position to 0 asynchronously; the restore is only observable
        // once the position got genuinely lost
        await expect.poll(() => window.scrollY).toBe(0)

        // spied on only now: acquiring the lock scrolls the page itself
        // on iOS, and those calls are not the restore under test
        const scrollTo = vi.spyOn(window, 'scrollTo')

        preventScroll(false)

        expect(document.body.style.left).toBe('5px')
        expect(document.body.style.top).toBe('10px')
        expect(scrollTo).toHaveBeenCalledExactlyOnceWith(30, 180)
        expect(window.scrollX).toBe(30)
        expect(window.scrollY).toBe(180)
      })

      test('does not scroll back when the route changed meanwhile', () => {
        const scrollTo = vi.spyOn(window, 'scrollTo')
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

      test('reserves the gutter of a scrollbar that took up layout space', () => {
        makeDocumentScrollable()
        // the headless browser hides its scrollbars, so a classic one --
        // the only kind that shrinks the viewport -- has to be faked
        mockProperty(
          document.documentElement,
          'clientWidth',
          window.innerWidth - 15
        )

        preventScroll(true)

        expect(
          document.documentElement.classList.contains(
            'q-document--reserve-scrollbar'
          )
        ).toBe(true)

        preventScroll(false)

        expect(
          document.documentElement.classList.contains(
            'q-document--reserve-scrollbar'
          )
        ).toBe(false)
      })

      test('reserves no gutter when the scrollbar took up no space', () => {
        // overlay scrollbars leave the viewport width alone, so there is
        // nothing to reserve for them
        makeDocumentScrollable()
        mockProperty(document.documentElement, 'clientWidth', window.innerWidth)

        preventScroll(true)

        expect(
          document.documentElement.classList.contains(
            'q-document--reserve-scrollbar'
          )
        ).toBe(false)
      })

      test('watches the iOS visual viewport', () => {
        mockPlatform({ ios: true, nativeMobile: false })
        const viewport = spyVisualViewport()

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

      test('drags the iOS viewport back into view when it shrinks', async () => {
        // while the prevention is active the q-document--prevent-scroll CSS
        // fixes the body in place, so body content cannot provide the scroll
        // extent; size the root element itself to keep the document scrollable
        document.documentElement.style.minHeight = '3000px'
        restoreFns.push(() => {
          document.documentElement.style.minHeight = ''
          window.scrollTo(0, 0)
        })

        mockPlatform({ ios: true, nativeMobile: false })

        const viewport = spyVisualViewport()

        preventScroll(true)

        const scrollingElement = document.scrollingElement
        scrollingElement.scrollTop = 500

        const resizeHandler = viewport.addEventListener.mock.calls[0][1]

        // the visual viewport of a headless run cannot really shrink, so the
        // handler is fed a crafted resize payload: maxScrollTop becomes
        // 800 (clientHeight) - 500 = 300, and the 500px scrollTop gets
        // pulled back by ceil((500 - 300) / 8)
        resizeHandler({ target: { height: 500, scale: 1 } })

        await vi.waitFor(() => {
          expect(scrollingElement.scrollTop).toBe(475)
        })
      })

      test('stops correcting the iOS scroll position while the viewport is zoomed', async () => {
        document.documentElement.style.minHeight = '3000px'
        restoreFns.push(() => {
          document.documentElement.style.minHeight = ''
          window.scrollTo(0, 0)
        })

        mockPlatform({ ios: true, nativeMobile: false })

        const viewport = spyVisualViewport()

        preventScroll(true)

        const scrollingElement = document.scrollingElement
        scrollingElement.scrollTop = 500

        const resizeHandler = viewport.addEventListener.mock.calls[0][1]

        // a shrunken viewport that is shrunken because it is zoomed in:
        // correcting the scroll position would emit another visual viewport
        // event, which would correct it again, and the page would never settle
        resizeHandler({ target: { height: 500, scale: 2 } })

        // the handler defers to an animation frame, so give it two of them
        // before concluding that it left the scroll position alone
        await new Promise(resolve => {
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        })

        expect(scrollingElement.scrollTop).toBe(500)

        // the very same viewport height is still corrected once unzoomed,
        // so it is the zoom that suppresses it and not the payload
        resizeHandler({ target: { height: 500, scale: 1 } })

        await vi.waitFor(() => {
          expect(scrollingElement.scrollTop).toBeLessThan(500)
        })
      })

      test('defers the removal on native iOS and cancels it when re-requested', () => {
        vi.useFakeTimers()
        mockPlatform({ ios: true, nativeMobile: true })

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

    describe('[(function)addPreventScrollReleaseListener]', () => {
      test('notifies when the lock releases without restoring the scroll position', () => {
        const listener = vi.fn()
        const { pathname, search, hash } = window.location

        restoreFns.push(() => {
          removePreventScrollReleaseListener(listener)
          window.history.replaceState({}, '', `${pathname}${search}${hash}`)
        })

        addPreventScrollReleaseListener(listener)

        preventScroll(true)
        expect(listener).not.toHaveBeenCalled()

        window.history.replaceState({}, '', '/some-other-route')
        preventScroll(false)

        expect(listener).toHaveBeenCalledOnce()
      })

      test('does not notify when the restore emits a scroll event', async () => {
        // the pinned (iOS) lock is the one that loses the position and so
        // has one to scroll back to on release
        mockPlatform({ ios: true, nativeMobile: false })
        makeDocumentScrollable()
        window.scrollTo(30, 180)

        const listener = vi.fn()

        restoreFns.push(() => {
          removePreventScrollReleaseListener(listener)
        })

        addPreventScrollReleaseListener(listener)

        preventScroll(true)

        // wait for the browser to clamp the locked page to 0, so that
        // the release genuinely has a position to scroll back to
        await expect.poll(() => window.scrollY).toBe(0)

        preventScroll(false)

        // the page sat away from the top, so the restoring scrollTo emits
        // a scroll event and consumers re-sync through that instead
        expect(listener).not.toHaveBeenCalled()
        expect(window.scrollY).toBe(180)
      })

      test('notifies when the release lands on the saved scroll position', () => {
        // the page is at top when the lock engages, so the restoring
        // scrollTo is a no-op that emits no scroll event: the listeners
        // are the only release signal (#18520)
        const listener = vi.fn()

        restoreFns.push(() => {
          removePreventScrollReleaseListener(listener)
        })

        addPreventScrollReleaseListener(listener)

        preventScroll(true)
        expect(listener).not.toHaveBeenCalled()

        preventScroll(false)
        expect(listener).toHaveBeenCalledOnce()
      })
    })

    describe('[(function)removePreventScrollReleaseListener]', () => {
      test('stops notifying a removed listener', () => {
        const listener = vi.fn()
        const { pathname, search, hash } = window.location

        restoreFns.push(() => {
          window.history.replaceState({}, '', `${pathname}${search}${hash}`)
        })

        addPreventScrollReleaseListener(listener)
        removePreventScrollReleaseListener(listener)

        preventScroll(true)
        window.history.replaceState({}, '', '/some-other-route')
        preventScroll(false)

        expect(listener).not.toHaveBeenCalled()
      })
    })
  })
})
