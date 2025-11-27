import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import useDashboardPanels, {
  useDashboardPanelsContext,
  convertSize
} from './use-dashboard-panels.js'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn(key => store[ key ] || null),
    setItem: vi.fn((key, value) => { store[ key ] = value }),
    removeItem: vi.fn(key => { delete store[ key ] }),
    clear: vi.fn(() => { store = {} }),
    get store () { return store }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Helper to create a test component and capture the API
// This works around Vue Test Utils not properly exposing complex objects
function createTestHarness (setupFn) {
  let capturedApi = null

  const TestComponent = defineComponent({
    setup () {
      capturedApi = setupFn()
      return {}
    },
    template: '<div></div>'
  })

  const wrapper = mount(TestComponent)
  return { wrapper, api: capturedApi }
}

describe('[useDashboardPanels API]', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('[Functions]', () => {
    describe('[(function)convertSize]', () => {
      test('returns same value when units match', () => {
        expect(convertSize(50, '%', '%')).toBe(50)
        expect(convertSize(300, 'px', 'px')).toBe(300)
        expect(convertSize(20, 'rem', 'rem')).toBe(20)
      })

      test('converts % to px', () => {
        const result = convertSize(50, '%', 'px', 1000)
        expect(result).toBe(500)
      })

      test('converts px to %', () => {
        const result = convertSize(500, 'px', '%', 1000)
        expect(result).toBe(50)
      })

      test('converts px to rem', () => {
        const result = convertSize(32, 'px', 'rem', 0, 16)
        expect(result).toBe(2)
      })

      test('converts rem to px', () => {
        const result = convertSize(2, 'rem', 'px', 0, 16)
        expect(result).toBe(32)
      })

      test('converts % to rem', () => {
        const result = convertSize(50, '%', 'rem', 1000, 16)
        expect(result).toBe(31.25) // 500px / 16
      })

      test('handles zero container size', () => {
        const result = convertSize(500, 'px', '%', 0)
        expect(result).toBe(0)
      })
    })

    describe('[(function)useDashboardPanels]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useDashboardPanels()
              return { result }
            }
          })
        )

        expect(wrapper.vm.result).toBeTypeOf('object')
        expect(wrapper.vm.result).toHaveProperty('panelStates')
        expect(wrapper.vm.result).toHaveProperty('registeredPanels')
        expect(typeof wrapper.vm.result.registerPanel).toBe('function')
      })

      test('accepts options parameter', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useDashboardPanels({ storageKey: 'test-key', persist: true })
              return { result }
            }
          })
        )

        expect(wrapper.vm.result).toBeTypeOf('object')
        expect(wrapper.vm.result).toHaveProperty('panelStates')
      })
    })

    describe('[(function)useDashboardPanelsContext]', () => {
      test('returns null when no provider exists', () => {
        let context = null

        const TestComponent = defineComponent({
          setup () {
            context = useDashboardPanelsContext()
            return {}
          },
          template: '<div></div>'
        })

        mount(TestComponent)

        expect(context).toBe(null)
      })

      test('returns context when provider exists', () => {
        let childContext = null

        const ChildComponent = defineComponent({
          setup () {
            childContext = useDashboardPanelsContext()
            return {}
          },
          template: '<div></div>'
        })

        const ParentComponent = defineComponent({
          components: { ChildComponent },
          setup () {
            useDashboardPanels()
            return {}
          },
          template: '<ChildComponent />'
        })

        mount(ParentComponent)

        expect(childContext).not.toBe(null)
        expect(typeof childContext.registerPanel).toBe('function')
      })
    })
  })

  describe('[Generic]', () => {
    describe('[Return Values]', () => {
      test('returns expected API', () => {
        const { api } = createTestHarness(() => useDashboardPanels())

        expect(api).toHaveProperty('panelStates')
        expect(api).toHaveProperty('registeredPanels')
        expect(typeof api.registerPanel).toBe('function')
        expect(typeof api.unregisterPanel).toBe('function')
        expect(typeof api.getPanelState).toBe('function')
        expect(typeof api.setPanelSize).toBe('function')
        expect(typeof api.setPanelCollapsed).toBe('function')
        expect(typeof api.setPanelMaximized).toBe('function')
        expect(typeof api.toggleCollapsed).toBe('function')
        expect(typeof api.toggleMaximized).toBe('function')
        expect(typeof api.resetAll).toBe('function')
        expect(typeof api.saveState).toBe('function')
      })
    })

    describe('[Panel Registration]', () => {
      test('registerPanel adds panel to state', () => {
        let state = null
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          state = api.registerPanel('panel-1', {
            size: 50,
            collapsed: false,
            maximized: false
          })
          return api
        })

        expect(state).toEqual({
          size: 50,
          collapsed: false,
          maximized: false
        })
        expect(api.registeredPanels.value.has('panel-1')).toBe(true)
      })

      test('unregisterPanel removes panel from tracking', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { size: 50 })
          api.unregisterPanel('panel-1')
          return api
        })

        expect(api.registeredPanels.value.has('panel-1')).toBe(false)
      })

      test('getPanelState returns null for unregistered panel', () => {
        const { api } = createTestHarness(() => useDashboardPanels())

        expect(api.getPanelState('non-existent')).toBe(null)
      })
    })

    describe('[State Management]', () => {
      test('setPanelSize updates size with clamping', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { size: 50 })
          return api
        })

        // Normal update
        api.setPanelSize('panel-1', 60)
        expect(api.getPanelState('panel-1').size).toBe(60)

        // Clamp to min
        api.setPanelSize('panel-1', 5, 15, 100)
        expect(api.getPanelState('panel-1').size).toBe(15)

        // Clamp to max
        api.setPanelSize('panel-1', 150, 15, 100)
        expect(api.getPanelState('panel-1').size).toBe(100)
      })

      test('setPanelCollapsed updates collapsed state', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { collapsed: false })
          return api
        })

        api.setPanelCollapsed('panel-1', true)
        expect(api.getPanelState('panel-1').collapsed).toBe(true)

        api.setPanelCollapsed('panel-1', false)
        expect(api.getPanelState('panel-1').collapsed).toBe(false)
      })

      test('setPanelMaximized updates maximized state', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { maximized: false })
          return api
        })

        api.setPanelMaximized('panel-1', true)
        expect(api.getPanelState('panel-1').maximized).toBe(true)
      })

      test('toggleCollapsed toggles state', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { collapsed: false })
          return api
        })

        api.toggleCollapsed('panel-1')
        expect(api.getPanelState('panel-1').collapsed).toBe(true)

        api.toggleCollapsed('panel-1')
        expect(api.getPanelState('panel-1').collapsed).toBe(false)
      })

      test('toggleMaximized toggles state', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { maximized: false })
          return api
        })

        api.toggleMaximized('panel-1')
        expect(api.getPanelState('panel-1').maximized).toBe(true)

        api.toggleMaximized('panel-1')
        expect(api.getPanelState('panel-1').maximized).toBe(false)
      })
    })

    describe('[Persistence]', () => {
      test('saves state to localStorage', () => {
        createTestHarness(() => {
          const api = useDashboardPanels({ storageKey: 'test-group' })
          api.registerPanel('panel-1', { size: 50 })
          api.setPanelSize('panel-1', 60)
          return api
        })

        expect(localStorageMock.setItem).toHaveBeenCalled()
        const savedData = JSON.parse(localStorageMock.store[ 'q-dashboard-panels-test-group' ])
        expect(savedData[ 'panel-1' ].size).toBe(60)
      })

      test('loads state from localStorage', () => {
        localStorageMock.store[ 'q-dashboard-panels-load-test' ] = JSON.stringify({
          'panel-1': { size: 75, collapsed: true, maximized: false }
        })

        let state = null
        createTestHarness(() => {
          const api = useDashboardPanels({ storageKey: 'load-test' })
          state = api.registerPanel('panel-1', { size: 50 })
          return api
        })

        expect(state.size).toBe(75)
        expect(state.collapsed).toBe(true)
      })

      test('persist: false disables persistence', () => {
      // Clear mocks before this test to isolate from isLocalStorageAvailable check
        vi.clearAllMocks()

        createTestHarness(() => {
          const api = useDashboardPanels({ persist: false })
          api.registerPanel('panel-1', { size: 50 })
          api.setPanelSize('panel-1', 60)
          return api
        })

        // Filter out the isLocalStorageAvailable test calls
        const saveCalls = localStorageMock.setItem.mock.calls.filter(
          call => call[ 0 ] !== '__q_test__'
        )
        expect(saveCalls.length).toBe(0)
      })

      test('resetAll clears all state and storage', () => {
        localStorageMock.store[ 'q-dashboard-panels-reset-test' ] = JSON.stringify({
          'panel-1': { size: 75 }
        })

        const { api } = createTestHarness(() => {
          const api = useDashboardPanels({ storageKey: 'reset-test' })
          api.registerPanel('panel-1', { size: 50 })
          return api
        })

        api.resetAll()

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('q-dashboard-panels-reset-test')
        expect(api.getPanelState('panel-1')).toBe(null)
      })
    })

    describe('[Multiple Panels]', () => {
      test('manages multiple panels independently', () => {
        const { api } = createTestHarness(() => {
          const api = useDashboardPanels()
          api.registerPanel('panel-1', { size: 30 })
          api.registerPanel('panel-2', { size: 40 })
          api.registerPanel('panel-3', { size: 50 })
          return api
        })

        api.setPanelSize('panel-1', 35)
        api.setPanelCollapsed('panel-2', true)
        api.setPanelMaximized('panel-3', true)

        expect(api.getPanelState('panel-1').size).toBe(35)
        expect(api.getPanelState('panel-1').collapsed).toBe(false)

        expect(api.getPanelState('panel-2').size).toBe(40)
        expect(api.getPanelState('panel-2').collapsed).toBe(true)

        expect(api.getPanelState('panel-3').size).toBe(50)
        expect(api.getPanelState('panel-3').maximized).toBe(true)
      })
    })

    describe('[Error Handling]', () => {
      test('handles operations on non-existent panels', () => {
        const { api } = createTestHarness(() => useDashboardPanels())

        // These should not throw
        expect(() => api.setPanelSize('non-existent', 50)).not.toThrow()
        expect(() => api.setPanelCollapsed('non-existent', true)).not.toThrow()
        expect(() => api.setPanelMaximized('non-existent', true)).not.toThrow()
        expect(() => api.toggleCollapsed('non-existent')).not.toThrow()
        expect(() => api.toggleMaximized('non-existent')).not.toThrow()
      })

      test('handles invalid JSON in localStorage', () => {
        localStorageMock.store[ 'q-dashboard-panels-invalid' ] = 'not-valid-json{'

        let state = null
        createTestHarness(() => {
          const api = useDashboardPanels({ storageKey: 'invalid' })
          state = api.registerPanel('panel-1', { size: 50 })
          return api
        })

        // Should use default values
        expect(state.size).toBe(50)
      })
    })
  })
})
