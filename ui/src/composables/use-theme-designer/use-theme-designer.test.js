import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

import useThemeDesigner, {
  getContrastRatio,
  meetsWcagAA,
  getContrastInfo,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEY
} from './use-theme-designer.js'

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

describe('[useThemeDesigner API]', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('[Variables]', () => {
    describe('[(variable)STORAGE_KEY]', () => {
      test('is defined correctly', () => {
        expect(STORAGE_KEY).toBeTypeOf('string')
        expect(STORAGE_KEY).toBe('quasar-theme-designer-last-theme')
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getContrastRatio]', () => {
      test('has correct return value', () => {
        const result = getContrastRatio('#FFFFFF', '#000000')
        expect(result).toBeDefined()
        expect(result).toBeCloseTo(21, 0)
      })

      test('returns 21:1 for black on white', () => {
        const ratio = getContrastRatio('#FFFFFF', '#000000')
        expect(ratio).toBeCloseTo(21, 0)
      })

      test('returns 1:1 for same colors', () => {
        const ratio = getContrastRatio('#FF0000', '#FF0000')
        expect(ratio).toBeCloseTo(1, 1)
      })

      test('calculates correct ratio for primary color', () => {
        const ratio = getContrastRatio('#1976D2', '#FFFFFF')
        expect(ratio).toBeGreaterThan(3)
        expect(ratio).toBeLessThan(10)
      })
    })

    describe('[(function)meetsWcagAA]', () => {
      test('has correct return value', () => {
        const result = meetsWcagAA(4.5, false)
        expect(result).toBeDefined()
        expect(result).toBe(true)
      })

      test('passes for ratio >= 4.5 (normal text)', () => {
        expect(meetsWcagAA(4.5)).toBe(true)
        expect(meetsWcagAA(5.0)).toBe(true)
        expect(meetsWcagAA(21)).toBe(true)
      })

      test('fails for ratio < 4.5 (normal text)', () => {
        expect(meetsWcagAA(4.4)).toBe(false)
        expect(meetsWcagAA(3.0)).toBe(false)
        expect(meetsWcagAA(1.0)).toBe(false)
      })

      test('passes for ratio >= 3 (large text)', () => {
        expect(meetsWcagAA(3.0, true)).toBe(true)
        expect(meetsWcagAA(4.0, true)).toBe(true)
      })

      test('fails for ratio < 3 (large text)', () => {
        expect(meetsWcagAA(2.9, true)).toBe(false)
        expect(meetsWcagAA(1.0, true)).toBe(false)
      })
    })

    describe('[(function)getContrastInfo]', () => {
      test('has correct return value', () => {
        const result = getContrastInfo('#1976D2')
        expect(result).toBeDefined()
        expect(result).toHaveProperty('whiteRatio')
        expect(result).toHaveProperty('blackRatio')
      })

      test('returns contrast info object', () => {
        const info = getContrastInfo('#1976D2')

        expect(info).toHaveProperty('whiteRatio')
        expect(info).toHaveProperty('blackRatio')
        expect(info).toHaveProperty('passesWhiteAA')
        expect(info).toHaveProperty('passesBlackAA')
        expect(info).toHaveProperty('recommendWhiteText')
      })

      test('recommends white text for dark colors', () => {
        const info = getContrastInfo('#1976D2')
        expect(info.recommendWhiteText).toBe(true)
      })

      test('recommends black text for light colors', () => {
        const info = getContrastInfo('#FFFF00')
        expect(info.recommendWhiteText).toBe(false)
      })

      test('returns formatted ratio strings', () => {
        const info = getContrastInfo('#1976D2')
        expect(info.whiteRatio).toMatch(/^\d+\.\d{2}$/)
        expect(info.blackRatio).toMatch(/^\d+\.\d{2}$/)
      })
    })

    describe('[(function)loadFromStorage]', () => {
      test('has correct return value', () => {
        const result = loadFromStorage()
        expect(result).toBeDefined()
        // Returns null when no saved theme
        expect(result).toBeNull()
      })

      test('returns null when localStorage is empty', () => {
        localStorageMock.clear()
        const result = loadFromStorage()
        expect(result).toBeNull()
      })

      test('returns parsed theme when saved', () => {
        const savedTheme = { primary: '#FF0000', secondary: '#00FF00' }
        localStorageMock.setItem(STORAGE_KEY, JSON.stringify(savedTheme))
        const result = loadFromStorage()
        expect(result).toEqual(savedTheme)
      })
    })

    describe('[(function)saveToStorage]', () => {
      test('has correct return value', () => {
        const theme = { primary: '#FF0000' }
        const result = saveToStorage(theme)
        expect(result).toBeUndefined() // saveToStorage returns void
      })

      test('saves theme to localStorage', () => {
        const theme = { primary: '#FF0000', secondary: '#00FF00' }
        saveToStorage(theme)
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify(theme)
        )
      })
    })

    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const result = useThemeDesigner()
              return { result }
            }
          })
        )

        expect(wrapper).toBeDefined()
        expect(wrapper.vm.result).toBeTypeOf('object')
        expect(wrapper.vm.result.theme).toBeDefined()
        expect(wrapper.vm.result.cssVars).toBeDefined()
      })

      test('initializes with default theme', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { theme } = useThemeDesigner()
              return { theme }
            }
          })
        )

        Object.keys(defaultTheme).forEach(key => {
          expect(wrapper.vm.theme[ key ]).toBe(defaultTheme[ key ])
        })
      })

      test('setColor updates theme', async () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { theme, setColor } = useThemeDesigner()
              return { theme, setColor }
            }
          })
        )

        wrapper.vm.setColor('primary', '#FF0000')
        await nextTick()

        expect(wrapper.vm.theme.primary).toBe('#FF0000')
      })

      test('resetTheme restores defaults', async () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { theme, setColor, resetTheme } = useThemeDesigner()
              return { theme, setColor, resetTheme }
            }
          })
        )

        wrapper.vm.setColor('primary', '#FF0000')
        await nextTick()
        expect(wrapper.vm.theme.primary).toBe('#FF0000')

        wrapper.vm.resetTheme()
        await nextTick()
        expect(wrapper.vm.theme.primary).toBe(defaultTheme.primary)
      })

      test('cssVars computed property generates correct format', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { cssVars } = useThemeDesigner()
              return { cssVars }
            }
          })
        )

        const vars = wrapper.vm.cssVars
        expect(vars[ '--q-primary' ]).toBe(defaultTheme.primary)
        expect(vars[ '--q-secondary' ]).toBe(defaultTheme.secondary)
        expect(vars[ '--q-dark-page' ]).toBe(defaultTheme[ 'dark-page' ])
      })

      test('primaryContrast computed property returns contrast info', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { primaryContrast } = useThemeDesigner()
              return { primaryContrast }
            }
          })
        )

        expect(wrapper.vm.primaryContrast).toHaveProperty('whiteRatio')
        expect(wrapper.vm.primaryContrast).toHaveProperty('passesWhiteAA')
      })

      test('toggleDarkMode toggles isDarkMode', async () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { isDarkMode, toggleDarkMode } = useThemeDesigner()
              return { isDarkMode, toggleDarkMode }
            }
          })
        )

        expect(wrapper.vm.isDarkMode).toBe(false)

        wrapper.vm.toggleDarkMode()
        await nextTick()
        expect(wrapper.vm.isDarkMode).toBe(true)

        wrapper.vm.toggleDarkMode()
        await nextTick()
        expect(wrapper.vm.isDarkMode).toBe(false)
      })

      test('openExportDialog and closeExportDialog toggle showExportDialog', async () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { showExportDialog, openExportDialog, closeExportDialog } = useThemeDesigner()
              return { showExportDialog, openExportDialog, closeExportDialog }
            }
          })
        )

        expect(wrapper.vm.showExportDialog).toBe(false)

        wrapper.vm.openExportDialog()
        await nextTick()
        expect(wrapper.vm.showExportDialog).toBe(true)

        wrapper.vm.closeExportDialog()
        await nextTick()
        expect(wrapper.vm.showExportDialog).toBe(false)
      })

      test('exportFormats computed property returns all formats', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { exportFormats } = useThemeDesigner()
              return { exportFormats }
            }
          })
        )

        expect(wrapper.vm.exportFormats).toHaveProperty('sass')
        expect(wrapper.vm.exportFormats).toHaveProperty('css')
        expect(wrapper.vm.exportFormats).toHaveProperty('quasarConfig')
        expect(wrapper.vm.exportFormats).toHaveProperty('vitePlugin')
      })

      test('saves theme to localStorage on change', async () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup () {
              const { theme, setColor } = useThemeDesigner()
              return { theme, setColor }
            }
          })
        )

        wrapper.vm.setColor('primary', '#FF0000')
        await nextTick()

        // Wait for the watch to trigger
        await new Promise(resolve => setTimeout(resolve, 10))

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          expect.stringContaining('#FF0000')
        )
      })
    })
  })
})
