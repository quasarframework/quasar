/**
 * Ignored specs:
 * [(method)parseSSR]
 */

import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Platform from './Platform.js'

const mountPlugin = () => mount({ template: '<div />' })

async function loadPlatformForUserAgent(userAgent) {
  const userAgentGetter = vi
    .spyOn(window.navigator, 'userAgent', 'get')
    .mockReturnValue(userAgent)

  vi.resetModules()

  try {
    const platformModule = await import('./Platform.js')
    return platformModule.default
  } finally {
    userAgentGetter.mockRestore()
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
          edgeChromium: expect.any(Boolean),
          ie: expect.any(Boolean),
          webkit: expect.any(Boolean),

          android: expect.any(Boolean),
          ios: expect.any(Boolean),
          ipad: expect.any(Boolean),
          iphone: expect.any(Boolean),
          ipod: expect.any(Boolean),
          kindle: expect.any(Boolean),
          winphone: expect.any(Boolean),
          silk: expect.any(Boolean)
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

      test.each([
        [
          'uses the explicit Opera version',
          'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18',
          '12.18'
        ],
        [
          'falls back to the Opera token version',
          'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388',
          '9.80'
        ]
      ])('%s', async (_, userAgent, version) => {
        const platform = await loadPlatformForUserAgent(userAgent)

        expect(platform.is).toMatchObject({
          name: 'opera',
          opera: true,
          version
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
