import { describe, test, expect } from 'vitest'

import {
  defaultTheme,
  colorLabels,
  toSass,
  toCss,
  toQuasarConfig,
  toVitePlugin,
  serializeTheme
} from './themeSerializer.js'

describe('[themeSerializer API]', () => {
  describe('[Constants]', () => {
    describe('[defaultTheme]', () => {
      test('contains all 9 color tokens', () => {
        const expectedTokens = [
          'primary', 'secondary', 'accent',
          'positive', 'negative', 'info', 'warning',
          'dark', 'dark-page'
        ]

        expectedTokens.forEach(token => {
          expect(defaultTheme).toHaveProperty(token)
          expect(defaultTheme[ token ]).toMatch(/^#[0-9A-Fa-f]{6}$/)
        })
      })

      test('has correct default values', () => {
        expect(defaultTheme.primary).toBe('#1976D2')
        expect(defaultTheme.secondary).toBe('#26A69A')
        expect(defaultTheme.accent).toBe('#9C27B0')
        expect(defaultTheme.positive).toBe('#21BA45')
        expect(defaultTheme.negative).toBe('#C10015')
        expect(defaultTheme.info).toBe('#31CCEC')
        expect(defaultTheme.warning).toBe('#F2C037')
        expect(defaultTheme.dark).toBe('#1D1D1D')
        expect(defaultTheme[ 'dark-page' ]).toBe('#121212')
      })
    })

    describe('[colorLabels]', () => {
      test('contains labels for all 9 color tokens', () => {
        expect(Object.keys(colorLabels)).toHaveLength(9)

        expect(colorLabels.primary).toBe('Primary')
        expect(colorLabels.secondary).toBe('Secondary')
        expect(colorLabels.accent).toBe('Accent')
        expect(colorLabels[ 'dark-page' ]).toBe('Dark Page')
      })
    })
  })

  describe('[Functions]', () => {
    const testTheme = {
      primary: '#FF0000',
      secondary: '#00FF00',
      accent: '#0000FF',
      positive: '#00FF00',
      negative: '#FF0000',
      info: '#0000FF',
      warning: '#FFFF00',
      dark: '#111111',
      'dark-page': '#000000'
    }

    describe('[(function)toSass]', () => {
      test('generates valid SASS variables', () => {
        const result = toSass(testTheme)

        expect(result).toContain('$primary: #FF0000')
        expect(result).toContain('$secondary: #00FF00')
        expect(result).toContain('$accent: #0000FF')
        expect(result).toContain('$dark-page: #000000')
      })

      test('includes header comments', () => {
        const result = toSass(testTheme)

        expect(result).toContain('// Quasar SASS Variables')
        expect(result).toContain('quasar.variables.sass')
      })
    })

    describe('[(function)toCss]', () => {
      test('generates valid CSS variables', () => {
        const result = toCss(testTheme)

        expect(result).toContain('--q-primary: #FF0000;')
        expect(result).toContain('--q-secondary: #00FF00;')
        expect(result).toContain('--q-dark-page: #000000;')
      })

      test('wraps variables in :root selector', () => {
        const result = toCss(testTheme)

        expect(result).toContain(':root {')
        expect(result).toContain('}')
      })

      test('includes header comments', () => {
        const result = toCss(testTheme)

        expect(result).toContain('/* Quasar CSS Variables */')
      })
    })

    describe('[(function)toQuasarConfig]', () => {
      test('generates valid Quasar CLI config', () => {
        const result = toQuasarConfig(testTheme)

        expect(result).toContain("'primary': '#FF0000'")
        expect(result).toContain("'secondary': '#00FF00'")
        expect(result).toContain("'dark-page': '#000000'")
      })

      test('includes framework.config.brand structure', () => {
        const result = toQuasarConfig(testTheme)

        expect(result).toContain('framework: {')
        expect(result).toContain('config: {')
        expect(result).toContain('brand: {')
      })

      test('includes header comment', () => {
        const result = toQuasarConfig(testTheme)

        expect(result).toContain('// quasar.config.ts')
      })
    })

    describe('[(function)toVitePlugin]', () => {
      test('generates valid Vite plugin config', () => {
        const result = toVitePlugin(testTheme)

        expect(result).toContain("$primary: '#FF0000'")
        expect(result).toContain("$secondary: '#00FF00'")
        expect(result).toContain("$dark-page: '#000000'")
      })

      test('includes sassVariables structure', () => {
        const result = toVitePlugin(testTheme)

        expect(result).toContain('quasar({')
        expect(result).toContain('sassVariables: {')
      })

      test('includes header comment', () => {
        const result = toVitePlugin(testTheme)

        expect(result).toContain('// vite.config.ts')
      })
    })

    describe('[(function)serializeTheme]', () => {
      test('returns object with all 4 formats', () => {
        const result = serializeTheme(testTheme)

        expect(result).toHaveProperty('sass')
        expect(result).toHaveProperty('css')
        expect(result).toHaveProperty('quasarConfig')
        expect(result).toHaveProperty('vitePlugin')
      })

      test('each format is a non-empty string', () => {
        const result = serializeTheme(testTheme)

        expect(typeof result.sass).toBe('string')
        expect(typeof result.css).toBe('string')
        expect(typeof result.quasarConfig).toBe('string')
        expect(typeof result.vitePlugin).toBe('string')

        expect(result.sass.length).toBeGreaterThan(0)
        expect(result.css.length).toBeGreaterThan(0)
        expect(result.quasarConfig.length).toBeGreaterThan(0)
        expect(result.vitePlugin.length).toBeGreaterThan(0)
      })
    })
  })
})



