/**
 * QThemeDesigner component tests
 */

import { mount, flushPromises } from '@vue/test-utils'
import {
  describe, test, expect, vi,
  beforeEach, afterEach
} from 'vitest'

import QThemeDesigner from './QThemeDesigner.js'
import { defaultTheme } from '../../json/themeSerializer.js'

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[ key ] || null),
  setItem: vi.fn((key, value) => { localStorageMock.store[ key ] = value }),
  removeItem: vi.fn((key) => { delete localStorageMock.store[ key ] }),
  clear: vi.fn(() => { localStorageMock.store = {} })
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve())
  },
  writable: true
})

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      PROD: false,
      DEV: true
    }
  }
})

let wrapper = null

beforeEach(() => {
  vi.useFakeTimers()
  localStorageMock.clear()
  vi.clearAllMocks()

  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

describe('[QThemeDesigner API]', () => {
  describe('[Props]', () => {
    describe('[(prop)force]', () => {
      test('renders component when force is true', async () => {
        wrapper = mount(QThemeDesigner, {
          props: {
            force: true
          }
        })

        await flushPromises()

        expect(
          wrapper.find('.q-theme-designer').exists()
        ).toBe(true)
      })

      test('default value is false', () => {
        wrapper = mount(QThemeDesigner)

        expect(
          wrapper.props('force')
        ).toBe(false)
      })
    })
  })

  describe('[Rendering]', () => {
    describe('[Layout]', () => {
      test('renders toolbar', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        expect(
          wrapper.find('.q-theme-designer__toolbar').exists()
        ).toBe(true)
      })

      test('renders main area with sidebar and preview', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        expect(
          wrapper.find('.q-theme-designer__main').exists()
        ).toBe(true)

        expect(
          wrapper.find('.q-theme-designer__sidebar').exists()
        ).toBe(true)

        expect(
          wrapper.find('.q-theme-designer__preview').exists()
        ).toBe(true)
      })

      test('renders Reset All button in toolbar', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const toolbar = wrapper.find('.q-theme-designer__toolbar')
        expect(
          toolbar.text()
        ).toContain('Reset All')
      })

      test('renders Export button in toolbar', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const toolbar = wrapper.find('.q-theme-designer__toolbar')
        expect(
          toolbar.text()
        ).toContain('Export')
      })
    })
  })

  describe('[Child Components]', () => {
    describe('[ThemeDesignerSidebar]', () => {
      test('receives theme prop', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const sidebar = wrapper.findComponent({ name: 'ThemeDesignerSidebar' })
        expect(sidebar.exists()).toBe(true)
        expect(sidebar.props('theme')).toBeDefined()
      })

      test('receives isDarkMode prop', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const sidebar = wrapper.findComponent({ name: 'ThemeDesignerSidebar' })
        expect(sidebar.props('isDarkMode')).toBe(false)
      })
    })

    describe('[ThemeDesignerPreview]', () => {
      test('receives cssVars prop', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const preview = wrapper.findComponent({ name: 'ThemeDesignerPreview' })
        expect(preview.exists()).toBe(true)

        const cssVars = preview.props('cssVars')
        expect(cssVars).toBeDefined()
        expect(cssVars[ '--q-primary' ]).toBe(defaultTheme.primary)
      })
    })

    describe('[ThemeExportDialog]', () => {
      test('exists but initially hidden', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        expect(dialog.exists()).toBe(true)
        expect(dialog.props('modelValue')).toBe(false)
      })
    })
  })

  describe('[Functionality]', () => {
    describe('[Export]', () => {
      test('export dialog receives exportFormats prop', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        const exportFormats = dialog.props('exportFormats')

        expect(exportFormats).toHaveProperty('sass')
        expect(exportFormats).toHaveProperty('css')
        expect(exportFormats).toHaveProperty('quasarConfig')
        expect(exportFormats).toHaveProperty('vitePlugin')
      })

      test('SASS export contains correct format', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        const { sass } = dialog.props('exportFormats')

        expect(sass).toContain('$primary:')
        expect(sass).toContain(defaultTheme.primary)
      })

      test('CSS export contains correct format', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        const { css } = dialog.props('exportFormats')

        expect(css).toContain('--q-primary:')
        expect(css).toContain(defaultTheme.primary)
        expect(css).toContain(':root {')
      })

      test('Quasar CLI config export contains correct structure', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        const { quasarConfig } = dialog.props('exportFormats')

        expect(quasarConfig).toContain('framework:')
        expect(quasarConfig).toContain('config:')
        expect(quasarConfig).toContain('brand:')
      })

      test('Vite plugin config export contains correct structure', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
        const { vitePlugin } = dialog.props('exportFormats')

        expect(vitePlugin).toContain('quasar(')
        expect(vitePlugin).toContain('sassVariables:')
      })
    })

    describe('[Theme State]', () => {
      test('initializes with default theme colors', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const preview = wrapper.findComponent({ name: 'ThemeDesignerPreview' })
        const cssVars = preview.props('cssVars')

        Object.entries(defaultTheme).forEach(([ key, value ]) => {
          expect(cssVars[ `--q-${ key }` ]).toBe(value)
        })
      })
    })

    describe('[Dark Mode]', () => {
      test('isDarkMode is initially false', async () => {
        wrapper = mount(QThemeDesigner, {
          props: { force: true }
        })

        await flushPromises()

        const sidebar = wrapper.findComponent({ name: 'ThemeDesignerSidebar' })
        expect(sidebar.props('isDarkMode')).toBe(false)

        const preview = wrapper.findComponent({ name: 'ThemeDesignerPreview' })
        expect(preview.props('isDarkMode')).toBe(false)
      })
    })
  })
})

describe('[QThemeDesigner Integration]', () => {
  describe('[All 9 color tokens]', () => {
    test('exports all 9 color tokens', async () => {
      wrapper = mount(QThemeDesigner, {
        props: { force: true }
      })

      await flushPromises()

      const dialog = wrapper.findComponent({ name: 'ThemeExportDialog' })
      const { sass } = dialog.props('exportFormats')

      const expectedTokens = [
        'primary', 'secondary', 'accent',
        'positive', 'negative', 'info', 'warning',
        'dark', 'dark-page'
      ]

      expectedTokens.forEach(token => {
        expect(sass).toContain(`$${ token }:`)
      })
    })
  })

  describe('[CSS variables format]', () => {
    test('cssVars computed includes all tokens with correct prefix', async () => {
      wrapper = mount(QThemeDesigner, {
        props: { force: true }
      })

      await flushPromises()

      const preview = wrapper.findComponent({ name: 'ThemeDesignerPreview' })
      const cssVars = preview.props('cssVars')

      expect(Object.keys(cssVars)).toHaveLength(9)

      Object.keys(cssVars).forEach(key => {
        expect(key).toMatch(/^--q-/)
      })
    })
  })
})



