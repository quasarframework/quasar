import { describe, test, expect, vi } from 'vitest'

import EventBus from './EventBus.js'

describe('[EventBus API]', () => {
  describe('[Classes]', () => {
    describe('[(class)default]', () => {
      test('can be instantiated', () => {
        const instance = new EventBus()
        expect(instance).toMatchObject({
          on: expect.any(Function),
          once: expect.any(Function),
          emit: expect.any(Function),
          off: expect.any(Function)
        })
      })

      test('can subscribe and emit an event', () => {
        const instance = new EventBus()
        const callback = vi.fn()

        instance.on('test', callback)
        instance.emit('test', 'testing')

        expect(callback).toHaveBeenCalledWith('testing')
      })

      test('can subscribe and emit an event once', () => {
        const instance = new EventBus()
        const callback = vi.fn()

        instance.once('test', callback)
        instance.emit('test', 'testing')
        instance.emit('test', 'testing')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('testing')
      })

      test('can unsubscribe from an event', () => {
        const instance = new EventBus()
        const callback = vi.fn()

        instance.on('test', callback)
        instance.emit('test', 'testing')
        instance.off('test', callback)
        instance.emit('test', 'testing')

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('can unsubscribe from all events', () => {
        const instance = new EventBus()
        const callback1 = vi.fn()
        const callback2 = vi.fn()

        instance.on('test1', callback1)
        instance.on('test2', callback2)
        instance.emit('test1', 'testing1')
        instance.emit('test2', 'testing2')
        instance.off('test1')
        instance.off('test2')
        instance.emit('test1', 'testing1')
        instance.emit('test2', 'testing2')

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)
      })

      test('can subscribe to multiple events', () => {
        const instance = new EventBus()
        const callback1 = vi.fn()
        const callback2 = vi.fn()

        instance.on('test1', callback1)
        instance.on('test2', callback2)
        instance.emit('test1', 'testing1')
        instance.emit('test2', 'testing2')

        expect(callback1).toHaveBeenCalledWith('testing1')
        expect(callback2).toHaveBeenCalledWith('testing2')
      })

      test('arguments preservation', () => {
        const instance = new EventBus()
        const callback = vi.fn()

        instance.on('test', callback)
        instance.emit('test', 1, 2, '3')

        expect(callback).toHaveBeenCalledWith(1, 2, '3')
      })

      test('is chainable', () => {
        const instance = new EventBus()
        const callback = vi.fn()

        instance
          .on('test', callback)
          .emit('test', 1, 2, 'testing')
          .off('test', callback)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1, 2, 'testing')
      })
    })
  })
})
