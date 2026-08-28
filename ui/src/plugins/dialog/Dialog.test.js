import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Dialog from './Dialog.js'

const mountPlugin = () => mount({ render: () => h('div') })

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

      describe('dismissal reason', () => {
        const cancelLabel = 'Cancel'

        const showDialog = async () => {
          mountPlugin()

          const onOk = vi.fn()
          const onCancel = vi.fn()
          const onDismiss = vi.fn()

          const api = Dialog.create({
            title: 'Continue?',
            progress: false,
            ok: 'Continue',
            cancel: cancelLabel
          })
            .onOk(onOk)
            .onCancel(onCancel)
            .onDismiss(onDismiss)

          await nextTick()
          await nextTick()

          return { api, onOk, onCancel, onDismiss }
        }

        const settle = async () => {
          vi.runAllTimers()
          await nextTick()
        }

        test('passes "cancel" when the Cancel button is clicked', async () => {
          const { onOk, onCancel, onDismiss } = await showDialog()

          ;[...document.querySelectorAll('.q-dialog-plugin .q-btn')]
            .find(btn => btn.textContent.includes(cancelLabel))
            .click()
          await settle()

          expect(onOk).not.toHaveBeenCalled()
          expect(onCancel).toHaveBeenCalledExactlyOnceWith('cancel')
          expect(onDismiss).toHaveBeenCalledExactlyOnceWith('cancel')
        })

        test('passes "backdrop" when the backdrop is clicked', async () => {
          const { onCancel, onDismiss } = await showDialog()

          document
            .querySelector('.q-dialog__backdrop')
            .dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('backdrop')
          expect(onDismiss).toHaveBeenCalledExactlyOnceWith('backdrop')
        })

        test('passes "escape" when the ESC key is pressed', async () => {
          const { onCancel, onDismiss } = await showDialog()

          window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
          window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('escape')
          expect(onDismiss).toHaveBeenCalledExactlyOnceWith('escape')
        })

        test('passes "programmatic" when hidden through the API', async () => {
          const { api, onCancel, onDismiss } = await showDialog()

          api.hide()
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('programmatic')
          expect(onDismiss).toHaveBeenCalledExactlyOnceWith('programmatic')
        })

        test('keeps the OK payload for onDismiss when OK is clicked', async () => {
          const { onOk, onCancel, onDismiss } = await showDialog()

          ;[...document.querySelectorAll('.q-dialog-plugin .q-btn')]
            .find(btn => !btn.textContent.includes(cancelLabel))
            .click()
          await settle()

          expect(onCancel).not.toHaveBeenCalled()
          expect(onOk).toHaveBeenCalledTimes(1)
          expect(onDismiss).toHaveBeenCalledExactlyOnceWith(
            onOk.mock.calls[0][0]
          )
        })
      })
    })
  })
})
