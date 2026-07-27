import { afterEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Cookies, { getObject } from './Cookies.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { Cookies } })

const cookieNames = [
  'q-test-get',
  'q-test-get-all',
  'q-test-set',
  'q-test-has',
  'q-test-remove'
]

afterEach(() => {
  cookieNames.forEach(name => {
    Cookies.remove(name)
  })
})

describe('[Cookies API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(wrapper.vm.$q.cookies).toBe(Cookies)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)get]', () => {
      test('should be callable', () => {
        mountPlugin()

        Cookies.set('q-test-get', { user: 'john' })

        expect(Cookies.get('q-test-get')).toStrictEqual({ user: 'john' })
        expect(Cookies.get('q-test-missing')).toBe(null)
      })
    })

    describe('[(method)getAll]', () => {
      test('should be callable', () => {
        mountPlugin()

        Cookies.set('q-test-get-all', 'value')

        expect(Cookies.getAll()).toMatchObject({
          'q-test-get-all': 'value'
        })
      })
    })

    describe('[(method)set]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(
          Cookies.set('q-test-set', ['one', 'two'], {
            sameSite: 'Lax'
          })
        ).toBeUndefined()

        expect(Cookies.get('q-test-set')).toStrictEqual(['one', 'two'])
      })
    })

    describe('[(method)has]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(Cookies.has('q-test-has')).toBe(false)

        Cookies.set('q-test-has', 'present')

        expect(Cookies.has('q-test-has')).toBe(true)
      })
    })

    describe('[(method)remove]', () => {
      test('should be callable', () => {
        mountPlugin()

        Cookies.set('q-test-remove', 'present')
        expect(Cookies.has('q-test-remove')).toBe(true)

        expect(Cookies.remove('q-test-remove')).toBeUndefined()
        expect(Cookies.has('q-test-remove')).toBe(false)
      })
    })

    describe('[(method)parseSSR]', () => {
      test('should be callable', () => {
        mountPlugin()
        const ssrContext = {
          req: {
            headers: {
              cookie: 'userId=john12'
            }
          },
          res: {
            setHeader: vi.fn()
          }
        }
        // parseSSR() delegates to getObject() and is only attached to the
        // public plugin in SSR builds.
        const cookies = getObject(ssrContext)

        expect(cookies.get('userId')).toBe('john12')

        cookies.set('theme', 'dark')

        expect(ssrContext.res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'theme=dark'
        ])
        expect(ssrContext.req.headers.cookie).toBe('theme=dark; userId=john12')
      })

      test('ignores malformed cookie encoding', () => {
        const cookies = getObject({
          req: {
            headers: {
              cookie: 'broken=%E0%A4%A'
            }
          },
          res: {
            setHeader: vi.fn()
          }
        })

        expect(cookies.get('broken')).toBe(null)
      })
    })
  })
})
