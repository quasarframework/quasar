import { describe, test, expect } from 'vitest'

import { getEmptyStorage, getStorage } from './web-storage.js'

const objectDefinition = {
  has: expect.any(Function), // alias of has
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
  isEmpty: expect.any(Function)
}

describe('[webStorage API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getEmptyStorage]', () => {
      test('has correct return value', () => {
        const result = getEmptyStorage()
        expect(result).toStrictEqual(objectDefinition)
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
