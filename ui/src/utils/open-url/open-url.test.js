import { afterEach, describe, expect, test, vi } from 'vitest'

import Platform from '../../plugins/platform/Platform.js'
import openUrl from './open-url.js'

const url = 'https://quasar.dev'

const platformOverrides = []

// Platform.is is a plain object shared with the "client" export,
// so overrides must be reverted after each test
function setPlatform(key, value) {
  platformOverrides.push([key, Platform.is[key]])
  Platform.is[key] = value
}

function mockWindowOpen(returnValue) {
  const win = returnValue === void 0 ? { focus: vi.fn() } : returnValue
  return vi.spyOn(window, 'open').mockImplementation(() => win)
}

function getFeatures(openSpy) {
  return openSpy.mock.calls[0][2].split(',')
}

afterEach(() => {
  let entry
  while ((entry = platformOverrides.pop()) !== void 0) {
    if (entry[1] === void 0) delete Platform.is[entry[0]]
    else Platform.is[entry[0]] = entry[1]
  }

  delete window.SafariViewController
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('[openUrl API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('opens the url in a new browsing context and returns it', () => {
        const win = { focus: vi.fn() }
        const openSpy = mockWindowOpen(win)

        expect(openUrl(url)).toBe(win)

        expect(openSpy).toHaveBeenCalledTimes(1)
        expect(openSpy.mock.calls[0][0]).toBe(url)
        expect(openSpy.mock.calls[0][1]).toBe('_blank')
      })

      test('applies "noopener" by default', () => {
        const openSpy = mockWindowOpen()

        openUrl(url)

        expect(getFeatures(openSpy)).toContain('noopener')
      })

      test('serializes boolean, numeric and string window features', () => {
        const openSpy = mockWindowOpen()

        openUrl(url, void 0, {
          noopener: true,
          menubar: false,
          width: 500,
          left: 0,
          status: 'yes',
          toolbar: ''
        })

        const features = getFeatures(openSpy)

        expect(features).toContain('noopener')
        expect(features).toContain('width=500')
        expect(features).toContain('left=0')
        expect(features).toContain('status=yes')
        // "false" and empty string values are dropped altogether
        expect(features).not.toContain('menubar')
        expect(features.some(feat => feat.startsWith('toolbar'))).toBe(false)
      })

      test('focuses the new window on desktop', () => {
        setPlatform('desktop', true)
        const win = { focus: vi.fn() }
        mockWindowOpen(win)

        openUrl(url)

        expect(win.focus).toHaveBeenCalledTimes(1)
      })

      test('does not focus the new window on non-desktop', () => {
        setPlatform('desktop', false)
        const win = { focus: vi.fn() }
        mockWindowOpen(win)

        openUrl(url)

        expect(win.focus).not.toHaveBeenCalled()
      })

      test('calls the reject handler when the popup is blocked', () => {
        mockWindowOpen(null)
        const reject = vi.fn()

        expect(openUrl(url, reject, { noopener: false })).toBeUndefined()
        expect(reject).toHaveBeenCalledTimes(1)
      })

      test('does not call the reject handler when "noopener"/"noreferrer" is in effect', () => {
        mockWindowOpen(null)
        const reject = vi.fn()

        // "noopener" makes window.open() return null even on success
        openUrl(url, reject)
        openUrl(url, reject, { noopener: false, noreferrer: true })

        expect(reject).not.toHaveBeenCalled()
      })

      test('does not throw when the popup is blocked and no reject handler is supplied', () => {
        mockWindowOpen(null)

        expect(() => openUrl(url, void 0, { noopener: false })).not.toThrow()
      })

      test('uses the Cordova InAppBrowser when available', () => {
        setPlatform('cordova', true)
        const win = { focus: vi.fn() }
        const open = vi.fn(() => win)
        vi.stubGlobal('cordova', { InAppBrowser: { open } })

        expect(openUrl(url)).toBe(win)
        expect(open.mock.calls[0][0]).toBe(url)
        expect(open.mock.calls[0][1]).toBe('_blank')
      })

      test('uses the Cordova app loader when InAppBrowser is missing', () => {
        setPlatform('cordova', true)
        vi.stubGlobal('cordova', {})
        const loadUrl = vi.fn(() => 'loaded')
        Object.defineProperty(navigator, 'app', {
          configurable: true,
          writable: true,
          value: { loadUrl }
        })

        try {
          expect(openUrl(url)).toBe('loaded')
          expect(loadUrl).toHaveBeenCalledWith(url, { openExternal: true })
        } finally {
          delete navigator.app
        }
      })

      test('delegates to SafariViewController on iOS when available', () => {
        setPlatform('ios', true)
        const openSpy = mockWindowOpen()
        const show = vi.fn()

        window.SafariViewController = {
          isAvailable: vi.fn(cb => cb(true)),
          show
        }

        expect(openUrl(url)).toBeUndefined()

        expect(show.mock.calls[0][0]).toStrictEqual({ url })
        expect(openSpy).not.toHaveBeenCalled()
      })

      test('falls back to a new window when SafariViewController is unavailable', () => {
        setPlatform('ios', true)
        const openSpy = mockWindowOpen()
        const show = vi.fn()

        window.SafariViewController = {
          isAvailable: vi.fn(cb => cb(false)),
          show
        }

        openUrl(url)

        expect(show).not.toHaveBeenCalled()
        expect(openSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
