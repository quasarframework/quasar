/**
 * Ignored specs:
 * [(method)parseSSR]
 */

import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Platform from './Platform.js'

const mountPlugin = () => mount({ template: '<div />' })

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
    })

    describe('[(prop)is]', () => {
      test('is correct type', () => {
        mountPlugin()

        const expected = {
          name: expect.any(String),
          platform: expect.any(String),
          version: expect.any(String),
          versionNumber: expect.any(Number),
          desktop: expect.any(Boolean),
          mobile: expect.any(Boolean),
          electron: expect.any(Boolean),
          bex: expect.any(Boolean),
          capacitor: expect.any(Boolean),
          cordova: expect.any(Boolean),
          nativeMobile: expect.any(Boolean),
          nativeMobileWrapper: expect.$any([
            'cordova',
            'capacitor'
          ]),
          webkit: expect.any(Boolean),
          chrome: expect.any(Boolean),
          firefox: expect.any(Boolean),
          safari: expect.any(Boolean),
          edgeChromium: expect.any(Boolean),
          edge: expect.any(Boolean),
          opera: expect.any(Boolean),
          vivaldi: expect.any(Boolean),
          win: expect.any(Boolean),
          linux: expect.any(Boolean),
          mac: expect.any(Boolean),
          cros: expect.any(Boolean),
          android: expect.any(Boolean),
          ios: expect.any(Boolean),
          winphone: expect.any(Boolean),
          iphone: expect.any(Boolean),
          ipad: expect.any(Boolean),
          ipod: expect.any(Boolean),
          kindle: expect.any(Boolean),
          silk: expect.any(Boolean)
        }

        const actualKeys = Object.keys(Platform.is)

        expect(actualKeys).not.toHaveLength(0)

        expect(actualKeys).toSatisfy(
          keys => keys.every(key => expected[ key ] !== void 0)
        )

        actualKeys.forEach(key => {
          expect(Platform.is[ key ]).toStrictEqual(expected[ key ])
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
