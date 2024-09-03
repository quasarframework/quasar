import { describe, test, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'

import SessionStorage from './SessionStorage.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { SessionStorage } })

describe('[SessionStorage API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const { vm: { $q } } = mountPlugin()

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
        const { vm: { $q } } = mountPlugin()
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
        const { vm: { $q } } = mountPlugin()
        expect($q.sessionStorage.getLength).toBe(SessionStorage.getLength)
      })
    })

    describe('[(method)getItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(
          SessionStorage.getItem('getItem')
        ).toBeNull()
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.sessionStorage.getItem).toBe(SessionStorage.getItem)
      })
    })

    describe('[(method)getIndex]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getIndex', 'rstoenescu')

        expect(
          SessionStorage.getIndex(0)
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
        expect($q.sessionStorage.getIndex).toBe(SessionStorage.getIndex)
      })
    })

    describe('[(method)getKey]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getKey', 'rstoenescu')

        expect(
          SessionStorage.getKey(0)
        ).toBeTypeOf('string')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
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
        const { vm: { $q } } = mountPlugin()
        expect($q.sessionStorage.getAll).toBe(SessionStorage.getAll)
      })
    })

    describe('[(method)getAllKeys]', () => {
      test('should be callable', () => {
        mountPlugin()

        // ensure at least one element is defined
        SessionStorage.setItem('getAllKeys', 'rstoenescu')

        expect(
          Array.isArray(SessionStorage.getAllKeys())
        ).toBe(true)

        expect(
          SessionStorage.getAllKeys()
        ).toContain('getAllKeys')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
        expect($q.sessionStorage.getAllKeys).toBe(SessionStorage.getAllKeys)
      })
    })

    describe('[(method)setItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(
          SessionStorage.setItem('set', 'rstoenescu')
        ).toBeUndefined()

        expect(
          SessionStorage.getItem('set')
        ).toBe('rstoenescu')
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
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
        expect(
          SessionStorage.getItem('Date')
        ).toStrictEqual(date)
      })

      test('can encode + decode a String', () => {
        mountPlugin()

        SessionStorage.setItem('String', 'rstoenescu')
        expect(
          SessionStorage.getItem('String')
        ).toBe('rstoenescu')
      })

      test('can encode + decode a RegExp', () => {
        mountPlugin()

        SessionStorage.setItem('RegExp', /abc/)
        expect(
          SessionStorage.getItem('RegExp')
        ).toStrictEqual(/abc/)
      })

      test('can encode + decode a Function', () => {
        mountPlugin()
        const fn = () => 5

        SessionStorage.setItem('Function', fn)
        expect(
          SessionStorage.getItem('Function')
        ).toBe(fn.toString())
      })

      test('can encode + decode an Object', () => {
        mountPlugin()
        const obj = { a: 1 }

        SessionStorage.setItem('Object', obj)
        expect(
          SessionStorage.getItem('Object')
        ).toStrictEqual(obj)
      })

      test('can encode + decode an Array', () => {
        mountPlugin()
        const arr = [ 1, 2, 3 ]

        SessionStorage.setItem('Array', arr)
        expect(
          SessionStorage.getItem('Array')
        ).toStrictEqual(arr)
      })
    })

    describe('[(method)removeItem]', () => {
      test('should be callable', () => {
        mountPlugin()

        SessionStorage.setItem('remove', 5)
        expect(
          SessionStorage.getItem('remove')
        ).toBe(5)

        expect(
          SessionStorage.removeItem('remove')
        ).toBeUndefined()

        expect(
          SessionStorage.getItem('remove')
        ).toBeNull()
      })

      test('matches $q API', () => {
        const { vm: { $q } } = mountPlugin()
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
        const { vm: { $q } } = mountPlugin()
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
        const { vm: { $q } } = mountPlugin()
        expect($q.sessionStorage.isEmpty).toBe(SessionStorage.isEmpty)
      })
    })
  })
})
