import { h } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'
import { config, mount } from '@vue/test-utils'

// deterministic Screen Wake Lock API mock;
// this import should always sit before the AppWakeLock one
import {
  getHeldSentinel,
  mockedWakeLock,
  sentinelList,
  setHidden
} from './test/mock-wake-lock.js'

import AppWakeLock from './AppWakeLock.js'
import { isRuntimeSsrPreHydration } from '../platform/Platform.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { AppWakeLock } })

// flushes the promise chain behind a browser-initiated release
const tick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 0)
  })

afterEach(async () => {
  // ensure we don't leave a test holding the lock
  await AppWakeLock.release()
  setHidden(false)
  sentinelList.length = 0
  mockedWakeLock.request.mockClear()
})

describe('[AppWakeLock API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(wrapper.vm.$q.wakeLock).toBe(AppWakeLock)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isCapable]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppWakeLock.isCapable).toBe(true)
      })

      test('is reactive', async () => {
        // a fresh copy of the plugin, so that we get its first install again
        // (the singleton above already installed itself in non-SSR mode)
        const { default: Plugin } =
          await import('./AppWakeLock.js?ssr-hydration')

        isRuntimeSsrPreHydration.value = true
        quasarVuePlugin.install = app =>
          install(app, { plugins: { AppWakeLock: Plugin } })

        try {
          const wrapper = mount({
            render() {
              return h('div', String(this.$q.wakeLock.isCapable))
            }
          })

          // the server rendered with the default
          expect(Plugin.isCapable).toBe(false)
          expect(wrapper.text()).toBe('false')

          wrapper.vm.$q.onSSRHydrated()
          expect(Plugin.isCapable).toBe(true)

          await wrapper.vm.$nextTick()
          expect(wrapper.text()).toBe('true')
        } finally {
          quasarVuePlugin.install = app =>
            install(app, { plugins: { AppWakeLock } })
          isRuntimeSsrPreHydration.value = false
        }
      })
    })

    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppWakeLock.isActive).toBe(false)
      })

      test('is reactive', async () => {
        const wrapper = mount({
          render() {
            return h('div', String(this.$q.wakeLock.isActive))
          }
        })

        expect(wrapper.text()).toBe('false')

        await AppWakeLock.request()
        expect(AppWakeLock.isActive).toBe(true)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toBe('true')

        await AppWakeLock.release()
        expect(AppWakeLock.isActive).toBe(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toBe('false')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)request]', () => {
      test('should be callable', async () => {
        mountPlugin()

        const result = AppWakeLock.request()
        expect(result).toBeInstanceOf(Promise)

        await result
        expect(mockedWakeLock.request).toHaveBeenCalledExactlyOnceWith('screen')
        expect(AppWakeLock.isActive).toBe(true)
        expect(getHeldSentinel()).not.toBe(null)
      })

      test('holds a single lock across repeated calls', async () => {
        mountPlugin()

        await AppWakeLock.request()
        await AppWakeLock.request()
        expect(mockedWakeLock.request).toHaveBeenCalledTimes(1)
        expect(sentinelList).toHaveLength(1)
      })

      test('shares one in-flight request between concurrent calls', async () => {
        mountPlugin()

        await Promise.all([AppWakeLock.request(), AppWakeLock.request()])
        expect(mockedWakeLock.request).toHaveBeenCalledTimes(1)
        expect(sentinelList).toHaveLength(1)
        expect(AppWakeLock.isActive).toBe(true)
      })

      test('rejects with the browser error when the page is hidden', async () => {
        mountPlugin()
        setHidden(true)

        await expect(AppWakeLock.request()).rejects.toMatchObject({
          name: 'NotAllowedError'
        })
        expect(AppWakeLock.isActive).toBe(false)

        // a failed request() is not an intent to re-acquire
        setHidden(false)
        await tick()
        expect(mockedWakeLock.request).toHaveBeenCalledTimes(1)
        expect(AppWakeLock.isActive).toBe(false)
      })
    })

    describe('[(method)release]', () => {
      test('should be callable', async () => {
        mountPlugin()

        const result = AppWakeLock.release()
        expect(result).toBeInstanceOf(Promise)
        await result

        // nothing was held, so nothing to release
        expect(mockedWakeLock.request).not.toHaveBeenCalled()
      })

      test('request() + release()', async () => {
        mountPlugin()

        await AppWakeLock.request()
        const sentinel = getHeldSentinel()
        expect(AppWakeLock.isActive).toBe(true)

        await AppWakeLock.release()
        expect(sentinel.release).toHaveBeenCalledTimes(1)
        expect(sentinel.released).toBe(true)
        expect(AppWakeLock.isActive).toBe(false)
        expect(getHeldSentinel()).toBe(null)
      })

      test('drops a lock that lands after release() was called', async () => {
        mountPlugin()

        const request = AppWakeLock.request()
        await AppWakeLock.release()
        await request

        expect(sentinelList).toHaveLength(1)
        expect(sentinelList[0].released).toBe(true)
        expect(AppWakeLock.isActive).toBe(false)
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        mountPlugin()

        const result = AppWakeLock.toggle()
        expect(result).toBeInstanceOf(Promise)

        await result
        expect(AppWakeLock.isActive).toBe(true)

        await AppWakeLock.toggle()
        expect(AppWakeLock.isActive).toBe(false)
        expect(getHeldSentinel()).toBe(null)
      })
    })
  })

  describe('[Generic]', () => {
    test('re-acquires the lock the browser dropped once the page is visible again', async () => {
      mountPlugin()

      await AppWakeLock.request()
      const first = getHeldSentinel()

      setHidden(true)
      expect(first.released).toBe(true)
      expect(AppWakeLock.isActive).toBe(false)

      setHidden(false)
      await tick()
      expect(mockedWakeLock.request).toHaveBeenCalledTimes(2)
      expect(AppWakeLock.isActive).toBe(true)
      expect(getHeldSentinel()).not.toBe(first)
    })

    test('does not re-acquire after release()', async () => {
      mountPlugin()

      await AppWakeLock.request()
      await AppWakeLock.release()

      setHidden(true)
      setHidden(false)
      await tick()

      expect(mockedWakeLock.request).toHaveBeenCalledTimes(1)
      expect(AppWakeLock.isActive).toBe(false)
    })

    test('release() while hidden cancels the pending re-acquire', async () => {
      mountPlugin()

      await AppWakeLock.request()
      setHidden(true)
      await AppWakeLock.release()

      setHidden(false)
      await tick()
      expect(mockedWakeLock.request).toHaveBeenCalledTimes(1)
      expect(AppWakeLock.isActive).toBe(false)
    })
  })
})
