import {
  computed,
  effectScope,
  h,
  isRef,
  nextTick,
  onUnmounted,
  reactive,
  toRef
} from 'vue'
import { describe, expect, test } from 'vitest'
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

      test('stores null and undefined as the strings the browser makes of them', () => {
        mountPlugin()

        LocalStorage.setItem('null', null)
        expect(LocalStorage.hasItem('null')).toBe(true)
        expect(LocalStorage.getItem('null')).toBe('null')

        LocalStorage.setItem('null', void 0)
        expect(LocalStorage.hasItem('null')).toBe(true)
        expect(LocalStorage.getItem('null')).toBe('undefined')
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
  })

  describe('[Props]', () => {
    describe('[(prop)items]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(LocalStorage.items).toBeTypeOf('object')
      })

      // a released key is read afresh from the storage on its next read,
      // so a write behind the view's back tells a live entry from a
      // released one
      const writeBehind = (key, value) => {
        LocalStorage.setItem('items.encoded', value)
        window.localStorage.setItem(
          key,
          window.localStorage.getItem('items.encoded')
        )
      }

      test('is released with the component that read it', async () => {
        const wrapper = mount({
          render: () => h('div', String(LocalStorage.items['items.release']))
        })

        LocalStorage.setItem('items.release', 'dark')
        await nextTick()
        expect(wrapper.text()).toBe('dark')

        writeBehind('items.release', 'behind')
        expect(wrapper.text()).toBe('dark')

        wrapper.unmount()

        const scope = effectScope()
        expect(scope.run(() => LocalStorage.items['items.release'])).toBe(
          'behind'
        )
        scope.stop()
      })

      test('is released with the last of its reader scopes', () => {
        const first = effectScope()
        const second = effectScope()

        LocalStorage.setItem('items.scopes', 'dark')
        first.run(() => void LocalStorage.items['items.scopes'])
        second.run(() => void LocalStorage.items['items.scopes'])

        writeBehind('items.scopes', 'behind')
        first.stop()
        expect(second.run(() => LocalStorage.items['items.scopes'])).toBe(
          'dark'
        )

        second.stop()
        const third = effectScope()
        expect(third.run(() => LocalStorage.items['items.scopes'])).toBe(
          'behind'
        )
        third.stop()
      })

      test('stays tracked once first read outside of any scope', () => {
        const scope = effectScope()

        LocalStorage.setItem('items.pinned', 'dark')
        void LocalStorage.items['items.pinned']
        scope.run(() => void LocalStorage.items['items.pinned'])
        scope.stop()

        writeBehind('items.pinned', 'behind')
        expect(LocalStorage.items['items.pinned']).toBe('dark')
      })

      test('can be read from an unmounted hook', () => {
        let read

        const wrapper = mount({
          setup() {
            onUnmounted(() => {
              read = LocalStorage.items['items.unmounted']
            })
            return () => h('div')
          }
        })

        LocalStorage.setItem('items.unmounted', 'dark')
        wrapper.unmount()

        expect(read).toBe('dark')
      })

      test('is not pinned by a scope-less read of an owned key', () => {
        const scope = effectScope()

        LocalStorage.setItem('items.owned', 'dark')
        scope.run(() => void LocalStorage.items['items.owned'])
        // an event handler of the owner reads with no scope active
        void LocalStorage.items['items.owned']
        scope.stop()

        writeBehind('items.owned', 'behind')
        const reader = effectScope()
        expect(reader.run(() => LocalStorage.items['items.owned'])).toBe(
          'behind'
        )
        reader.stop()
      })

      test('is not tracked by a probe of the view', () => {
        expect(isRef(LocalStorage.items)).toBe(false)
        expect(JSON.stringify(LocalStorage.items)).toBe('{}')

        for (const key of ['__v_isRef', '__v_raw', 'toJSON']) {
          expect(LocalStorage.hasItem(key)).toBe(false)
          expect(LocalStorage.items[key]).toBeUndefined()
        }

        // coercing it reads toString and valueOf
        expect(String(LocalStorage.items)).toBe('[object Object]')

        for (const key of ['toString', 'valueOf', 'constructor']) {
          expect(LocalStorage.hasItem(key)).toBe(false)
          expect(LocalStorage.items[key]).toBe(Object.prototype[key])
        }
      })

      test('is reactive', () => {
        mountPlugin()
        const theme = computed(() => LocalStorage.items['items.reactive'])

        expect(theme.value).toBeNull()

        LocalStorage.setItem('items.reactive', 'dark')
        expect(theme.value).toBe('dark')

        LocalStorage.removeItem('items.reactive')
        expect(theme.value).toBeNull()

        LocalStorage.setItem('items.reactive', 'dark')
        LocalStorage.clear()
        expect(theme.value).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.localStorage.items).toBe(LocalStorage.items)
      })

      test('reads, writes and removes items', () => {
        mountPlugin()
        const { items } = LocalStorage

        expect(items['items.rw']).toBeNull()

        items['items.rw'] = { notifications: true }
        expect(LocalStorage.getItem('items.rw')).toStrictEqual({
          notifications: true
        })
        expect(items['items.rw']).toStrictEqual({ notifications: true })

        delete items['items.rw']
        expect(LocalStorage.hasItem('items.rw')).toBe(false)
        expect(items['items.rw']).toBeNull()
      })

      test('stores null and undefined like setItem() does', async () => {
        mountPlugin()
        const { items } = LocalStorage

        items['items.null'] = 'set'
        items['items.null'] = null
        expect(LocalStorage.hasItem('items.null')).toBe(true)
        expect(items['items.null']).toBe(LocalStorage.getItem('items.null'))

        // what it reads back is not written again
        const raw = window.localStorage.getItem('items.null')
        await nextTick()
        expect(window.localStorage.getItem('items.null')).toBe(raw)

        items['items.null'] = void 0
        expect(LocalStorage.hasItem('items.null')).toBe(true)
        expect(items['items.null']).toBe(LocalStorage.getItem('items.null'))

        // nothing gets written back for a removed item either
        LocalStorage.removeItem('items.null')
        await nextTick()
        expect(LocalStorage.hasItem('items.null')).toBe(false)
      })

      test('reads a function back as its source', () => {
        mountPlugin()
        const fn = () => 5

        LocalStorage.items['items.fn'] = fn
        expect(LocalStorage.items['items.fn']).toBe(fn.toString())
        expect(LocalStorage.getItem('items.fn')).toBe(fn.toString())
      })

      test('reads a value it does not encode back as the browser stores it', () => {
        mountPlugin()
        const { items } = LocalStorage

        void items['items.raw']
        items['items.raw'] = 10n
        expect(LocalStorage.getItem('items.raw')).toBe('10')
        expect(items['items.raw']).toBe('10')
      })

      test('starts with the stored value', () => {
        mountPlugin()
        LocalStorage.setItem('items.stored', 5)

        expect(LocalStorage.items['items.stored']).toBe(5)
      })

      test('persists a nested change', async () => {
        mountPlugin()
        const { items } = LocalStorage

        items['items.nested'] = { notifications: true, tags: ['a'] }
        items['items.nested'].notifications = false
        items['items.nested'].tags.push('b')
        await nextTick()

        expect(LocalStorage.getItem('items.nested')).toStrictEqual({
          notifications: false,
          tags: ['a', 'b']
        })
      })

      test('works through toRef()', async () => {
        mountPlugin()
        const theme = toRef(LocalStorage.items, 'items.toRef')

        expect(theme.value).toBeNull()

        theme.value = 'dark'
        expect(LocalStorage.getItem('items.toRef')).toBe('dark')

        LocalStorage.setItem('items.toRef', 'light')
        expect(theme.value).toBe('light')

        theme.value = null
        await nextTick()
        expect(LocalStorage.hasItem('items.toRef')).toBe(true)
        expect(theme.value).toBe(LocalStorage.getItem('items.toRef'))
      })

      test('lets ??= set a default', () => {
        mountPlugin()
        const { items } = LocalStorage

        items['items.default'] ??= 'light'
        expect(LocalStorage.getItem('items.default')).toBe('light')

        items['items.default'] = 'dark'
        items['items.default'] ??= 'light'
        expect(items['items.default']).toBe('dark')
      })

      test('is not enumerable and has no "in"', () => {
        mountPlugin()
        LocalStorage.setItem('items.enum', 1)

        expect(Object.keys(LocalStorage.items)).toStrictEqual([])
        expect({ ...LocalStorage.items }).toStrictEqual({})
        expect('items.enum' in LocalStorage.items).toBe(false)
      })

      test('persists a pending nested change when released', () => {
        const scope = effectScope()

        scope.run(() => {
          LocalStorage.items['items.pending'] = { a: 1 }
          LocalStorage.items['items.pending'].a = 2
        })
        scope.stop()

        expect(LocalStorage.getItem('items.pending')).toStrictEqual({ a: 2 })
      })

      test('follows a change made from another document', () => {
        mountPlugin()
        const theme = computed(() => LocalStorage.items['items.event'])
        expect(theme.value).toBeNull()

        // the encoded form of a value, as another document would store it
        LocalStorage.setItem('items.event.encoded', 'dark')
        const encoded = window.localStorage.getItem('items.event.encoded')

        window.localStorage.setItem('items.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: encoded,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBe('dark')

        window.localStorage.removeItem('items.event')
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: null,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBeNull()

        // another storage area is not this one
        window.localStorage.setItem('items.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: encoded,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBeNull()
      })

      test('does not write back what it got told about', async () => {
        mountPlugin()
        const { items } = LocalStorage

        void items['items.echo']
        LocalStorage.setItem('items.echo', { a: 1 })
        LocalStorage.removeItem('items.echo')
        await nextTick()

        expect(LocalStorage.hasItem('items.echo')).toBe(false)
      })

      test('is never wrapped by reactive()', () => {
        mountPlugin()
        expect(reactive(LocalStorage.items)).toBe(LocalStorage.items)
        expect(reactive({ items: LocalStorage.items }).items).toBe(
          LocalStorage.items
        )
      })

      test('is read again once released', () => {
        const wrapper = mount({
          render: () => h('div', String(LocalStorage.items['items.again']))
        })

        wrapper.unmount()

        LocalStorage.setItem('items.again', 'dark')
        expect(LocalStorage.items['items.again']).toBe('dark')
      })
    })
  })
})
