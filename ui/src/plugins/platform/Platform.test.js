/**
 * Ignored specs:
 * [(method)parseSSR]
 */

import { h } from 'vue'
import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import Platform from './Platform.js'

const mountPlugin = () => mount({ render: () => h('div') })

let platformImportId = 0

async function loadPlatformForUserAgent(userAgent) {
  // The real "userAgent" getter lives on Navigator.prototype,
  // so shadow it with an own property on the instance
  Object.defineProperty(window.navigator, 'userAgent', {
    get: () => userAgent,
    configurable: true
  })

  try {
    // The browser caches ES modules ("vi.resetModules()" cannot help here),
    // so use a unique query string to force a fresh module evaluation
    const platformModule = await import(
      /* @vite-ignore */ `./Platform.js?userAgent=${++platformImportId}`
    )
    return platformModule.default
  } finally {
    delete window.navigator.userAgent
  }
}

describe('[Platform API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Platform).toBe(wrapper.vm.$q.platform)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)userAgent]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Platform.userAgent).toBeTypeOf('string')
      })

      test('preserves the original value while bounding platform detection', async () => {
        const userAgent = `${'x'.repeat(512)} firefox/123.0`
        const platform = await loadPlatformForUserAgent(userAgent)

        expect(platform.userAgent).toBe(userAgent)
        expect(platform.is.firefox).toBe(false)
      })

      test.each([42, [], {}])(
        'handles non-string User-Agent input',
        async userAgent => {
          const platform = await loadPlatformForUserAgent(userAgent)

          expect(platform.userAgent).toBe(userAgent)
          expect(platform.is.name).toBe('')
        }
      )
    })

    describe('[(prop)is]', () => {
      test('is correct type', () => {
        mountPlugin()

        const expected = {
          name: expect.any(String),
          platform: expect.any(String),
          version: expect.any(String),
          versionNumber: expect.any(Number),

          mobile: expect.any(Boolean),
          desktop: expect.any(Boolean),

          cordova: expect.any(Boolean),
          capacitor: expect.any(Boolean),
          nativeMobile: expect.any(Boolean),
          nativeMobileWrapper: expect.$any(['cordova', 'capacitor']),
          electron: expect.any(Boolean),
          bex: expect.any(Boolean),

          linux: expect.any(Boolean),
          mac: expect.any(Boolean),
          win: expect.any(Boolean),
          cros: expect.any(Boolean),

          chrome: expect.any(Boolean),
          firefox: expect.any(Boolean),
          opera: expect.any(Boolean),
          safari: expect.any(Boolean),
          vivaldi: expect.any(Boolean),
          edge: expect.any(Boolean),
          webkit: expect.any(Boolean),

          android: expect.any(Boolean),
          ios: expect.any(Boolean),
          ipad: expect.any(Boolean),
          iphone: expect.any(Boolean),
          ipod: expect.any(Boolean)
        }

        const actualKeys = Object.keys(Platform.is)

        expect(actualKeys).not.toHaveLength(0)

        expect(actualKeys).toSatisfy(keys =>
          keys.every(key => expected[key] !== void 0)
        )

        actualKeys.forEach(key => {
          expect(Platform.is[key]).toStrictEqual(expected[key])
        })
      })

      test('identifies Safari from independent browser tokens', async () => {
        const platform = await loadPlatformForUserAgent(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
            'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
            'Version/17.6 Safari/605.1.15'
        )

        expect(platform.is).toMatchObject({
          name: 'safari',
          safari: true,
          version: '17.6'
        })
      })

      test.each([
        'Version/17.6 Safari/605.1.15',
        'AppleWebKit/605.1.15 Safari/605.1.15',
        'AppleWebKit/605.1.15 Version/17.6'
      ])('rejects incomplete Safari signatures', async userAgent => {
        const platform = await loadPlatformForUserAgent(userAgent)

        expect(platform.is.safari).toBe(false)
      })

      test('detects Opera through its OPR token', async () => {
        const platform = await loadPlatformForUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0'
        )

        expect(platform.is).toMatchObject({
          name: 'opera',
          opera: true,
          version: '106.0.0.0'
        })
      })
    })

    describe('[(prop)has]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Platform.has).toStrictEqual({
          touch: expect.any(Boolean),
          webStorage: expect.any(Boolean)
        })
      })
    })

    describe('[(prop)within]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Platform.within).toStrictEqual({
          iframe: expect.any(Boolean)
        })
      })
    })
  })
})
