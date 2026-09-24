import { h } from 'vue'
import { describe, expect, test } from 'vitest'
import { config, mount } from '@vue/test-utils'

import AppNetwork from './AppNetwork.js'
import { isRuntimeSsrPreHydration } from '../platform/Platform.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { AppNetwork } })

// The plugin reads navigator.onLine and navigator.connection, which the
// browser exposes as read-only Navigator.prototype getters, and we cannot
// actually unplug the test runner from its network; so we shadow them with
// own-property getters (removable via delete) and dispatch the real events
// the plugin listens to.
const fakeConnection = Object.assign(new EventTarget(), {
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false
})

let isOnline = true

Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  get: () => isOnline
})
Object.defineProperty(navigator, 'connection', {
  configurable: true,
  get: () => fakeConnection
})

function setOnline(val) {
  isOnline = val
  window.dispatchEvent(new Event(val ? 'online' : 'offline'))
}

function setConnection(props) {
  Object.assign(fakeConnection, props)
  fakeConnection.dispatchEvent(new Event('change'))
}

describe('[AppNetwork API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(wrapper.vm.$q.network).toBe(AppNetwork)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)online]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppNetwork.online).toBe(true)
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppNetwork.online).toBe(true)

        setOnline(false)
        expect(AppNetwork.online).toBe(false)
        expect(wrapper.vm.$q.network.online).toBe(false)

        setOnline(true)
        expect(AppNetwork.online).toBe(true)
        expect(wrapper.vm.$q.network.online).toBe(true)
      })
    })

    describe('[(prop)hasConnectionInfo]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppNetwork.hasConnectionInfo).toBe(true)
      })
    })

    describe('[(prop)effectiveType]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(['slow-2g', '2g', '3g', '4g']).toContain(
          AppNetwork.effectiveType
        )
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppNetwork.effectiveType).toBe('4g')

        setConnection({ effectiveType: '2g' })
        expect(AppNetwork.effectiveType).toBe('2g')
        expect(wrapper.vm.$q.network.effectiveType).toBe('2g')

        setConnection({ effectiveType: '4g' })
        expect(AppNetwork.effectiveType).toBe('4g')
      })
    })

    describe('[(prop)downlink]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppNetwork.downlink).toBeTypeOf('number')
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppNetwork.downlink).toBe(10)

        setConnection({ downlink: 1.45 })
        expect(AppNetwork.downlink).toBe(1.45)
        expect(wrapper.vm.$q.network.downlink).toBe(1.45)

        setConnection({ downlink: 10 })
        expect(AppNetwork.downlink).toBe(10)
      })
    })

    describe('[(prop)rtt]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppNetwork.rtt).toBeTypeOf('number')
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppNetwork.rtt).toBe(50)

        setConnection({ rtt: 300 })
        expect(AppNetwork.rtt).toBe(300)
        expect(wrapper.vm.$q.network.rtt).toBe(300)

        setConnection({ rtt: 50 })
        expect(AppNetwork.rtt).toBe(50)
      })
    })

    describe('[(prop)saveData]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppNetwork.saveData).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppNetwork.saveData).toBe(false)

        setConnection({ saveData: true })
        expect(AppNetwork.saveData).toBe(true)
        expect(wrapper.vm.$q.network.saveData).toBe(true)

        setConnection({ saveData: false })
        expect(AppNetwork.saveData).toBe(false)
      })
    })
  })

  describe('[Generic]', () => {
    test('a change while offline at install time lands in the state', () => {
      // the state is only ever read through the plugin's listeners, so a
      // prop that changes together with the online state must be reported
      // through its own event
      setOnline(false)
      setConnection({ effectiveType: 'slow-2g', rtt: 3000 })

      expect(AppNetwork.online).toBe(false)
      expect(AppNetwork.effectiveType).toBe('slow-2g')
      expect(AppNetwork.rtt).toBe(3000)

      setOnline(true)
      setConnection({ effectiveType: '4g', rtt: 50 })
    })
    test('defers the real state until the markup is hydrated', async () => {
      // a fresh copy of the plugin, so that we get its first install again
      // (the singleton above already installed itself in non-SSR mode)
      const { default: Plugin } = await import('./AppNetwork.js?ssr-hydration')

      isOnline = false
      isRuntimeSsrPreHydration.value = true
      quasarVuePlugin.install = app =>
        install(app, { plugins: { AppNetwork: Plugin } })

      try {
        const wrapper = mountPlugin()

        // the server rendered with the defaults
        expect(Plugin.online).toBe(true)
        expect(Plugin.hasConnectionInfo).toBe(false)
        expect(Plugin.effectiveType).toBe(void 0)

        wrapper.vm.$q.onSSRHydrated()

        expect(Plugin.online).toBe(false)
        expect(Plugin.hasConnectionInfo).toBe(true)
        expect(Plugin.effectiveType).toBe('4g')
        expect(Plugin.downlink).toBe(10)
      } finally {
        quasarVuePlugin.install = app =>
          install(app, { plugins: { AppNetwork } })
        isRuntimeSsrPreHydration.value = false
        isOnline = true
      }
    })
  })
})
