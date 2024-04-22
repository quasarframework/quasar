import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Dark from './Dark.js'

const mountPlugin = () => mount({ template: '<div />' })

describe('[Dark API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Dark).toMatchObject(wrapper.vm.$q.dark)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Dark.isActive).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        const { vm: { $q } } = mountPlugin()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(false)

        Dark.set(true)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)
      })
    })

    describe('[(prop)mode]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect([ 'auto', true, false ]).toContain(Dark.mode)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const { vm: { $q } } = mountPlugin()

        expect(
          Dark.set(true)
        ).toBeUndefined()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)

        expect(
          Dark.set(false)
        ).toBeUndefined()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(false)
      })

      test('should handle auto mode', () => {
        const { vm: { $q } } = mountPlugin()

        // jsdom hack
        const media = {
          matches: true,
          addListener: vi.fn(),
          removeListener: vi.fn()
        }
        window.matchMedia = vi.fn(() => media)

        Dark.set('auto')

        expect(Dark.mode).toBe('auto')

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).not.toHaveBeenCalled()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)

        media.matches = false
        Dark.__updateMedia()

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).not.toHaveBeenCalled()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(false)

        Dark.set(true)
        expect(Dark.mode).not.toBe('auto')

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).toHaveBeenCalledTimes(1)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', () => {
        const { vm: { $q } } = mountPlugin()

        Dark.set(true)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)

        expect(
          Dark.toggle()
        ).toBeUndefined()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(false)

        Dark.toggle()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(
          document.body.classList.contains('body--dark')
        ).toBe(true)
      })
    })
  })
})
