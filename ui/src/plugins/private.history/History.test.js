import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../platform/Platform.js'
import History from './History.js'

/**
 * Can't really fully test it since it handles
 * Capacitor and Cordova platforms
 */

const { capacitor } = client.is

let historyImportId = 0

// install() swaps the methods of this singleton, so each test
// gets a fresh module evaluation through a unique query string
async function installOnCapacitor() {
  client.is.capacitor = true

  const { default: history } = await import(
    /* @vite-ignore */ `./History.js?capacitor=${++historyImportId}`
  )

  history.install({ $q: { config: {} } })
  return history
}

afterEach(() => {
  client.is.capacitor = capacitor
  delete window.Capacitor
})

describe('[History API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)__history]', () => {
      test('is defined correctly', () => {
        expect(Array.isArray(History.__history)).toBe(true)
      })
    })

    describe('[(variable)add]', () => {
      test('is defined correctly', () => {
        expect(History.add).toBeTypeOf('function')
      })
    })

    describe('[(variable)remove]', () => {
      test('is defined correctly', () => {
        expect(History.remove).toBeTypeOf('function')
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)install]', () => {
      test('is defined correctly', () => {
        expect(History.install).toBeTypeOf('function')
      })

      test('listens for the Capacitor back button', async () => {
        const addListener = vi.fn()
        window.Capacitor = { Plugins: { App: { addListener } } }

        const history = await installOnCapacitor()

        expect(addListener).toHaveBeenCalledTimes(1)
        expect(addListener).toHaveBeenCalledWith(
          'backButton',
          expect.any(Function)
        )

        history.add({ handler: vi.fn() })
        expect(history.__history).toHaveLength(1)
      })

      test('does nothing without the Capacitor App plugin', async () => {
        window.Capacitor = { Plugins: {} }

        const history = await installOnCapacitor()

        history.add({ handler: vi.fn() })
        expect(history.__history).toHaveLength(0)
      })

      test('does nothing when Capacitor is a DOM named property', async () => {
        const element = document.createElement('div')
        element.id = 'Capacitor'
        document.body.append(element)

        try {
          expect(window.Capacitor).toBe(element)

          const history = await installOnCapacitor()

          history.add({ handler: vi.fn() })
          expect(history.__history).toHaveLength(0)
        } finally {
          element.remove()
        }
      })
    })
  })
})
