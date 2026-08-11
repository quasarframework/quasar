import { h } from 'vue'
import { describe, expect, test } from 'vitest'
import { config, mount } from '@vue/test-utils'

import AppVisibility from './AppVisibility.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { AppVisibility } })

describe('[AppVisibility API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(wrapper.vm.$q.appVisible).toBe(AppVisibility.appVisible)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)appVisible]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(AppVisibility.appVisible).toBe(true)
      })

      test('is reactive', () => {
        const wrapper = mountPlugin()
        expect(AppVisibility.appVisible).toBe(true)

        // The browser exposes document.visibilityState/document.hidden as
        // read-only Document.prototype getters and we cannot actually hide
        // the page from inside it, so we shadow them with own-property
        // getters (removable via delete) and dispatch a real
        // visibilitychange event
        Object.defineProperty(document, 'visibilityState', {
          configurable: true,
          get: () => 'hidden'
        })
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true
        })

        document.dispatchEvent(new Event('visibilitychange'))

        expect(AppVisibility.appVisible).toBe(false)
        expect(wrapper.vm.$q.appVisible).toBe(false)

        // restore the native prototype getters
        delete document.visibilityState
        delete document.hidden

        document.dispatchEvent(new Event('visibilitychange'))

        expect(AppVisibility.appVisible).toBe(true)
        expect(wrapper.vm.$q.appVisible).toBe(true)
      })
    })
  })
})
