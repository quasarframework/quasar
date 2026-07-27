import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import Body, { getBodyClasses } from './Body.js'

const mountPlugin = () => mount({ template: '<div />' })

function getNativeMobilePlatform(
  is,
  config = {},
  nativeMobileWrapper = 'capacitor'
) {
  return getBodyClasses(
    {
      is: {
        desktop: false,
        mobile: true,
        ios: false,
        android: false,
        nativeMobile: true,
        nativeMobileWrapper,
        electron: false,
        bex: false,
        ...is
      },
      has: { touch: true },
      within: { iframe: false }
    },
    config
  )
}

describe('[Body API]', () => {
  describe('[Functions]', () => {
    describe('[(function)install]', () => {
      test('should be defined correctly', () => {
        expect(Body).toBeTypeOf('object')

        expect(Body.install).toBeTypeOf('function')
      })

      test('sets body classes', () => {
        mountPlugin()

        expect(document.body.getAttribute('class')).toBe(
          'desktop touch body--light'
        )
      })
    })

    describe('[(function)getBodyClasses]', () => {
      test.each(['capacitor', 'cordova'])(
        'enables safe area padding for Android %s apps',
        nativeMobileWrapper => {
          expect(
            getNativeMobilePlatform(
              { android: true },
              { [nativeMobileWrapper]: {} },
              nativeMobileWrapper
            )
          ).toContain('q-safe-area-padding')
        }
      )

      test('allows Android native mobile safe area padding to be disabled', () => {
        const classes = getNativeMobilePlatform(
          { android: true },
          { capacitor: { androidStatusBarPadding: false } }
        )

        expect(classes).not.toContain('q-safe-area-padding')
      })

      test('preserves the existing iOS padding class', () => {
        const classes = getNativeMobilePlatform({ ios: true })

        expect(classes).toContain('q-ios-padding')
        expect(classes).not.toContain('q-safe-area-padding')
      })
    })
  })
})
