import { computed, effectScope, h, isReactive, isRef, nextTick, ref } from 'vue'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Cookies, { getObject } from './Cookies.js'

const mountPlugin = () => mount({ render: () => h('div') })

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
  'q-test-remove',
  'q-test-use-callable',
  'q-test-use-stored',
  'q-test-use-assign',
  'q-test-use-number',
  'q-test-use-default',
  'q-test-use-reset',
  'q-test-use-follow',
  'q-test-use-twin',
  'q-test-use-nested',
  'q-test-use-shallow',
  'q-test-use-echo',
  'q-test-use-attrs',
  'q-test-use-store-event',
  'q-test-use-release',
  'q-test-use-scope',
  'q-test-use-outside',
  'q-test-use-disabled'
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

    describe('[(method)useCookie]', () => {
      test('should be callable', () => {
        mountPlugin()
        const theme = Cookies.useCookie('q-test-use-callable')

        expect(isRef(theme)).toBe(true)
        expect(theme.stop).toBeTypeOf('function')
        expect(theme.value).toBeNull()
        theme.stop()
      })

      test('matches $q API', () => {
        const wrapper = mountPlugin()
        expect(wrapper.vm.$q.cookies.useCookie).toBe(Cookies.useCookie)
      })

      test('reads the stored value', () => {
        mountPlugin()
        Cookies.set('q-test-use-stored', { a: [1] })

        const cookie = Cookies.useCookie('q-test-use-stored')
        expect(cookie.value).toStrictEqual({ a: [1] })
      })

      test('stores an assignment right away and removes on null', () => {
        mountPlugin()
        const cookie = Cookies.useCookie('q-test-use-assign')

        cookie.value = 'john'
        expect(Cookies.get('q-test-use-assign')).toBe('john')

        cookie.value = null
        expect(Cookies.has('q-test-use-assign')).toBe(false)
        expect(cookie.value).toBeNull()
      })

      test('reads a value back as the plugin does', () => {
        mountPlugin()
        const cookie = Cookies.useCookie('q-test-use-number')

        cookie.value = 5
        expect(Cookies.get('q-test-use-number')).toBe('5')
        expect(cookie.value).toBe('5')
      })

      test('stores the default of a missing cookie and keeps a stored value', () => {
        mountPlugin()

        const missing = Cookies.useCookie('q-test-use-default', {
          default: 'light'
        })
        expect(missing.value).toBe('light')
        expect(Cookies.get('q-test-use-default')).toBe('light')

        Cookies.set('q-test-use-default', 'dark')
        const stored = Cookies.useCookie('q-test-use-default', {
          default: 'light'
        })
        expect(stored.value).toBe('dark')
      })

      test('resets a removed cookie to its default', () => {
        mountPlugin()
        const theme = Cookies.useCookie('q-test-use-reset', {
          default: 'light'
        })

        theme.value = 'dark'
        theme.value = null
        expect(theme.value).toBe('light')
        expect(Cookies.get('q-test-use-reset')).toBe('light')

        theme.value = 'dark'
        Cookies.remove('q-test-use-reset')
        expect(theme.value).toBe('light')
        expect(Cookies.get('q-test-use-reset')).toBe('light')
      })

      test('follows set() and remove()', () => {
        mountPlugin()
        const cookie = Cookies.useCookie('q-test-use-follow')
        const upper = computed(() => cookie.value?.toUpperCase() ?? null)

        Cookies.set('q-test-use-follow', 'john')
        expect(upper.value).toBe('JOHN')

        Cookies.remove('q-test-use-follow')
        expect(upper.value).toBeNull()
      })

      test('keeps two refs of the same cookie in step', async () => {
        mountPlugin()
        const first = Cookies.useCookie('q-test-use-twin')
        const second = Cookies.useCookie('q-test-use-twin')

        first.value = { count: 1 }
        expect(second.value).toStrictEqual({ count: 1 })

        second.value.count = 2
        await nextTick()
        expect(first.value.count).toBe(2)
        expect(Cookies.get('q-test-use-twin')).toStrictEqual({ count: 2 })
      })

      test('stores a nested change', async () => {
        mountPlugin()
        const settings = Cookies.useCookie('q-test-use-nested', {
          default: { notifications: true, tags: ['a'] }
        })

        settings.value.notifications = false
        settings.value.tags.push('b')
        await nextTick()

        expect(Cookies.get('q-test-use-nested')).toStrictEqual({
          notifications: false,
          tags: ['a', 'b']
        })
      })

      test('hands out a plain value and ignores nested changes when not deep', async () => {
        mountPlugin()
        const settings = Cookies.useCookie('q-test-use-shallow', {
          default: { notifications: true },
          deep: false
        })

        expect(isReactive(settings.value)).toBe(false)
        settings.value.notifications = false
        await nextTick()
        expect(Cookies.get('q-test-use-shallow')).toStrictEqual({
          notifications: true
        })

        settings.value = { notifications: false }
        expect(Cookies.get('q-test-use-shallow')).toStrictEqual({
          notifications: false
        })
      })

      test('does not write back what it got told about', async () => {
        mountPlugin()
        const cookie = Cookies.useCookie('q-test-use-echo')

        Cookies.set('q-test-use-echo', { a: 1 })
        Cookies.remove('q-test-use-echo')
        await nextTick()
        expect(Cookies.has('q-test-use-echo')).toBe(false)
        expect(cookie.value).toBeNull()
      })

      test('writes and removes with the cookie options', () => {
        mountPlugin()
        const written = []
        const setter = vi
          .spyOn(Document.prototype, 'cookie', 'set')
          .mockImplementation(cookie => {
            written.push(cookie)
          })

        const cookie = Cookies.useCookie('q-test-use-attrs', {
          expires: '1d',
          path: '/',
          sameSite: 'Strict'
        })
        cookie.value = 'john'
        cookie.value = null
        setter.mockRestore()

        expect(written).toStrictEqual([
          'q-test-use-attrs=john; Max-Age=86400; Path=/; SameSite=Strict',
          'q-test-use-attrs=; Max-Age=-86400; Path=/; SameSite=Strict'
        ])
      })

      test('follows a change reported by the Cookie Store API', () => {
        mountPlugin()
        const theme = Cookies.useCookie('q-test-use-store-event')
        expect(theme.value).toBeNull()

        // as the browser reports a cookie set by the server or another tab
        window.cookieStore.dispatchEvent(
          new CookieChangeEvent('change', {
            changed: [{ name: 'q-test-use-store-event', value: 'dark' }]
          })
        )
        expect(theme.value).toBe('dark')

        window.cookieStore.dispatchEvent(
          new CookieChangeEvent('change', {
            deleted: [{ name: 'q-test-use-store-event' }]
          })
        )
        expect(theme.value).toBeNull()
      })

      test('is released with the component that created it', () => {
        Cookies.set('q-test-use-release', 'dark')
        let theme

        const wrapper = mount({
          setup() {
            theme = Cookies.useCookie('q-test-use-release')
            return () => h('div', theme.value)
          }
        })
        expect(wrapper.text()).toBe('dark')

        wrapper.unmount()
        Cookies.set('q-test-use-release', 'light')
        expect(theme.value).toBe('dark')

        theme.value = 'system'
        expect(Cookies.get('q-test-use-release')).toBe('light')
      })

      test('is released with the scope that created it', () => {
        const scope = effectScope()
        const theme = scope.run(() => Cookies.useCookie('q-test-use-scope'))

        Cookies.set('q-test-use-scope', 'dark')
        expect(theme.value).toBe('dark')

        scope.stop()
        Cookies.set('q-test-use-scope', 'light')
        expect(theme.value).toBe('dark')
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const theme = Cookies.useCookie('q-test-use-outside')

        Cookies.set('q-test-use-outside', 'dark')
        expect(theme.value).toBe('dark')

        theme.stop()
        Cookies.set('q-test-use-outside', 'light')
        expect(theme.value).toBe('dark')

        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })

      test('detaches while disabled and attaches like a new ref once enabled', async () => {
        mountPlugin()
        const disabled = ref(true)
        const theme = Cookies.useCookie('q-test-use-disabled', {
          default: 'light',
          disabled
        })

        // a plain in-memory ref meanwhile
        expect(Cookies.has('q-test-use-disabled')).toBe(false)
        theme.value = 'dark'
        expect(Cookies.has('q-test-use-disabled')).toBe(false)
        Cookies.set('q-test-use-disabled', 'system')
        expect(theme.value).toBe('dark')

        // the stored value wins
        disabled.value = false
        await nextTick()
        expect(theme.value).toBe('system')

        disabled.value = true
        await nextTick()
        Cookies.remove('q-test-use-disabled')
        theme.value = 'dark'

        // the current value gets stored when the cookie is missing
        disabled.value = false
        await nextTick()
        expect(Cookies.get('q-test-use-disabled')).toBe('dark')
      })

      test('reads the request cookie on the server and writes a header', () => {
        const ssrContext = {
          req: { headers: { cookie: 'userId=john12' } },
          res: { setHeader: vi.fn() }
        }
        const cookies = getObject(ssrContext)

        const userId = cookies.useCookie('userId')
        expect(userId.value).toBe('john12')

        // a missing cookie's default is left to the client
        const theme = cookies.useCookie('theme', { default: 'light' })
        expect(theme.value).toBe('light')
        expect(ssrContext.res.setHeader).not.toHaveBeenCalled()

        theme.value = 'dark'
        expect(ssrContext.res.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'theme=dark'
        ])
        expect(cookies.get('theme')).toBe('dark')
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
