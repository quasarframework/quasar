import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import LoadingBar from './LoadingBar.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { LoadingBar } })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  if (LoadingBar.isActive) {
    LoadingBar.stop()
  }
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('[LoadingBar API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(LoadingBar).toBe(wrapper.vm.$q.loadingBar)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(LoadingBar.isActive).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        expect(LoadingBar.isActive).toBe(false)

        LoadingBar.start(0)
        expect(LoadingBar.isActive).toBe(true)

        LoadingBar.stop()
        expect(LoadingBar.isActive).toBe(false)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)start]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(LoadingBar.start(300)).toBeUndefined()
        expect(LoadingBar.isActive).toBe(true)

        LoadingBar.stop()
      })
    })

    describe('[(method)stop]', () => {
      test('should be callable', () => {
        mountPlugin()

        LoadingBar.start(0)
        expect(LoadingBar.isActive).toBe(true)

        expect(LoadingBar.stop()).toBeUndefined()
        expect(LoadingBar.isActive).toBe(false)
      })
    })

    describe('[(method)increment]', () => {
      test('should be callable', async () => {
        mountPlugin()

        LoadingBar.start(0)
        await nextTick()

        const bar = document.querySelector('.q-loading-bar')
        expect(bar.getAttribute('aria-valuenow')).toBe('0')

        expect(LoadingBar.increment(10)).toBeUndefined()
        await nextTick()

        expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(0)

        LoadingBar.stop()
      })
    })

    describe('[(method)setDefaults]', () => {
      test('should be callable', async () => {
        mountPlugin()

        expect(
          LoadingBar.setDefaults({ position: 'bottom', reverse: true })
        ).toBeUndefined()

        await nextTick()

        expect(document.querySelector('.q-loading-bar--bottom')).not.toBe(null)
      })
    })
  })
})
