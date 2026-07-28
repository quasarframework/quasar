import { nextTick } from 'vue'
import { describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Notify from './Notify.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { Notify } })

describe('[Notify API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Notify.create).toBe(wrapper.vm.$q.notify)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)create]', () => {
      test('should be callable', async () => {
        mountPlugin()
        await nextTick()
        const onDismiss = vi.fn()

        const dismiss = Notify.create({
          message: 'John Doe pinged you',
          group: false,
          timeout: 0,
          onDismiss
        })

        expect(dismiss).toBeTypeOf('function')

        dismiss()
        expect(onDismiss).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)setDefaults]', () => {
      test('should be callable', async () => {
        mountPlugin()
        await nextTick()
        const onDismiss = vi.fn()

        expect(
          Notify.setDefaults({
            group: false,
            timeout: 0,
            onDismiss
          })
        ).toBeUndefined()

        const dismiss = Notify.create({
          message: 'Default notification'
        })

        dismiss()
        expect(onDismiss).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(method)registerType]', () => {
      test('should be callable', async () => {
        mountPlugin()
        await nextTick()
        const onDismiss = vi.fn()

        expect(
          Notify.registerType('my-type', {
            group: false,
            timeout: 0,
            onDismiss
          })
        ).toBeUndefined()

        const dismiss = Notify.create({
          type: 'my-type',
          message: 'Typed notification'
        })

        dismiss()
        expect(onDismiss).toHaveBeenCalledTimes(1)
      })
    })
  })
})
