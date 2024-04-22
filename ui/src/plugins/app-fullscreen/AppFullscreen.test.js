import { describe, test, expect, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'

// jsdom hack
// this import should always sit before the AppFullscreen one
import { createMockedEl } from './test/mock-fullscreen.js'

import AppFullscreen from './AppFullscreen.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { AppFullscreen } })

afterEach(async () => {
  // ensure we don't leave test in fullscreen state
  await AppFullscreen.exit()
})

describe('[AppFullscreen API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(AppFullscreen).toMatchObject(wrapper.vm.$q.fullscreen)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isCapable]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppFullscreen.isCapable).toBeTypeOf('boolean')
      })
    })

    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppFullscreen.isActive).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        expect(AppFullscreen.isActive).toBe(false)
        await AppFullscreen.request()
        expect(AppFullscreen.isActive).toBe(true)

        await AppFullscreen.exit()
        expect(AppFullscreen.isActive).toBe(false)
      })
    })

    describe('[(prop)activeEl]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppFullscreen.activeEl).$any([
          expect.any(Element),
          null
        ])
      })

      test('is reactive', async () => {
        mountPlugin()

        expect(AppFullscreen.activeEl).toBe(null)
        await AppFullscreen.request()
        expect(AppFullscreen.activeEl).not.toBe(null)

        await AppFullscreen.exit()
        expect(AppFullscreen.activeEl).toBe(null)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)request]', () => {
      test('request()', async () => {
        mountPlugin()

        const result = AppFullscreen.request()
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result
        expect(AppFullscreen.isActive).toBe(true)
        expect(AppFullscreen.activeEl).not.toBe(null)

        await AppFullscreen.exit()
        expect(AppFullscreen.isActive).toBe(false)
        expect(AppFullscreen.activeEl).toBe(null)
      })

      test('request(el)', async () => {
        mountPlugin()

        const el = createMockedEl()

        const result = AppFullscreen.request(el)
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result

        expect(el.requestFullscreen).toHaveBeenCalledTimes(1)
        expect(AppFullscreen.isActive).toBe(true)
        expect(AppFullscreen.activeEl).toBe(el)

        await AppFullscreen.exit()
        expect(AppFullscreen.isActive).toBe(false)
        expect(AppFullscreen.activeEl).toBe(null)
      })

      test('call request(el) 2 times', async () => {
        mountPlugin()

        const el = createMockedEl()

        const result = AppFullscreen.request(el)
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result
        expect(el.requestFullscreen).toHaveBeenCalledTimes(1)
        expect(AppFullscreen.activeEl).toBe(el)

        await AppFullscreen.request(el)
        expect(el.requestFullscreen).toHaveBeenCalledTimes(1)
        expect(AppFullscreen.activeEl).toBe(el)

        await AppFullscreen.exit()
        expect(AppFullscreen.activeEl).toBe(null)
      })
    })

    describe('[(method)exit]', () => {
      test('should be callable', () => {
        mountPlugin()
        expect(
          AppFullscreen.exit()
        ).toBeInstanceOf(Promise)
      })

      test('request() + exit()', async () => {
        mountPlugin()

        const result = AppFullscreen.request()
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result
        expect(AppFullscreen.isActive).toBe(true)
        expect(AppFullscreen.activeEl).not.toBe(null)

        await AppFullscreen.exit()
        expect(AppFullscreen.isActive).toBe(false)
        expect(AppFullscreen.activeEl).toBe(null)
      })
    })

    describe('[(method)toggle]', () => {
      test('toggle()', async () => {
        mountPlugin()

        const result = AppFullscreen.toggle()
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result
        expect(AppFullscreen.isActive).toBe(true)
        expect(AppFullscreen.activeEl).not.toBe(null)

        await AppFullscreen.toggle()
        expect(AppFullscreen.isActive).toBe(false)
        expect(AppFullscreen.activeEl).toBe(null)
      })

      test('toggle(el)', async () => {
        mountPlugin()

        const el = createMockedEl()

        const result = AppFullscreen.toggle(el)
        expect(
          result
        ).toBeInstanceOf(Promise)

        await result
        expect(el.requestFullscreen).toHaveBeenCalledTimes(1)
        expect(AppFullscreen.isActive).toBe(true)
        expect(AppFullscreen.activeEl).toBe(el)

        await AppFullscreen.toggle()
        expect(AppFullscreen.isActive).toBe(false)
        expect(AppFullscreen.activeEl).toBe(null)
      })
    })
  })
})
