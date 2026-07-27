import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import BottomSheet from './BottomSheet.js'

const mountPlugin = () => mount({ template: '<div />' })

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
    })
  })
})
