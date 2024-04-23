import { describe, test, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'

import AddressbarColor from './AddressbarColor.js'

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
const { install } = quasarVuePlugin

function mountPlugin (addressbarColor) {
  quasarVuePlugin.install = app => install(app, {
    config: { addressbarColor },
    plugins: { AddressbarColor }
  })

  return mount({ template: '<div />' })
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

        expect(
          AddressbarColor.set('#ff0000')
        ).toBeUndefined()
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
    })
  })
})
