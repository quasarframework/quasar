import { describe, test, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'

import AppVisibility from './AppVisibility.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
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

        // jsdom hack
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => true
        })

        document.dispatchEvent(new Event('visibilitychange'))

        expect(AppVisibility.appVisible).toBe(false)
        expect(wrapper.vm.$q.appVisible).toBe(false)
      })
    })
  })
})
