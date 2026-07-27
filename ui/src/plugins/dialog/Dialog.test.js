import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Dialog from './Dialog.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { Dialog } })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('[Dialog API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Dialog.create).toBe(wrapper.vm.$q.dialog)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)create]', () => {
      test('should be callable', async () => {
        mountPlugin()
        const api = Dialog.create({
          title: 'Continue?',
          message: 'Are you certain you want to continue?',
          progress: false,
          ok: 'Continue',
          cancel: 'Cancel'
        })

        expect(api).toBeTypeOf('object')
        expect(Object.values(api)).not.toHaveLength(0)
        expect(api).$objectValues(expect.any(Function))

        await nextTick()
        await nextTick()

        expect(document.querySelector('.q-dialog-plugin')).not.toBe(null)
        expect(document.body.textContent).toContain('Continue?')

        api.hide()
        vi.runAllTimers()
        await nextTick()

        expect(document.querySelector('.q-dialog-plugin')).toBe(null)
      })
    })
  })
})
