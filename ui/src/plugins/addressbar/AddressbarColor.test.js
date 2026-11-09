import { h } from 'vue'
import { describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import { client } from '../platform/Platform.js'
import AddressbarColor from './AddressbarColor.js'

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin

function mountPlugin(addressbarColor) {
  quasarVuePlugin.install = app =>
    install(app, {
      config: { addressbarColor },
      plugins: { AddressbarColor }
    })

  return mount({ render: () => h('div') })
}

let pluginImportId = 0

// "set" is picked when the module is evaluated, so a native mobile
// wrapper needs a fresh module evaluation through a unique query string
async function loadPluginOnNativeMobile() {
  const { mobile, nativeMobile } = client.is
  Object.assign(client.is, { mobile: true, nativeMobile: true })

  const { default: plugin } = await import(
    /* @vite-ignore */ `./AddressbarColor.js?nativeMobile=${++pluginImportId}`
  )

  return {
    plugin,
    restore() {
      Object.assign(client.is, { mobile, nativeMobile })
      document.querySelector('meta[name="theme-color"]')?.remove()
    }
  }
}

describe('[AddressbarColor API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(AddressbarColor).toBe(wrapper.vm.$q.addressbarColor)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        mountPlugin()

        expect(AddressbarColor.set('#ff0000')).toBeUndefined()
      })

      test('should be called automatically when $q.config.addressbarColor is set', () => {
        const original = AddressbarColor.set

        // override original since the real test would be on a
        // mobile platform (and we can't test that here, yet)
        AddressbarColor.set = vi.fn()
        mountPlugin('#aabbcc')

        expect.soft(AddressbarColor.set).toHaveBeenCalledTimes(1)
        expect.soft(AddressbarColor.set).toHaveBeenCalledWith('#aabbcc')

        // restore original
        AddressbarColor.set = original
      })

      test('uses the StatusBar plugin on a native mobile wrapper', async () => {
        const { plugin, restore } = await loadPluginOnNativeMobile()
        const backgroundColorByHexString = vi.fn()
        window.StatusBar = { backgroundColorByHexString }

        try {
          plugin.set('#aabbcc')

          expect(backgroundColorByHexString).toHaveBeenCalledTimes(1)
          expect(backgroundColorByHexString).toHaveBeenCalledWith('#aabbcc')
        } finally {
          delete window.StatusBar
          restore()
        }
      })

      test.each([
        ['an element', '<div id="StatusBar"></div>'],
        // sandboxed, so reading any property of its window throws
        ['a cross-origin iframe', '<iframe sandbox name="StatusBar"></iframe>']
      ])('sets the meta tag when StatusBar is %s', async (_, markup) => {
        const { plugin, restore } = await loadPluginOnNativeMobile()
        const element = document.createElement('div')
        element.innerHTML = markup
        document.body.append(element)

        try {
          expect(window.StatusBar).toBeDefined()
          expect(() => plugin.set('#aabbcc')).not.toThrow()
          expect(
            document.querySelector('meta[name="theme-color"]').content
          ).toBe('#aabbcc')
        } finally {
          element.remove()
          restore()
        }
      })
    })
  })
})
