import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import BottomSheet from './BottomSheet.js'

const mountPlugin = () => mount({ render: () => h('div') })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { BottomSheet } })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('[BottomSheet API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(BottomSheet.create).toBe(wrapper.vm.$q.bottomSheet)
    })
  })

  describe('[Methods]', () => {
    describe('[(method)create]', () => {
      test('should be callable', async () => {
        mountPlugin()
        const api = BottomSheet.create({
          title: 'Share',
          message: 'Please select how to share',
          actions: [{ label: 'Facebook', icon: 'share' }],
          grid: true
        })

        expect(api).toBeTypeOf('object')
        expect(Object.values(api)).not.toHaveLength(0)
        expect(api).$objectValues(expect.any(Function))

        await nextTick()
        await nextTick()

        expect(document.querySelector('.q-bottom-sheet--grid')).not.toBe(null)
        expect(document.body.textContent).toContain('Facebook')

        api.hide()
        vi.runAllTimers()
        await nextTick()

        expect(document.querySelector('.q-bottom-sheet--grid')).toBe(null)
      })

      describe('dismissal reason', () => {
        const showBottomSheet = async () => {
          mountPlugin()

          const onCancel = vi.fn()

          const api = BottomSheet.create({
            title: 'Share',
            actions: [{ label: 'Facebook', icon: 'share' }]
          }).onCancel(onCancel)

          await nextTick()
          await nextTick()

          return { api, onCancel }
        }

        const settle = async () => {
          vi.runAllTimers()
          await nextTick()
        }

        test('passes "backdrop" when the backdrop is clicked', async () => {
          const { onCancel } = await showBottomSheet()

          document
            .querySelector('.q-dialog__backdrop')
            .dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('backdrop')
        })

        test('passes "escape" when the ESC key is pressed', async () => {
          const { onCancel } = await showBottomSheet()

          window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
          window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('escape')
        })

        test('passes "programmatic" when hidden through the API', async () => {
          const { api, onCancel } = await showBottomSheet()

          api.hide()
          await settle()

          expect(onCancel).toHaveBeenCalledExactlyOnceWith('programmatic')
        })
      })
    })
  })
})
