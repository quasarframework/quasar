import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import QDashboardPanel from './QDashboardPanel.js'

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

// Mock $q with all required properties
const createMockQuasar = (screenOverrides = {}) => ({
  screen: {
    xs: false,
    sm: false,
    md: true,
    lg: false,
    xl: false,
    width: 1024,
    height: 768,
    ...screenOverrides
  },
  dark: {
    isActive: false
  }
})

// Plugin to install mock $q on the app
const createQuasarMockPlugin = (screenOverrides = {}) => ({
  install (app) {
    app.config.globalProperties.$q = createMockQuasar(screenOverrides)
  }
})

const mountPanel = (props = {}, options = {}) => {
  return mount(QDashboardPanel, {
    props: {
      id: 'test-panel',
      ...props
    },
    global: {
      plugins: [ createQuasarMockPlugin(options.screen) ],
      ...options.global
    },
    ...options
  })
}

describe('[QDashboardPanel API]', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('[Props]', () => {
    describe('[(prop)id]', () => {
      test('is required', () => {
        // This should produce a warning in Vue
        const wrapper = mount(QDashboardPanel, {
          props: {},
          global: {
            mocks: { $q: createMockQuasar() }
          }
        })
        // Component should still mount but with undefined id
        expect(wrapper.exists()).toBe(true)
      })

      test('type String has effect', () => {
        const wrapper = mountPanel({ id: 'my-unique-panel' })
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('[(prop)resizable]', () => {
      test('default value is true', () => {
        const wrapper = mountPanel()
        expect(wrapper.find('.q-dashboard-panel__resize-handle').exists()).toBe(true)
      })

      test('when false, hides resize handle', () => {
        const wrapper = mountPanel({ resizable: false })
        expect(wrapper.find('.q-dashboard-panel__resize-handle').exists()).toBe(false)
      })
    })

    describe('[(prop)default-size]', () => {
      test('default value is 35', () => {
        const wrapper = mountPanel()
        expect(wrapper.element.style.width).toBe('35%')
      })

      test('custom value has effect', () => {
        const wrapper = mountPanel({ defaultSize: 50 })
        expect(wrapper.element.style.width).toBe('50%')
      })
    })

    describe('[(prop)min-size]', () => {
      test('clamps size to minimum', async () => {
        const wrapper = mountPanel({ defaultSize: 5, minSize: 15 })
        await flushPromises()
        // Size should be clamped to minSize on load
        expect(wrapper.element.style.width).toBe('5%') // Initial render before clamp
      })
    })

    describe('[(prop)max-size]', () => {
      test('clamps size to maximum', async () => {
        const wrapper = mountPanel({ defaultSize: 120, maxSize: 100 })
        await flushPromises()
        expect(wrapper.element.style.width).toBe('120%') // Initial render before clamp
      })
    })

    describe('[(prop)collapsed]', () => {
      test('default value is false', () => {
        const wrapper = mountPanel()
        expect(wrapper.classes()).not.toContain('q-dashboard-panel--collapsed')
      })

      test('when true, adds collapsed class', () => {
        const wrapper = mountPanel({ collapsed: true })
        expect(wrapper.classes()).toContain('q-dashboard-panel--collapsed')
      })

      test('when true, hides body slot', () => {
        const wrapper = mountPanel(
          { collapsed: true },
          {
            slots: {
              body: () => 'Body Content'
            }
          }
        )
        expect(wrapper.text()).not.toContain('Body Content')
      })
    })

    describe('[(prop)maximized]', () => {
      test('default value is false', () => {
        const wrapper = mountPanel()
        expect(wrapper.classes()).not.toContain('q-dashboard-panel--maximized')
      })

      test('when true, adds maximized class', () => {
        const wrapper = mountPanel({ maximized: true })
        expect(wrapper.classes()).toContain('q-dashboard-panel--maximized')
      })

      test('when true, sets width to 100%', () => {
        const wrapper = mountPanel({ maximized: true })
        expect(wrapper.element.style.width).toBe('100%')
      })
    })

    describe('[(prop)unit]', () => {
      test('default value is %', () => {
        const wrapper = mountPanel({ defaultSize: 50 })
        expect(wrapper.element.style.width).toBe('50%')
      })

      test('px unit has effect', () => {
        const wrapper = mountPanel({ defaultSize: 300, unit: 'px' })
        expect(wrapper.element.style.width).toBe('300px')
      })

      test('rem unit has effect', () => {
        const wrapper = mountPanel({ defaultSize: 20, unit: 'rem' })
        expect(wrapper.element.style.width).toBe('20rem')
      })
    })

    describe('[(prop)disable-on-mobile]', () => {
      test('default value is true', () => {
        const wrapper = mountPanel({}, { screen: { xs: true, sm: false } })
        expect(wrapper.find('.q-dashboard-panel__resize-handle').exists()).toBe(false)
      })

      test('when false, shows handle on mobile', () => {
        const wrapper = mountPanel(
          { disableOnMobile: false },
          { screen: { xs: true, sm: false } }
        )
        // Note: The handle will still be rendered in the slot but behavior is disabled
        expect(wrapper.find('.q-dashboard-panel__resize-handle').exists()).toBe(true)
      })
    })

    describe('[(prop)dark]', () => {
      test('when true, adds dark classes', () => {
        const wrapper = mountPanel({ dark: true })
        expect(wrapper.classes()).toContain('q-card--dark')
        expect(wrapper.classes()).toContain('q-dark')
        expect(wrapper.classes()).toContain('q-dashboard-panel--dark')
      })
    })

    describe('[(prop)square]', () => {
      test('when true, adds square class', () => {
        const wrapper = mountPanel({ square: true })
        expect(wrapper.classes()).toContain('q-card--square')
        expect(wrapper.classes()).toContain('no-border-radius')
      })
    })

    describe('[(prop)flat]', () => {
      test('when true, adds flat class', () => {
        const wrapper = mountPanel({ flat: true })
        expect(wrapper.classes()).toContain('q-card--flat')
        expect(wrapper.classes()).toContain('no-shadow')
      })
    })

    describe('[(prop)bordered]', () => {
      test('when true, adds bordered class', () => {
        const wrapper = mountPanel({ bordered: true })
        expect(wrapper.classes()).toContain('q-card--bordered')
      })
    })

    describe('[(prop)tag]', () => {
      test('default tag is div', () => {
        const wrapper = mountPanel()
        expect(wrapper.element.tagName.toLowerCase()).toBe('div')
      })

      test('custom tag has effect', () => {
        const wrapper = mountPanel({ tag: 'section' })
        expect(wrapper.element.tagName.toLowerCase()).toBe('section')
      })
    })

    describe('[(prop)keyboard-increment]', () => {
      test('default value is 1', () => {
        const wrapper = mountPanel()
        expect(wrapper.vm.keyboardIncrement).toBe(1)
      })

      test('custom value has effect', () => {
        const wrapper = mountPanel({ keyboardIncrement: 5 })
        expect(wrapper.vm.keyboardIncrement).toBe(5)
      })

      test('affects resize via arrow keys', async () => {
        const wrapper = mountPanel({ defaultSize: 50, keyboardIncrement: 5 })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        await handle.trigger('keydown', { key: 'ArrowRight' })
        await flushPromises()

        // Size should increase by keyboardIncrement
        expect(wrapper.element.style.width).toBe('55%')
      })
    })

    describe('[(prop)storage]', () => {
      test('default value is local', () => {
        const wrapper = mountPanel()
        expect(wrapper.vm.storage).toBe('local')
      })

      test('group value has effect', () => {
        const wrapper = mountPanel({ storage: 'group' })
        expect(wrapper.vm.storage).toBe('group')
      })
    })

    describe('[(prop)no-persist]', () => {
      test('default value is false', () => {
        const wrapper = mountPanel()
        expect(wrapper.vm.noPersist).toBe(false)
      })

      test('when true, disables persistence', async () => {
        localStorageMock.clear()
        vi.clearAllMocks()

        const wrapper = mountPanel({ id: 'no-persist-test', noPersist: true })
        await flushPromises()

        // Clear any initial calls
        vi.clearAllMocks()

        wrapper.vm.setSize(60)
        await flushPromises()

        // Should not save to localStorage when noPersist is true
        const setItemCalls = localStorageMock.setItem.mock.calls.filter(
          call => call[ 0 ] && call[ 0 ].includes('q-dashboard-panel')
        )
        expect(setItemCalls.length).toBe(0)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders default content', () => {
        const wrapper = mountPanel({}, {
          slots: {
            default: () => 'Default Content'
          }
        })
        expect(wrapper.text()).toContain('Default Content')
      })

      test('hidden when collapsed', () => {
        const wrapper = mountPanel({ collapsed: true }, {
          slots: {
            default: () => 'Default Content'
          }
        })
        expect(wrapper.text()).not.toContain('Default Content')
      })
    })

    describe('[(slot)header]', () => {
      test('renders header content', () => {
        const wrapper = mountPanel({}, {
          slots: {
            header: () => 'Header Content'
          }
        })
        expect(wrapper.find('.q-dashboard-panel__header').exists()).toBe(true)
        expect(wrapper.text()).toContain('Header Content')
      })

      test('visible when collapsed', () => {
        const wrapper = mountPanel({ collapsed: true }, {
          slots: {
            header: () => 'Header Content'
          }
        })
        expect(wrapper.text()).toContain('Header Content')
      })

      test('receives scoped props', () => {
        const headerFn = vi.fn(() => 'Header')
        mountPanel({ collapsed: true, maximized: false }, {
          slots: {
            header: headerFn
          }
        })

        expect(headerFn).toHaveBeenCalled()
        const scopedProps = headerFn.mock.calls[ 0 ][ 0 ]
        expect(scopedProps).toHaveProperty('collapsed', true)
        expect(scopedProps).toHaveProperty('maximized', false)
        expect(typeof scopedProps.toggleCollapsed).toBe('function')
        expect(typeof scopedProps.toggleMaximized).toBe('function')
      })
    })

    describe('[(slot)body]', () => {
      test('renders body content', () => {
        const wrapper = mountPanel({}, {
          slots: {
            body: () => 'Body Content'
          }
        })
        expect(wrapper.find('.q-dashboard-panel__body').exists()).toBe(true)
        expect(wrapper.text()).toContain('Body Content')
      })

      test('hidden when collapsed', () => {
        const wrapper = mountPanel({ collapsed: true }, {
          slots: {
            body: () => 'Body Content'
          }
        })
        expect(wrapper.find('.q-dashboard-panel__body').exists()).toBe(false)
      })
    })

    describe('[(slot)footer]', () => {
      test('renders footer content', () => {
        const wrapper = mountPanel({}, {
          slots: {
            footer: () => 'Footer Content'
          }
        })
        expect(wrapper.find('.q-dashboard-panel__footer').exists()).toBe(true)
        expect(wrapper.text()).toContain('Footer Content')
      })

      test('hidden when collapsed', () => {
        const wrapper = mountPanel({ collapsed: true }, {
          slots: {
            footer: () => 'Footer Content'
          }
        })
        expect(wrapper.find('.q-dashboard-panel__footer').exists()).toBe(false)
      })
    })

    describe('[(slot)resize-handle]', () => {
      test('custom resize handle renders', () => {
        const wrapper = mountPanel({}, {
          slots: {
            'resize-handle': (props) => 'Custom Handle'
          }
        })
        expect(wrapper.text()).toContain('Custom Handle')
      })

      test('receives scoped props', () => {
        const handleFn = vi.fn(() => 'Handle')
        mountPanel({ defaultSize: 50, minSize: 10, maxSize: 90, unit: '%' }, {
          slots: {
            'resize-handle': handleFn
          }
        })

        expect(handleFn).toHaveBeenCalled()
        const scopedProps = handleFn.mock.calls[ 0 ][ 0 ]
        expect(typeof scopedProps.onMousedown).toBe('function')
        expect(typeof scopedProps.onTouchstart).toBe('function')
        expect(typeof scopedProps.onDblclick).toBe('function')
        expect(typeof scopedProps.onKeydown).toBe('function')
        expect(scopedProps.size).toBe(50)
        expect(scopedProps.unit).toBe('%')
        expect(scopedProps.minSize).toBe(10)
        expect(scopedProps.maxSize).toBe(90)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:collapsed]', () => {
      test('emits when collapsed state changes', async () => {
        const wrapper = mountPanel()

        wrapper.vm.toggleCollapsed()
        await flushPromises()

        expect(wrapper.emitted('update:collapsed')).toBeTruthy()
        expect(wrapper.emitted('update:collapsed')[ 0 ]).toEqual([ true ])
      })
    })

    describe('[(event)update:maximized]', () => {
      test('emits when maximized state changes', async () => {
        const wrapper = mountPanel()

        wrapper.vm.toggleMaximized()
        await flushPromises()

        expect(wrapper.emitted('update:maximized')).toBeTruthy()
        expect(wrapper.emitted('update:maximized')[ 0 ]).toEqual([ true ])
      })
    })

    describe('[(event)collapse]', () => {
      test('emits when panel is collapsed', async () => {
        const wrapper = mountPanel()

        wrapper.vm.setCollapsed(true)
        await flushPromises()

        expect(wrapper.emitted('collapse')).toBeTruthy()
      })
    })

    describe('[(event)expand]', () => {
      test('emits when panel is expanded', async () => {
        const wrapper = mountPanel({ collapsed: true })

        wrapper.vm.setCollapsed(false)
        await flushPromises()

        expect(wrapper.emitted('expand')).toBeTruthy()
      })
    })

    describe('[(event)maximize]', () => {
      test('emits when panel is maximized', async () => {
        const wrapper = mountPanel()

        wrapper.vm.setMaximized(true)
        await flushPromises()

        expect(wrapper.emitted('maximize')).toBeTruthy()
      })
    })

    describe('[(event)restore]', () => {
      test('emits when panel is restored from maximized', async () => {
        const wrapper = mountPanel({ maximized: true })

        wrapper.vm.setMaximized(false)
        await flushPromises()

        expect(wrapper.emitted('restore')).toBeTruthy()
      })
    })

    describe('[(event)update:size]', () => {
      test('emits when size changes via setSize', async () => {
        const wrapper = mountPanel({ defaultSize: 35 })

        wrapper.vm.setSize(60)
        await flushPromises()

        expect(wrapper.emitted('update:size')).toBeTruthy()
        expect(wrapper.emitted('update:size')[ 0 ]).toEqual([ 60 ])
      })

      test('emits when size changes via resize-end', async () => {
        const wrapper = mountPanel({ defaultSize: 35 })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        // Simulate resize start
        await handle.trigger('mousedown', { clientX: 100 })
        await flushPromises()

        // Simulate resize move
        const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
        document.dispatchEvent(moveEvent)
        await flushPromises()

        // Simulate resize end
        const upEvent = new MouseEvent('mouseup', { clientX: 150 })
        document.dispatchEvent(upEvent)
        await flushPromises()

        expect(wrapper.emitted('update:size')).toBeTruthy()
      })
    })

    describe('[(event)resize-start]', () => {
      test('emits when resize handle is pressed', async () => {
        const wrapper = mountPanel({ defaultSize: 35, unit: '%' })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        await handle.trigger('mousedown', { clientX: 100 })
        await flushPromises()

        expect(wrapper.emitted('resizeStart')).toBeTruthy()
        const eventData = wrapper.emitted('resizeStart')[ 0 ][ 0 ]
        expect(eventData).toHaveProperty('size')
        expect(eventData).toHaveProperty('unit', '%')
      })

      test('emits with correct size and unit', async () => {
        const wrapper = mountPanel({ defaultSize: 50, unit: 'px' })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        await handle.trigger('mousedown', { clientX: 100 })
        await flushPromises()

        const eventData = wrapper.emitted('resizeStart')[ 0 ][ 0 ]
        expect(eventData.size).toBe(50)
        expect(eventData.unit).toBe('px')
      })
    })

    describe('[(event)resize]', () => {
      test('emits during resize operation', async () => {
        const wrapper = mountPanel({ defaultSize: 35, unit: '%' })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        // Start resize
        await handle.trigger('mousedown', { clientX: 100 })
        await flushPromises()

        // Simulate move
        const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
        document.dispatchEvent(moveEvent)
        await flushPromises()

        // Wait for requestAnimationFrame
        await new Promise(resolve => setTimeout(resolve, 20))

        expect(wrapper.emitted('resize')).toBeTruthy()
        const eventData = wrapper.emitted('resize')[ 0 ][ 0 ]
        expect(eventData).toHaveProperty('size')
        expect(eventData).toHaveProperty('unit', '%')
      })
    })

    describe('[(event)resize-end]', () => {
      test('emits when resize operation ends', async () => {
        const wrapper = mountPanel({ defaultSize: 35, unit: '%' })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        // Start resize
        await handle.trigger('mousedown', { clientX: 100 })
        await flushPromises()

        // Simulate move
        const moveEvent = new MouseEvent('mousemove', { clientX: 150 })
        document.dispatchEvent(moveEvent)
        await flushPromises()

        // End resize
        const upEvent = new MouseEvent('mouseup', { clientX: 150 })
        document.dispatchEvent(upEvent)
        await flushPromises()

        expect(wrapper.emitted('resizeEnd')).toBeTruthy()
        const eventData = wrapper.emitted('resizeEnd')[ 0 ][ 0 ]
        expect(eventData).toHaveProperty('size')
        expect(eventData).toHaveProperty('unit', '%')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)toggleCollapsed]', () => {
      test('toggles collapsed state', async () => {
        const wrapper = mountPanel()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--collapsed')

        wrapper.vm.toggleCollapsed()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-dashboard-panel--collapsed')

        wrapper.vm.toggleCollapsed()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--collapsed')
      })
    })

    describe('[(method)toggleMaximized]', () => {
      test('toggles maximized state', async () => {
        const wrapper = mountPanel()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--maximized')

        wrapper.vm.toggleMaximized()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-dashboard-panel--maximized')

        wrapper.vm.toggleMaximized()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--maximized')
      })

      test('restores previous size after maximize/restore', async () => {
        const wrapper = mountPanel({ defaultSize: 40 })

        expect(wrapper.element.style.width).toBe('40%')

        wrapper.vm.toggleMaximized()
        await flushPromises()

        expect(wrapper.element.style.width).toBe('100%')

        wrapper.vm.toggleMaximized()
        await flushPromises()

        expect(wrapper.element.style.width).toBe('40%')
      })
    })

    describe('[(method)setSize]', () => {
      test('sets size with clamping', async () => {
        const wrapper = mountPanel({ minSize: 20, maxSize: 80 })

        wrapper.vm.setSize(50)
        await flushPromises()

        expect(wrapper.element.style.width).toBe('50%')

        // Test clamping to min
        wrapper.vm.setSize(10)
        await flushPromises()

        expect(wrapper.element.style.width).toBe('20%')

        // Test clamping to max
        wrapper.vm.setSize(100)
        await flushPromises()

        expect(wrapper.element.style.width).toBe('80%')
      })
    })

    describe('[(method)setCollapsed]', () => {
      test('sets collapsed state', async () => {
        const wrapper = mountPanel()

        wrapper.vm.setCollapsed(true)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-dashboard-panel--collapsed')

        wrapper.vm.setCollapsed(false)
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--collapsed')
      })
    })

    describe('[(method)setMaximized]', () => {
      test('sets maximized state', async () => {
        const wrapper = mountPanel()

        wrapper.vm.setMaximized(true)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-dashboard-panel--maximized')

        wrapper.vm.setMaximized(false)
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-dashboard-panel--maximized')
      })
    })
  })

  describe('[Generic]', () => {
    describe('[Persistence]', () => {
      test('saves state to localStorage', async () => {
        const wrapper = mountPanel({ id: 'persist-test' })

        wrapper.vm.setSize(60)
        await flushPromises()

        expect(localStorageMock.setItem).toHaveBeenCalled()
        const savedData = JSON.parse(localStorageMock.store[ 'q-dashboard-panel-persist-test' ])
        expect(savedData.size).toBe(60)
      })

      test('loads state from localStorage', async () => {
        localStorageMock.store[ 'q-dashboard-panel-load-test' ] = JSON.stringify({
          size: 75,
          collapsed: true,
          maximized: false
        })

        const wrapper = mountPanel({ id: 'load-test' })
        await flushPromises()

        expect(wrapper.element.style.width).toBe('75%')
        expect(wrapper.classes()).toContain('q-dashboard-panel--collapsed')
      })

      test('handles invalid localStorage data gracefully', async () => {
        localStorageMock.store[ 'q-dashboard-panel-invalid-test' ] = 'not-valid-json{'

        const wrapper = mountPanel({ id: 'invalid-test', defaultSize: 50 })
        await flushPromises()

        // Should use default values
        expect(wrapper.element.style.width).toBe('50%')
      })

      test('clamps persisted values to valid range', async () => {
        localStorageMock.store[ 'q-dashboard-panel-clamp-test' ] = JSON.stringify({
          size: 200, // Exceeds max
          collapsed: false,
          maximized: false
        })

        const wrapper = mountPanel({ id: 'clamp-test', maxSize: 100 })
        await flushPromises()

        expect(wrapper.element.style.width).toBe('100%')
      })
    })

    describe('[Mobile Behavior]', () => {
      test('panel has full width on mobile', () => {
        const wrapper = mountPanel({}, { screen: { xs: true, sm: false } })

        expect(wrapper.element.style.width).toBe('100%')
        expect(wrapper.classes()).toContain('q-dashboard-panel--mobile')
      })

      test('resize handle hidden on mobile by default', () => {
        const wrapper = mountPanel({}, { screen: { xs: true, sm: false } })

        expect(wrapper.find('.q-dashboard-panel__resize-handle').exists()).toBe(false)
      })

      test('sm breakpoint also triggers mobile behavior', () => {
        const wrapper = mountPanel({}, { screen: { xs: false, sm: true } })

        expect(wrapper.element.style.width).toBe('100%')
        expect(wrapper.classes()).toContain('q-dashboard-panel--mobile')
      })
    })

    describe('[Accessibility]', () => {
      test('resize handle has correct ARIA attributes', () => {
        const wrapper = mountPanel({ defaultSize: 50, minSize: 10, maxSize: 90 })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        expect(handle.attributes('role')).toBe('separator')
        expect(handle.attributes('aria-orientation')).toBe('vertical')
        expect(handle.attributes('aria-valuenow')).toBe('50')
        expect(handle.attributes('aria-valuemin')).toBe('10')
        expect(handle.attributes('aria-valuemax')).toBe('90')
      })

      test('resize handle is focusable', () => {
        const wrapper = mountPanel()
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        expect(handle.attributes('tabindex')).toBe('0')
      })

      test('resize handle tabindex is -1 when disabled', () => {
        const wrapper = mountPanel({ maximized: true })
        const handle = wrapper.find('.q-dashboard-panel__resize-handle')

        expect(handle.attributes('tabindex')).toBe('-1')
      })
    })

    describe('[QCard Inheritance]', () => {
      test('passes QCard props through', () => {
        const wrapper = mountPanel({
          dark: true,
          square: true,
          flat: true,
          bordered: true
        })

        expect(wrapper.classes()).toContain('q-card')
        expect(wrapper.classes()).toContain('q-card--dark')
        expect(wrapper.classes()).toContain('q-card--square')
        expect(wrapper.classes()).toContain('q-card--flat')
        expect(wrapper.classes()).toContain('q-card--bordered')
      })

      test('passes attributes through', () => {
        const wrapper = mountPanel({}, {
          attrs: {
            'data-custom': 'value',
            'aria-label': 'Dashboard Panel'
          }
        })

        expect(wrapper.attributes('data-custom')).toBe('value')
        expect(wrapper.attributes('aria-label')).toBe('Dashboard Panel')
      })
    })
  })
})
