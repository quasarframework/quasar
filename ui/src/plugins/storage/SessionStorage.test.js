import {
  computed,
  effectScope,
  h,
  isReactive,
  isRef,
  nextTick,
  reactive,
  ref
} from 'vue'
import { describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import SessionStorage from './SessionStorage.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { SessionStorage } })

describe('[SessionStorage API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const {
        vm: { $q }
      } = mountPlugin()

      expect($q.sessionStorage).toBeDefined()
      expect($q.sessionStorage).toBeTypeOf('object')
      expect(Object.keys($q.sessionStorage)).not.toHaveLength(0)

      expect(SessionStorage).toMatchObject($q.sessionStorage)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)hasItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(SessionStorage.hasItem('has')).toBe(false)
        SessionStorage.setItem('has', 'rstoenescu')
        expect(SessionStorage.hasItem('has')).toBe(true)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.hasItem).toBe(SessionStorage.hasItem)
      })
    })

    describe('[(method)getLength]', () => {
      test('should be callable', () => {
        mountPlugin()

        const len = SessionStorage.getLength()
        expect(len).toBeTypeOf('number')

        SessionStorage.setItem('getLength', 0)
        expect(SessionStorage.getLength()).toBe(len + 1)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getLength).toBe(SessionStorage.getLength)
      })
    })

    describe('[(method)getItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(SessionStorage.getItem('getItem')).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getItem).toBe(SessionStorage.getItem)
      })
    })

    describe('[(method)getIndex]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getIndex', 'rstoenescu')

        expect(SessionStorage.getIndex(0)).$any([
          expect.any(Number),
          expect.any(Boolean),
          expect.any(Date),
          expect.any(RegExp),
          expect.any(Function),
          expect.any(Object),
          expect.any(Array),
          expect.any(String)
        ])
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getIndex).toBe(SessionStorage.getIndex)
      })
    })

    describe('[(method)getKey]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getKey', 'rstoenescu')

        expect(SessionStorage.getKey(0)).toBeTypeOf('string')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getKey).toBe(SessionStorage.getKey)
      })
    })

    describe('[(method)getAll]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getAll', 'rstoenescu')

        const result = SessionStorage.getAll()
        expect(result).toBeTypeOf('object')
        expect(Object.keys(result)).not.toHaveLength(0)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getAll).toBe(SessionStorage.getAll)
      })
    })

    describe('[(method)getAllKeys]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getAllKeys', 'rstoenescu')

        expect(Array.isArray(SessionStorage.getAllKeys())).toBe(true)

        expect(SessionStorage.getAllKeys()).toContain('getAllKeys')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.getAllKeys).toBe(SessionStorage.getAllKeys)
      })
    })

    describe('[(method)setItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(SessionStorage.setItem('set', 'rstoenescu')).toBeUndefined()

        expect(SessionStorage.getItem('set')).toBe('rstoenescu')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.setItem).toBe(SessionStorage.setItem)
      })

      test('can override value', () => {
        mountPlugin()

        expect(SessionStorage.setItem('set2', 'rstoenescu'))
        expect(SessionStorage.getItem('set2')).toBe('rstoenescu')

        expect(SessionStorage.setItem('set2', 'rstoenescu2'))
        expect(SessionStorage.getItem('set2')).toBe('rstoenescu2')
      })

      test('can encode + decode a Number', () => {
        mountPlugin()

        SessionStorage.setItem('Number', 123)
        expect(SessionStorage.getItem('Number')).toBe(123)
      })

      test('can encode + decode a Boolean', () => {
        mountPlugin()

        SessionStorage.setItem('Boolean', true)
        expect(SessionStorage.getItem('Boolean')).toBe(true)
      })

      test('can encode + decode a Date', () => {
        mountPlugin()
        const date = new Date()

        SessionStorage.setItem('Date', date)
        expect(SessionStorage.getItem('Date')).toStrictEqual(date)
      })

      test('can encode + decode a String', () => {
        mountPlugin()

        SessionStorage.setItem('String', 'rstoenescu')
        expect(SessionStorage.getItem('String')).toBe('rstoenescu')
      })

      test('can encode + decode a RegExp', () => {
        mountPlugin()

        SessionStorage.setItem('RegExp', /abc/)
        expect(SessionStorage.getItem('RegExp')).toStrictEqual(/abc/)

        SessionStorage.setItem('RegExp', /a\/b|c/gi)
        expect(SessionStorage.getItem('RegExp')).toStrictEqual(/a\/b|c/gi)
      })

      test('can decode a RegExp stored without flags by older versions', () => {
        mountPlugin()

        // the form written before the flags were kept
        window.sessionStorage.setItem('RegExp.legacy', '__q_expr|gi|x')
        expect(SessionStorage.getItem('RegExp.legacy')).toStrictEqual(/gi|x/)
      })

      test('removes the item for null and undefined', () => {
        mountPlugin()

        SessionStorage.setItem('null', 'rstoenescu')
        SessionStorage.setItem('null', null)
        expect(SessionStorage.hasItem('null')).toBe(false)

        SessionStorage.setItem('null', 'rstoenescu')
        SessionStorage.setItem('null', void 0)
        expect(SessionStorage.hasItem('null')).toBe(false)
      })

      test('can encode + decode a Function', () => {
        mountPlugin()
        const fn = () => 5

        SessionStorage.setItem('Function', fn)
        expect(SessionStorage.getItem('Function')).toBe(fn.toString())
      })

      test('can encode + decode an Object', () => {
        mountPlugin()
        const obj = { a: 1 }

        SessionStorage.setItem('Object', obj)
        expect(SessionStorage.getItem('Object')).toStrictEqual(obj)
      })

      test('can encode + decode an Array', () => {
        mountPlugin()
        const arr = [1, 2, 3]

        SessionStorage.setItem('Array', arr)
        expect(SessionStorage.getItem('Array')).toStrictEqual(arr)
      })
    })

    describe('[(method)removeItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        SessionStorage.setItem('remove', 5)
        expect(SessionStorage.getItem('remove')).toBe(5)

        expect(SessionStorage.removeItem('remove')).toBeUndefined()

        expect(SessionStorage.getItem('remove')).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.removeItem).toBe(SessionStorage.removeItem)
      })
    })

    describe('[(method)clear]', () => {
      test('should be callable', () => {
        mountPlugin()

        SessionStorage.setItem('clear', 5)
        expect(SessionStorage.getItem('clear')).toBe(5)

        expect(SessionStorage.clear()).toBeUndefined()

        expect(SessionStorage.getItem('clear')).toBeNull()
        expect(SessionStorage.getLength()).toBe(0)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.clear).toBe(SessionStorage.clear)
      })
    })

    describe('[(method)isEmpty]', () => {
      test('should be callable', () => {
        mountPlugin()

        SessionStorage.setItem('isEmpty', 5)
        expect(SessionStorage.getItem('isEmpty')).toBe(5)

        expect(SessionStorage.isEmpty()).toBe(false)

        SessionStorage.clear()

        expect(SessionStorage.isEmpty()).toBe(true)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.isEmpty).toBe(SessionStorage.isEmpty)
      })
    })

    describe('[(method)useItem]', () => {
      // a write behind the storage object's back stays unseen by a ref
      const writeBehind = (key, value) => {
        SessionStorage.setItem('useItem.encoded', value)
        window.sessionStorage.setItem(
          key,
          window.sessionStorage.getItem('useItem.encoded')
        )
      }

      test('should be callable', () => {
        mountPlugin()
        const theme = SessionStorage.useItem('useItem.callable')

        expect(isRef(theme)).toBe(true)
        expect(theme.stop).toBeTypeOf('function')
        expect(theme.value).toBeNull()
        theme.stop()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.useItem).toBe(SessionStorage.useItem)
      })

      test('reads the stored value', () => {
        mountPlugin()
        SessionStorage.setItem('useItem.stored', { a: [1] })

        const item = SessionStorage.useItem('useItem.stored')
        expect(item.value).toStrictEqual({ a: [1] })
      })

      test('persists an assignment right away and removes on null', () => {
        mountPlugin()
        const item = SessionStorage.useItem('useItem.assign')

        item.value = 5
        expect(SessionStorage.getItem('useItem.assign')).toBe(5)

        item.value = null
        expect(SessionStorage.hasItem('useItem.assign')).toBe(false)
        expect(item.value).toBeNull()
      })

      test('reads a value it does not encode back as the browser stores it', () => {
        mountPlugin()
        const item = SessionStorage.useItem('useItem.raw')

        item.value = 10n
        expect(SessionStorage.getItem('useItem.raw')).toBe('10')
        expect(item.value).toBe('10')

        const fn = () => 5
        item.value = fn
        expect(item.value).toBe(fn.toString())
      })

      test('stores the default of a missing item and keeps a stored value', () => {
        mountPlugin()

        const missing = SessionStorage.useItem('useItem.default', {
          default: 'light'
        })
        expect(missing.value).toBe('light')
        expect(SessionStorage.getItem('useItem.default')).toBe('light')

        SessionStorage.setItem('useItem.default', 'dark')
        const stored = SessionStorage.useItem('useItem.default', {
          default: 'light'
        })
        expect(stored.value).toBe('dark')
      })

      test('resets a removed item to its default', () => {
        mountPlugin()
        const theme = SessionStorage.useItem('useItem.reset', {
          default: 'light'
        })

        theme.value = 'dark'
        theme.value = null
        expect(theme.value).toBe('light')
        expect(SessionStorage.getItem('useItem.reset')).toBe('light')

        theme.value = 'dark'
        SessionStorage.removeItem('useItem.reset')
        expect(theme.value).toBe('light')
        expect(SessionStorage.getItem('useItem.reset')).toBe('light')

        theme.value = 'dark'
        SessionStorage.clear()
        expect(theme.value).toBe('light')
        expect(SessionStorage.getItem('useItem.reset')).toBe('light')
      })

      test('follows the other methods', () => {
        mountPlugin()
        const item = SessionStorage.useItem('useItem.follow')
        const doubled = computed(() => item.value * 2)

        SessionStorage.setItem('useItem.follow', 2)
        expect(doubled.value).toBe(4)

        SessionStorage.removeItem('useItem.follow')
        expect(item.value).toBeNull()

        SessionStorage.setItem('useItem.follow', 3)
        SessionStorage.clear()
        expect(item.value).toBeNull()
      })

      test('keeps two refs of the same item in step', async () => {
        mountPlugin()
        const first = SessionStorage.useItem('useItem.twin')
        const second = SessionStorage.useItem('useItem.twin')

        first.value = { count: 1 }
        expect(second.value).toStrictEqual({ count: 1 })

        second.value.count = 2
        await nextTick()
        expect(first.value.count).toBe(2)
        expect(SessionStorage.getItem('useItem.twin')).toStrictEqual({
          count: 2
        })
      })

      test('persists a nested change', async () => {
        mountPlugin()
        const settings = SessionStorage.useItem('useItem.nested', {
          default: { notifications: true, tags: ['a'] }
        })

        settings.value.notifications = false
        settings.value.tags.push('b')
        await nextTick()

        expect(SessionStorage.getItem('useItem.nested')).toStrictEqual({
          notifications: false,
          tags: ['a', 'b']
        })
      })

      test('hands out a plain value and ignores nested changes when not deep', async () => {
        mountPlugin()
        const settings = SessionStorage.useItem('useItem.shallow', {
          default: { notifications: true },
          deep: false
        })

        expect(isReactive(settings.value)).toBe(false)
        settings.value.notifications = false
        await nextTick()
        expect(SessionStorage.getItem('useItem.shallow')).toStrictEqual({
          notifications: true
        })

        settings.value = { notifications: false }
        expect(SessionStorage.getItem('useItem.shallow')).toStrictEqual({
          notifications: false
        })
      })

      test('does not write back what it got told about', async () => {
        mountPlugin()
        const item = SessionStorage.useItem('useItem.echo')

        SessionStorage.setItem('useItem.echo', { a: 1 })
        SessionStorage.removeItem('useItem.echo')
        await nextTick()
        expect(SessionStorage.hasItem('useItem.echo')).toBe(false)

        // the encoded form of a value, as another document would store it
        SessionStorage.setItem('useItem.echo.encoded', 'dark')
        const encoded = window.sessionStorage.getItem('useItem.echo.encoded')
        window.sessionStorage.setItem('useItem.echo', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.echo',
            newValue: encoded,
            storageArea: window.sessionStorage
          })
        )
        window.sessionStorage.removeItem('useItem.echo')
        await nextTick()
        expect(SessionStorage.hasItem('useItem.echo')).toBe(false)
        expect(item.value).toBe('dark')
      })

      test('follows a change made from another document', () => {
        mountPlugin()
        const theme = SessionStorage.useItem('useItem.event')
        expect(theme.value).toBeNull()

        // the encoded form of a value, as another document would store it
        SessionStorage.setItem('useItem.event.encoded', 'dark')
        const encoded = window.sessionStorage.getItem('useItem.event.encoded')

        window.sessionStorage.setItem('useItem.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: encoded,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBe('dark')

        window.sessionStorage.removeItem('useItem.event')
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: null,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBeNull()

        // another storage area is not this one
        window.sessionStorage.setItem('useItem.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: encoded,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBeNull()

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: null,
            newValue: null,
            storageArea: window.sessionStorage
          })
        )
      })

      test('is released with the component that created it', () => {
        SessionStorage.setItem('useItem.release', 'dark')
        let theme

        const wrapper = mount({
          setup() {
            theme = SessionStorage.useItem('useItem.release')
            return () => h('div', theme.value)
          }
        })
        expect(wrapper.text()).toBe('dark')

        wrapper.unmount()
        SessionStorage.setItem('useItem.release', 'light')
        expect(theme.value).toBe('dark')

        theme.value = 'system'
        expect(SessionStorage.getItem('useItem.release')).toBe('light')
      })

      test('is released with the scope that created it', () => {
        const scope = effectScope()
        const theme = scope.run(() => SessionStorage.useItem('useItem.scope'))

        SessionStorage.setItem('useItem.scope', 'dark')
        expect(theme.value).toBe('dark')

        scope.stop()
        SessionStorage.setItem('useItem.scope', 'light')
        expect(theme.value).toBe('dark')
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const theme = SessionStorage.useItem('useItem.outside')

        SessionStorage.setItem('useItem.outside', 'dark')
        expect(theme.value).toBe('dark')

        theme.stop()
        SessionStorage.setItem('useItem.outside', 'light')
        expect(theme.value).toBe('dark')

        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })

      test('keeps a store-held ref in step across the components using it', async () => {
        const store = effectScope()
        const theme = store.run(() =>
          SessionStorage.useItem('useItem.store', { default: 'light' })
        )
        const isDark = store.run(() => computed(() => theme.value === 'dark'))

        const first = mount({ render: () => h('div', String(isDark.value)) })
        expect(first.text()).toBe('false')
        first.unmount()

        SessionStorage.setItem('useItem.store', 'dark')
        const second = mount({ render: () => h('div', String(isDark.value)) })
        expect(second.text()).toBe('true')

        theme.value = 'light'
        await nextTick()
        expect(second.text()).toBe('false')

        second.unmount()
        store.stop()
      })

      test('detaches while disabled and attaches like a new ref once enabled', () => {
        mountPlugin()
        const disabled = ref(true)
        const theme = SessionStorage.useItem('useItem.disabled', {
          default: 'light',
          disabled
        })

        // a plain in-memory ref meanwhile
        expect(SessionStorage.hasItem('useItem.disabled')).toBe(false)
        theme.value = 'dark'
        expect(SessionStorage.hasItem('useItem.disabled')).toBe(false)
        SessionStorage.setItem('useItem.disabled', 'system')
        expect(theme.value).toBe('dark')

        // the stored value wins
        disabled.value = false
        return nextTick().then(async () => {
          expect(theme.value).toBe('system')

          disabled.value = true
          await nextTick()
          SessionStorage.removeItem('useItem.disabled')
          theme.value = 'dark'

          // the current value gets stored when the item is missing
          disabled.value = false
          await nextTick()
          expect(SessionStorage.getItem('useItem.disabled')).toBe('dark')
        })
      })

      test('reports a storage failure through onError', () => {
        mountPlugin()
        const errors = []
        const item = SessionStorage.useItem('useItem.error', {
          onError: err => {
            errors.push(err)
          }
        })

        const setItem = vi
          .spyOn(Storage.prototype, 'setItem')
          .mockImplementation(() => {
            throw new DOMException('quota', 'QuotaExceededError')
          })
        item.value = 'dark'
        setItem.mockRestore()

        expect(errors).toHaveLength(1)
        expect(errors[0].name).toBe('QuotaExceededError')
        expect(SessionStorage.hasItem('useItem.error')).toBe(false)

        // thrown without onError
        const plain = SessionStorage.useItem('useItem.error.plain')
        const throwing = vi
          .spyOn(Storage.prototype, 'setItem')
          .mockImplementation(() => {
            throw new DOMException('quota', 'QuotaExceededError')
          })
        expect(() => {
          plain.value = 'dark'
        }).toThrow('quota')
        throwing.mockRestore()
      })

      test('reports an undecodable stored value through onError', () => {
        mountPlugin()
        const errors = []

        writeBehind('useItem.decode', 'x')
        window.sessionStorage.setItem('useItem.decode', '__q_objt|{oops')
        const item = SessionStorage.useItem('useItem.decode', {
          default: 'light',
          onError: err => {
            errors.push(err)
          }
        })

        expect(errors).toHaveLength(1)
        expect(errors[0]).toBeInstanceOf(SyntaxError)
        expect(item.value).toBe('light')
      })

      test('is never wrapped by reactive()', () => {
        mountPlugin()
        const theme = SessionStorage.useItem('useItem.reactive')

        expect(reactive({ theme }).theme).toBeNull()
        theme.value = 'dark'
        expect(reactive({ theme }).theme).toBe('dark')
      })
    })
  })
})
