import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Loading from './Loading.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { Loading } })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  Loading.hide()
  vi.runAllTimers()
  vi.useRealTimers()
})

describe('[Loading API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Loading).toBe(wrapper.vm.$q.loading)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Loading.isActive).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        expect(Loading.isActive).toBe(false)

        Loading.show({ delay: 100 })
        expect(Loading.isActive).toBe(true)

        Loading.hide()
        expect(Loading.isActive).toBe(false)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        mountPlugin()
        const hide = Loading.show({
          delay: 0,
          message: 'Processing your request',
          group: 'some-api-call'
        })

        expect(hide).toBeTypeOf('function')
        expect(Loading.isActive).toBe(true)

        vi.runAllTimers()
        await nextTick()

        expect(document.querySelector('.q-loading__message').textContent).toBe(
          'Processing your request'
        )

        hide()
        expect(Loading.isActive).toBe(false)
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        mountPlugin()

        Loading.show({ delay: 0, group: 'some-api-call' })
        vi.runAllTimers()
        await nextTick()

        expect(Loading.isActive).toBe(true)
        expect(document.querySelector('.q-loading')).not.toBe(null)

        expect(Loading.hide('some-api-call')).toBeUndefined()
        expect(Loading.isActive).toBe(false)

        vi.runAllTimers()
        await nextTick()

        expect(document.querySelector('.q-loading')).toBe(null)
      })
    })

    describe('[(method)setDefaults]', () => {
      test('should be callable', async () => {
        mountPlugin()

        expect(
          Loading.setDefaults({
            delay: 0,
            message: 'Default loading message',
            customClass: 'q-test-loading'
          })
        ).toBeUndefined()

        Loading.show()
        vi.runAllTimers()
        await nextTick()

        const loading = document.querySelector('.q-loading')
        expect(loading.classList.contains('q-test-loading')).toBe(true)
        expect(loading.textContent).toContain('Default loading message')
      })
    })
  })
})
