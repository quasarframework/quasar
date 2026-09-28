import { isRef } from 'vue'
import { describe, expect, test } from 'vitest'

import { getEmptyStorage, getStorage } from './web-storage.js'

const objectDefinition = {
  has: expect.any(Function), // alias of hasItem
  hasItem: expect.any(Function),
  getLength: expect.any(Function),
  getItem: expect.any(Function),
  getIndex: expect.any(Function),
  getKey: expect.any(Function),
  getAll: expect.any(Function),
  getAllKeys: expect.any(Function),
  set: expect.any(Function), // alias of setItem
  setItem: expect.any(Function),
  remove: expect.any(Function), // alias of removeItem
  removeItem: expect.any(Function),
  clear: expect.any(Function),
  isEmpty: expect.any(Function),
  useStorage: expect.any(Function)
}

describe('[webStorage API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getEmptyStorage]', () => {
      test('has correct return value', () => {
        const result = getEmptyStorage()
        expect(result).toStrictEqual(objectDefinition)
      })

      test('hands out an in-memory storage ref', () => {
        const { useStorage } = getEmptyStorage()
        const defaultValue = { count: 0 }
        const settings = useStorage('settings', { default: defaultValue })

        expect(isRef(settings)).toBe(true)
        expect(settings.stop).toBeTypeOf('function')
        expect(useStorage('theme').value).toBeNull()

        settings.value.count = 1
        expect(settings.value.count).toBe(1)
        expect(defaultValue).toStrictEqual({ count: 0 })

        settings.value = null
        expect(settings.value).toStrictEqual({ count: 0 })
      })
    })

    describe('[(function)getStorage]', () => {
      test('has correct return value for local', () => {
        const local = getStorage('local')
        expect(local).toStrictEqual(objectDefinition)
      })

      test('has correct return value for session', () => {
        const session = getStorage('session')
        expect(session).toStrictEqual(objectDefinition)
      })
    })
  })
})
