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

import LocalStorage from './LocalStorage.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { LocalStorage } })

describe('[LocalStorage API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const {
        vm: { $q }
      } = mountPlugin()

      expect($q.localStorage).toBeDefined()
      expect($q.localStorage).toBeTypeOf('object')
      expect(Object.keys($q.localStorage)).not.toHaveLength(0)

      expect(LocalStorage).toMatchObject($q.localStorage)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)hasItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(LocalStorage.hasItem('has')).toBe(false)
        LocalStorage.setItem('has', 'rstoenescu')
        expect(LocalStorage.hasItem('has')).toBe(true)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.hasItem).toBe(LocalStorage.hasItem)
      })
    })

    describe('[(method)getLength]', () => {
      test('should be callable', () => {
        mountPlugin()

        const len = LocalStorage.getLength()
        expect(len).toBeTypeOf('number')

        LocalStorage.setItem('getLength', 0)
        expect(LocalStorage.getLength()).toBe(len + 1)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.getLength).toBe(LocalStorage.getLength)
      })
    })

    describe('[(method)getItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(LocalStorage.getItem('getItem')).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.getItem).toBe(LocalStorage.getItem)
      })
    })

    describe('[(method)getIndex]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.setItem('getIndex', 'rstoenescu')

        expect(LocalStorage.getIndex(0)).$any([
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
        expect($q.localStorage.getIndex).toBe(LocalStorage.getIndex)
      })
    })

    describe('[(method)getKey]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.setItem('getKey', 'rstoenescu')

        expect(LocalStorage.getKey(0)).toBeTypeOf('string')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.getKey).toBe(LocalStorage.getKey)
      })
    })

    describe('[(method)getAll]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.setItem('getAll', 'rstoenescu')

        const result = LocalStorage.getAll()
        expect(result).toBeTypeOf('object')
        expect(Object.keys(result)).not.toHaveLength(0)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.getAll).toBe(LocalStorage.getAll)
      })
    })

    describe('[(method)getAllKeys]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.setItem('getAllKeys', 'rstoenescu')

        expect(Array.isArray(LocalStorage.getAllKeys())).toBe(true)

        expect(LocalStorage.getAllKeys()).toContain('getAllKeys')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.getAllKeys).toBe(LocalStorage.getAllKeys)
      })
    })

    describe('[(method)setItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(LocalStorage.setItem('set', 'rstoenescu')).toBeUndefined()

        expect(LocalStorage.getItem('set')).toBe('rstoenescu')
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.setItem).toBe(LocalStorage.setItem)
      })

      test('can override value', () => {
        mountPlugin()

        expect(LocalStorage.setItem('set2', 'rstoenescu'))
        expect(LocalStorage.getItem('set2')).toBe('rstoenescu')

        expect(LocalStorage.setItem('set2', 'rstoenescu2'))
        expect(LocalStorage.getItem('set2')).toBe('rstoenescu2')
      })

      test('can encode + decode a Number', () => {
        mountPlugin()

        LocalStorage.setItem('Number', 123)
        expect(LocalStorage.getItem('Number')).toBe(123)
      })

      test('can encode + decode a Boolean', () => {
        mountPlugin()

        LocalStorage.setItem('Boolean', true)
        expect(LocalStorage.getItem('Boolean')).toBe(true)
      })

      test('can encode + decode a Date', () => {
        mountPlugin()
        const date = new Date()

        LocalStorage.setItem('Date', date)
        expect(LocalStorage.getItem('Date')).toStrictEqual(date)
      })

      test('can encode + decode a String', () => {
        mountPlugin()

        LocalStorage.setItem('String', 'rstoenescu')
        expect(LocalStorage.getItem('String')).toBe('rstoenescu')
      })

      test('can encode + decode a RegExp', () => {
        mountPlugin()

        LocalStorage.setItem('RegExp', /abc/)
        expect(LocalStorage.getItem('RegExp')).toStrictEqual(/abc/)

        LocalStorage.setItem('RegExp', /a\/b|c/gi)
        expect(LocalStorage.getItem('RegExp')).toStrictEqual(/a\/b|c/gi)
      })

      test('can decode a RegExp stored without flags by older versions', () => {
        mountPlugin()

        // the form written before the flags were kept
        window.localStorage.setItem('RegExp.legacy', '__q_expr|gi|x')
        expect(LocalStorage.getItem('RegExp.legacy')).toStrictEqual(/gi|x/)
      })

      test('removes the item for null and undefined', () => {
        mountPlugin()

        LocalStorage.setItem('null', 'rstoenescu')
        LocalStorage.setItem('null', null)
        expect(LocalStorage.hasItem('null')).toBe(false)

        LocalStorage.setItem('null', 'rstoenescu')
        LocalStorage.setItem('null', void 0)
        expect(LocalStorage.hasItem('null')).toBe(false)
      })

      test('can encode + decode a Function', () => {
        mountPlugin()
        const fn = () => 5

        LocalStorage.setItem('Function', fn)
        expect(LocalStorage.getItem('Function')).toBe(fn.toString())
      })

      test('can encode + decode an Object', () => {
        mountPlugin()
        const obj = { a: 1 }

        LocalStorage.setItem('Object', obj)
        expect(LocalStorage.getItem('Object')).toStrictEqual(obj)
      })

      test('can encode + decode an Array', () => {
        mountPlugin()
        const arr = [1, 2, 3]

        LocalStorage.setItem('Array', arr)
        expect(LocalStorage.getItem('Array')).toStrictEqual(arr)
      })
    })

    describe('[(method)removeItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.setItem('remove', 5)
        expect(LocalStorage.getItem('remove')).toBe(5)

        expect(LocalStorage.removeItem('remove')).toBeUndefined()

        expect(LocalStorage.getItem('remove')).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.removeItem).toBe(LocalStorage.removeItem)
      })
    })

    describe('[(method)clear]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.setItem('clear', 5)
        expect(LocalStorage.getItem('clear')).toBe(5)

        expect(LocalStorage.clear()).toBeUndefined()

        expect(LocalStorage.getItem('clear')).toBeNull()
        expect(LocalStorage.getLength()).toBe(0)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.clear).toBe(LocalStorage.clear)
      })
    })

    describe('[(method)isEmpty]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.setItem('isEmpty', 5)
        expect(LocalStorage.getItem('isEmpty')).toBe(5)

        expect(LocalStorage.isEmpty()).toBe(false)

        LocalStorage.clear()

        expect(LocalStorage.isEmpty()).toBe(true)
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.isEmpty).toBe(LocalStorage.isEmpty)
      })
    })

    describe('[(method)useItem]', () => {
      // a write behind the storage object's back stays unseen by a ref
      const writeBehind = (key, value) => {
        LocalStorage.setItem('useItem.encoded', value)
        window.localStorage.setItem(
          key,
          window.localStorage.getItem('useItem.encoded')
        )
      }

      test('should be callable', () => {
        mountPlugin()
        const theme = LocalStorage.useItem('useItem.callable')

        expect(isRef(theme)).toBe(true)
        expect(theme.stop).toBeTypeOf('function')
        expect(theme.value).toBeNull()
        theme.stop()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.useItem).toBe(LocalStorage.useItem)
      })

      test('reads the stored value', () => {
        mountPlugin()
        LocalStorage.setItem('useItem.stored', { a: [1] })

        const item = LocalStorage.useItem('useItem.stored')
        expect(item.value).toStrictEqual({ a: [1] })
      })

      test('persists an assignment right away and removes on null', () => {
        mountPlugin()
        const item = LocalStorage.useItem('useItem.assign')

        item.value = 5
        expect(LocalStorage.getItem('useItem.assign')).toBe(5)

        item.value = null
        expect(LocalStorage.hasItem('useItem.assign')).toBe(false)
        expect(item.value).toBeNull()
      })

      test('reads a value it does not encode back as the browser stores it', () => {
        mountPlugin()
        const item = LocalStorage.useItem('useItem.raw')

        item.value = 10n
        expect(LocalStorage.getItem('useItem.raw')).toBe('10')
        expect(item.value).toBe('10')

        const fn = () => 5
        item.value = fn
        expect(item.value).toBe(fn.toString())
      })

      test('stores the default of a missing item and keeps a stored value', () => {
        mountPlugin()

        const missing = LocalStorage.useItem('useItem.default', {
          default: 'light'
        })
        expect(missing.value).toBe('light')
        expect(LocalStorage.getItem('useItem.default')).toBe('light')

        LocalStorage.setItem('useItem.default', 'dark')
        const stored = LocalStorage.useItem('useItem.default', {
          default: 'light'
        })
        expect(stored.value).toBe('dark')
      })

      test('resets a removed item to its default', () => {
        mountPlugin()
        const theme = LocalStorage.useItem('useItem.reset', {
          default: 'light'
        })

        theme.value = 'dark'
        theme.value = null
        expect(theme.value).toBe('light')
        expect(LocalStorage.getItem('useItem.reset')).toBe('light')

        theme.value = 'dark'
        LocalStorage.removeItem('useItem.reset')
        expect(theme.value).toBe('light')
        expect(LocalStorage.getItem('useItem.reset')).toBe('light')

        theme.value = 'dark'
        LocalStorage.clear()
        expect(theme.value).toBe('light')
        expect(LocalStorage.getItem('useItem.reset')).toBe('light')
      })

      test('follows the other methods', () => {
        mountPlugin()
        const item = LocalStorage.useItem('useItem.follow')
        const doubled = computed(() => item.value * 2)

        LocalStorage.setItem('useItem.follow', 2)
        expect(doubled.value).toBe(4)

        LocalStorage.removeItem('useItem.follow')
        expect(item.value).toBeNull()

        LocalStorage.setItem('useItem.follow', 3)
        LocalStorage.clear()
        expect(item.value).toBeNull()
      })

      test('keeps two refs of the same item in step', async () => {
        mountPlugin()
        const first = LocalStorage.useItem('useItem.twin')
        const second = LocalStorage.useItem('useItem.twin')

        first.value = { count: 1 }
        expect(second.value).toStrictEqual({ count: 1 })

        second.value.count = 2
        await nextTick()
        expect(first.value.count).toBe(2)
        expect(LocalStorage.getItem('useItem.twin')).toStrictEqual({
          count: 2
        })
      })

      test('persists a nested change', async () => {
        mountPlugin()
        const settings = LocalStorage.useItem('useItem.nested', {
          default: { notifications: true, tags: ['a'] }
        })

        settings.value.notifications = false
        settings.value.tags.push('b')
        await nextTick()

        expect(LocalStorage.getItem('useItem.nested')).toStrictEqual({
          notifications: false,
          tags: ['a', 'b']
        })
      })

      test('hands out a plain value and ignores nested changes when not deep', async () => {
        mountPlugin()
        const settings = LocalStorage.useItem('useItem.shallow', {
          default: { notifications: true },
          deep: false
        })

        expect(isReactive(settings.value)).toBe(false)
        settings.value.notifications = false
        await nextTick()
        expect(LocalStorage.getItem('useItem.shallow')).toStrictEqual({
          notifications: true
        })

        settings.value = { notifications: false }
        expect(LocalStorage.getItem('useItem.shallow')).toStrictEqual({
          notifications: false
        })
      })

      test('does not write back what it got told about', async () => {
        mountPlugin()
        const item = LocalStorage.useItem('useItem.echo')

        LocalStorage.setItem('useItem.echo', { a: 1 })
        LocalStorage.removeItem('useItem.echo')
        await nextTick()
        expect(LocalStorage.hasItem('useItem.echo')).toBe(false)

        // the encoded form of a value, as another document would store it
        LocalStorage.setItem('useItem.echo.encoded', 'dark')
        const encoded = window.localStorage.getItem('useItem.echo.encoded')
        window.localStorage.setItem('useItem.echo', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.echo',
            newValue: encoded,
            storageArea: window.localStorage
          })
        )
        window.localStorage.removeItem('useItem.echo')
        await nextTick()
        expect(LocalStorage.hasItem('useItem.echo')).toBe(false)
        expect(item.value).toBe('dark')
      })

      test('follows a change made from another document', () => {
        mountPlugin()
        const theme = LocalStorage.useItem('useItem.event')
        expect(theme.value).toBeNull()

        // the encoded form of a value, as another document would store it
        LocalStorage.setItem('useItem.event.encoded', 'dark')
        const encoded = window.localStorage.getItem('useItem.event.encoded')

        window.localStorage.setItem('useItem.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: encoded,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBe('dark')

        window.localStorage.removeItem('useItem.event')
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: null,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBeNull()

        // another storage area is not this one
        window.localStorage.setItem('useItem.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'useItem.event',
            newValue: encoded,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBeNull()

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: null,
            newValue: null,
            storageArea: window.localStorage
          })
        )
      })

      test('is released with the component that created it', () => {
        LocalStorage.setItem('useItem.release', 'dark')
        let theme

        const wrapper = mount({
          setup() {
            theme = LocalStorage.useItem('useItem.release')
            return () => h('div', theme.value)
          }
        })
        expect(wrapper.text()).toBe('dark')

        wrapper.unmount()
        LocalStorage.setItem('useItem.release', 'light')
        expect(theme.value).toBe('dark')

        theme.value = 'system'
        expect(LocalStorage.getItem('useItem.release')).toBe('light')
      })

      test('is released with the scope that created it', () => {
        const scope = effectScope()
        const theme = scope.run(() => LocalStorage.useItem('useItem.scope'))

        LocalStorage.setItem('useItem.scope', 'dark')
        expect(theme.value).toBe('dark')

        scope.stop()
        LocalStorage.setItem('useItem.scope', 'light')
        expect(theme.value).toBe('dark')
      })

      test('works outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const theme = LocalStorage.useItem('useItem.outside')

        LocalStorage.setItem('useItem.outside', 'dark')
        expect(theme.value).toBe('dark')

        theme.stop()
        LocalStorage.setItem('useItem.outside', 'light')
        expect(theme.value).toBe('dark')

        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })

      test('keeps a store-held ref in step across the components using it', async () => {
        const store = effectScope()
        const theme = store.run(() =>
          LocalStorage.useItem('useItem.store', { default: 'light' })
        )
        const isDark = store.run(() => computed(() => theme.value === 'dark'))

        const first = mount({ render: () => h('div', String(isDark.value)) })
        expect(first.text()).toBe('false')
        first.unmount()

        LocalStorage.setItem('useItem.store', 'dark')
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
        const theme = LocalStorage.useItem('useItem.disabled', {
          default: 'light',
          disabled
        })

        // a plain in-memory ref meanwhile
        expect(LocalStorage.hasItem('useItem.disabled')).toBe(false)
        theme.value = 'dark'
        expect(LocalStorage.hasItem('useItem.disabled')).toBe(false)
        LocalStorage.setItem('useItem.disabled', 'system')
        expect(theme.value).toBe('dark')

        // the stored value wins
        disabled.value = false
        return nextTick().then(async () => {
          expect(theme.value).toBe('system')

          disabled.value = true
          await nextTick()
          LocalStorage.removeItem('useItem.disabled')
          theme.value = 'dark'

          // the current value gets stored when the item is missing
          disabled.value = false
          await nextTick()
          expect(LocalStorage.getItem('useItem.disabled')).toBe('dark')
        })
      })

      test('reports a storage failure through onError', () => {
        mountPlugin()
        const errors = []
        const item = LocalStorage.useItem('useItem.error', {
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
        expect(LocalStorage.hasItem('useItem.error')).toBe(false)

        // thrown without onError
        const plain = LocalStorage.useItem('useItem.error.plain')
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
        window.localStorage.setItem('useItem.decode', '__q_objt|{oops')
        const item = LocalStorage.useItem('useItem.decode', {
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
        const theme = LocalStorage.useItem('useItem.reactive')

        expect(reactive({ theme }).theme).toBeNull()
        theme.value = 'dark'
        expect(reactive({ theme }).theme).toBe('dark')
      })
    })
  })
})
