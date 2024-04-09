import { describe, test, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'

import LocalStorage from './LocalStorage.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { LocalStorage } })

describe('[LocalStorage API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const { vm: { $q } } = mountPlugin()

      expect($q.localStorage).toBeDefined()
      expect($q.localStorage).toBeTypeOf('object')
      expect(Object.keys($q.localStorage)).not.toHaveLength(0)

      expect(LocalStorage).toMatchObject($q.localStorage)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)has]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(LocalStorage.has('has')).toBe(false)
        LocalStorage.set('has', 'rstoenescu')
        expect(LocalStorage.has('has')).toBe(true)
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.has).toBe(LocalStorage.has)
      })
    })

    describe('[(method)getLength]', () => {
      test('should be callable', () => {
        mountPlugin()

        const len = LocalStorage.getLength()
        expect(len).toBeTypeOf('number')

        LocalStorage.set('getLength', 0)
        expect(LocalStorage.getLength()).toBe(len + 1)
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getLength).toBe(LocalStorage.getLength)
      })
    })

    describe('[(method)getItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(
          LocalStorage.getItem('getItem')
        ).toBeNull()
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getItem).toBe(LocalStorage.getItem)
      })
    })

    describe('[(method)getIndex]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.set('getIndex', 'rstoenescu')

        expect(
          LocalStorage.getIndex(0)
        ).$any([
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
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getIndex).toBe(LocalStorage.getIndex)
      })
    })

    describe('[(method)getKey]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.set('getKey', 'rstoenescu')

        expect(
          LocalStorage.getKey(0)
        ).toBeTypeOf('string')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getKey).toBe(LocalStorage.getKey)
      })
    })

    describe('[(method)getAll]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.set('getAll', 'rstoenescu')

        const result = LocalStorage.getAll()
        expect(result).toBeTypeOf('object')
        expect(Object.keys(result)).not.toHaveLength(0)
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getAll).toBe(LocalStorage.getAll)
      })
    })

    describe('[(method)getAllKeys]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        LocalStorage.set('getAllKeys', 'rstoenescu')

        expect(
          Array.isArray(LocalStorage.getAllKeys())
        ).toBe(true)

        expect(
          LocalStorage.getAllKeys()
        ).toContain('getAllKeys')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.getAllKeys).toBe(LocalStorage.getAllKeys)
      })
    })

    describe('[(method)set]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(
          LocalStorage.set('set', 'rstoenescu')
        ).toBeUndefined()

        expect(
          LocalStorage.getItem('set')
        ).toBe('rstoenescu')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.set).toBe(LocalStorage.set)
      })

      test('can override value', () => {
        mountPlugin()

        expect(LocalStorage.set('set2', 'rstoenescu'))
        expect(LocalStorage.getItem('set2')).toBe('rstoenescu')

        expect(LocalStorage.set('set2', 'rstoenescu2'))
        expect(LocalStorage.getItem('set2')).toBe('rstoenescu2')
      })

      test('can encode + decode a Number', () => {
        mountPlugin()

        LocalStorage.set('Number', 123)
        expect(LocalStorage.getItem('Number')).toBe(123)
      })

      test('can encode + decode a Boolean', () => {
        mountPlugin()

        LocalStorage.set('Boolean', true)
        expect(LocalStorage.getItem('Boolean')).toBe(true)
      })

      test('can encode + decode a Date', () => {
        mountPlugin()
        const date = new Date()

        LocalStorage.set('Date', date)
        expect(
          LocalStorage.getItem('Date')
        ).toStrictEqual(date)
      })

      test('can encode + decode a String', () => {
        mountPlugin()

        LocalStorage.set('String', 'rstoenescu')
        expect(
          LocalStorage.getItem('String')
        ).toBe('rstoenescu')
      })

      test('can encode + decode a RegExp', () => {
        mountPlugin()

        LocalStorage.set('RegExp', /abc/)
        expect(
          LocalStorage.getItem('RegExp')
        ).toStrictEqual(/abc/)
      })

      test('can encode + decode a Function', () => {
        mountPlugin()
        const fn = () => 5

        LocalStorage.set('Function', fn)
        expect(
          LocalStorage.getItem('Function')
        ).toBe(fn.toString())
      })

      test('can encode + decode an Object', () => {
        mountPlugin()
        const obj = { a: 1 }

        LocalStorage.set('Object', obj)
        expect(
          LocalStorage.getItem('Object')
        ).toStrictEqual(obj)
      })

      test('can encode + decode an Array', () => {
        mountPlugin()
        const arr = [ 1, 2, 3 ]

        LocalStorage.set('Array', arr)
        expect(
          LocalStorage.getItem('Array')
        ).toStrictEqual(arr)
      })
    })

    describe('[(method)remove]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.set('remove', 5)
        expect(
          LocalStorage.getItem('remove')
        ).toBe(5)

        expect(
          LocalStorage.remove('remove')
        ).toBeUndefined()

        expect(
          LocalStorage.getItem('remove')
        ).toBeNull()
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.remove).toBe(LocalStorage.remove)
      })
    })

    describe('[(method)clear]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.set('clear', 5)
        expect(LocalStorage.getItem('clear')).toBe(5)

        expect(LocalStorage.clear()).toBeUndefined()

        expect(LocalStorage.getItem('clear')).toBeNull()
        expect(LocalStorage.getLength()).toBe(0)
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.clear).toBe(LocalStorage.clear)
      })
    })

    describe('[(method)isEmpty]', () => {
      test('should be callable', () => {
        mountPlugin()

        LocalStorage.set('isEmpty', 5)
        expect(LocalStorage.getItem('isEmpty')).toBe(5)

        expect(LocalStorage.isEmpty()).toBe(false)

        LocalStorage.clear()

        expect(LocalStorage.isEmpty()).toBe(true)
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.localStorage.isEmpty).toBe(LocalStorage.isEmpty)
      })
    })
  })
})
