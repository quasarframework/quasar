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

      test('stores null and undefined as the strings the browser makes of them', () => {
        mountPlugin()

        SessionStorage.setItem('null', null)
        expect(SessionStorage.hasItem('null')).toBe(true)
        expect(SessionStorage.getItem('null')).toBe('null')

        SessionStorage.setItem('null', void 0)
        expect(SessionStorage.hasItem('null')).toBe(true)
        expect(SessionStorage.getItem('null')).toBe('undefined')
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
  })

  describe('[Props]', () => {
    describe('[(prop)items]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(SessionStorage.items).toBeTypeOf('object')
      })

      // a released key is read afresh from the storage on its next read,
      // so a write behind the view's back tells a live entry from a
      // released one
      const writeBehind = (key, value) => {
        SessionStorage.setItem('items.encoded', value)
        window.sessionStorage.setItem(
          key,
          window.sessionStorage.getItem('items.encoded')
        )
      }

      test('is released with the component that read it', async () => {
        const wrapper = mount({
          render: () => h('div', String(SessionStorage.items['items.release']))
        })

        SessionStorage.setItem('items.release', 'dark')
        await nextTick()
        expect(wrapper.text()).toBe('dark')

        writeBehind('items.release', 'behind')
        expect(wrapper.text()).toBe('dark')

        wrapper.unmount()

        const scope = effectScope()
        expect(scope.run(() => SessionStorage.items['items.release'])).toBe(
          'behind'
        )
        scope.stop()
      })

      test('is released with the last of its reader scopes', () => {
        const first = effectScope()
        const second = effectScope()

        SessionStorage.setItem('items.scopes', 'dark')
        first.run(() => void SessionStorage.items['items.scopes'])
        second.run(() => void SessionStorage.items['items.scopes'])

        writeBehind('items.scopes', 'behind')
        first.stop()
        expect(second.run(() => SessionStorage.items['items.scopes'])).toBe(
          'dark'
        )

        second.stop()
        const third = effectScope()
        expect(third.run(() => SessionStorage.items['items.scopes'])).toBe(
          'behind'
        )
        third.stop()
      })

      test('stays tracked once first read outside of any scope', () => {
        const scope = effectScope()

        SessionStorage.setItem('items.pinned', 'dark')
        void SessionStorage.items['items.pinned']
        scope.run(() => void SessionStorage.items['items.pinned'])
        scope.stop()

        writeBehind('items.pinned', 'behind')
        expect(SessionStorage.items['items.pinned']).toBe('dark')
      })

      test('can be read from an unmounted hook', () => {
        let read

        const wrapper = mount({
          setup() {
            onUnmounted(() => {
              read = SessionStorage.items['items.unmounted']
            })
            return () => h('div')
          }
        })

        SessionStorage.setItem('items.unmounted', 'dark')
        wrapper.unmount()

        expect(read).toBe('dark')
      })

      test('is not pinned by a scope-less read of an owned key', () => {
        const scope = effectScope()

        SessionStorage.setItem('items.owned', 'dark')
        scope.run(() => void SessionStorage.items['items.owned'])
        // an event handler of the owner reads with no scope active
        void SessionStorage.items['items.owned']
        scope.stop()

        writeBehind('items.owned', 'behind')
        const reader = effectScope()
        expect(reader.run(() => SessionStorage.items['items.owned'])).toBe(
          'behind'
        )
        reader.stop()
      })

      test('is not tracked by a probe of the view', () => {
        expect(isRef(SessionStorage.items)).toBe(false)
        expect(JSON.stringify(SessionStorage.items)).toBe('{}')

        for (const key of ['__v_isRef', '__v_raw', 'toJSON']) {
          expect(SessionStorage.hasItem(key)).toBe(false)
          expect(SessionStorage.items[key]).toBeUndefined()
        }

        // coercing it reads toString and valueOf
        expect(String(SessionStorage.items)).toBe('[object Object]')

        for (const key of ['toString', 'valueOf', 'constructor']) {
          expect(SessionStorage.hasItem(key)).toBe(false)
          expect(SessionStorage.items[key]).toBe(Object.prototype[key])
        }
      })

      test('is reactive', () => {
        mountPlugin()
        const theme = computed(() => SessionStorage.items['items.reactive'])

        expect(theme.value).toBeNull()

        SessionStorage.setItem('items.reactive', 'dark')
        expect(theme.value).toBe('dark')

        SessionStorage.removeItem('items.reactive')
        expect(theme.value).toBeNull()

        SessionStorage.setItem('items.reactive', 'dark')
        SessionStorage.clear()
        expect(theme.value).toBeNull()
      })

      test('matches $q API', () => {
        const {
          vm: { $q }
        } = mountPlugin()
        expect($q.sessionStorage.items).toBe(SessionStorage.items)
      })

      test('reads, writes and removes items', () => {
        mountPlugin()
        const { items } = SessionStorage

        expect(items['items.rw']).toBeNull()

        items['items.rw'] = { notifications: true }
        expect(SessionStorage.getItem('items.rw')).toStrictEqual({
          notifications: true
        })
        expect(items['items.rw']).toStrictEqual({ notifications: true })

        delete items['items.rw']
        expect(SessionStorage.hasItem('items.rw')).toBe(false)
        expect(items['items.rw']).toBeNull()
      })

      test('stores null and undefined like setItem() does', async () => {
        mountPlugin()
        const { items } = SessionStorage

        items['items.null'] = 'set'
        items['items.null'] = null
        expect(SessionStorage.hasItem('items.null')).toBe(true)
        expect(items['items.null']).toBe(SessionStorage.getItem('items.null'))

        // what it reads back is not written again
        const raw = window.sessionStorage.getItem('items.null')
        await nextTick()
        expect(window.sessionStorage.getItem('items.null')).toBe(raw)

        items['items.null'] = void 0
        expect(SessionStorage.hasItem('items.null')).toBe(true)
        expect(items['items.null']).toBe(SessionStorage.getItem('items.null'))

        // nothing gets written back for a removed item either
        SessionStorage.removeItem('items.null')
        await nextTick()
        expect(SessionStorage.hasItem('items.null')).toBe(false)
      })

      test('reads a function back as its source', () => {
        mountPlugin()
        const fn = () => 5

        SessionStorage.items['items.fn'] = fn
        expect(SessionStorage.items['items.fn']).toBe(fn.toString())
        expect(SessionStorage.getItem('items.fn')).toBe(fn.toString())
      })

      test('reads a value it does not encode back as the browser stores it', () => {
        mountPlugin()
        const { items } = SessionStorage

        void items['items.raw']
        items['items.raw'] = 10n
        expect(SessionStorage.getItem('items.raw')).toBe('10')
        expect(items['items.raw']).toBe('10')
      })

      test('starts with the stored value', () => {
        mountPlugin()
        SessionStorage.setItem('items.stored', 5)

        expect(SessionStorage.items['items.stored']).toBe(5)
      })

      test('persists a nested change', async () => {
        mountPlugin()
        const { items } = SessionStorage

        items['items.nested'] = { notifications: true, tags: ['a'] }
        items['items.nested'].notifications = false
        items['items.nested'].tags.push('b')
        await nextTick()

        expect(SessionStorage.getItem('items.nested')).toStrictEqual({
          notifications: false,
          tags: ['a', 'b']
        })
      })

      test('works through toRef()', async () => {
        mountPlugin()
        const theme = toRef(SessionStorage.items, 'items.toRef')

        expect(theme.value).toBeNull()

        theme.value = 'dark'
        expect(SessionStorage.getItem('items.toRef')).toBe('dark')

        SessionStorage.setItem('items.toRef', 'light')
        expect(theme.value).toBe('light')

        theme.value = null
        await nextTick()
        expect(SessionStorage.hasItem('items.toRef')).toBe(true)
        expect(theme.value).toBe(SessionStorage.getItem('items.toRef'))
      })

      test('lets ??= set a default', () => {
        mountPlugin()
        const { items } = SessionStorage

        items['items.default'] ??= 'light'
        expect(SessionStorage.getItem('items.default')).toBe('light')

        items['items.default'] = 'dark'
        items['items.default'] ??= 'light'
        expect(items['items.default']).toBe('dark')
      })

      test('is not enumerable and has no "in"', () => {
        mountPlugin()
        SessionStorage.setItem('items.enum', 1)

        expect(Object.keys(SessionStorage.items)).toStrictEqual([])
        expect({ ...SessionStorage.items }).toStrictEqual({})
        expect('items.enum' in SessionStorage.items).toBe(false)
      })

      test('persists a pending nested change when released', () => {
        const scope = effectScope()

        scope.run(() => {
          SessionStorage.items['items.pending'] = { a: 1 }
          SessionStorage.items['items.pending'].a = 2
        })
        scope.stop()

        expect(SessionStorage.getItem('items.pending')).toStrictEqual({ a: 2 })
      })

      test('follows a change made from another document', () => {
        mountPlugin()
        const theme = computed(() => SessionStorage.items['items.event'])
        expect(theme.value).toBeNull()

        // the encoded form of a value, as another document would store it
        SessionStorage.setItem('items.event.encoded', 'dark')
        const encoded = window.sessionStorage.getItem('items.event.encoded')

        window.sessionStorage.setItem('items.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: encoded,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBe('dark')

        window.sessionStorage.removeItem('items.event')
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: null,
            storageArea: window.sessionStorage
          })
        )
        expect(theme.value).toBeNull()

        // another storage area is not this one
        window.sessionStorage.setItem('items.event', encoded)
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'items.event',
            newValue: encoded,
            storageArea: window.localStorage
          })
        )
        expect(theme.value).toBeNull()
      })

      test('does not write back what it got told about', async () => {
        mountPlugin()
        const { items } = SessionStorage

        void items['items.echo']
        SessionStorage.setItem('items.echo', { a: 1 })
        SessionStorage.removeItem('items.echo')
        await nextTick()

        expect(SessionStorage.hasItem('items.echo')).toBe(false)
      })

      test('is never wrapped by reactive()', () => {
        mountPlugin()
        expect(reactive(SessionStorage.items)).toBe(SessionStorage.items)
        expect(reactive({ items: SessionStorage.items }).items).toBe(
          SessionStorage.items
        )
      })

      test('is read again once released', () => {
        const wrapper = mount({
          render: () => h('div', String(SessionStorage.items['items.again']))
        })

        wrapper.unmount()

        SessionStorage.setItem('items.again', 'dark')
        expect(SessionStorage.items['items.again']).toBe('dark')
      })
    })
  })
})
