/**
 * Theme Serializer
 *
 * Generates export formats for Quasar theme colors:
 * - SASS variables
 * - CSS variables
 * - Quasar CLI config (quasar.config.ts)
 * - Quasar Vite Plugin config
 */

/**
 * Default Quasar brand colors
 */
export const defaultTheme = {
  primary: '#1976D2',
  secondary: '#26A69A',
  accent: '#9C27B0',
  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037',
  dark: '#1D1D1D',
  'dark-page': '#121212'
}

/**
 * Color token labels for display
 */
export const colorLabels = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  positive: 'Positive',
  negative: 'Negative',
  info: 'Info',
  warning: 'Warning',
  dark: 'Dark',
  'dark-page': 'Dark Page'
}

/**
 * Generate SASS variables format
 * @param {Object} theme - Theme colors object
 * @returns {string} SASS variables string
 */
export function toSass (theme) {
  const lines = [
    '// Quasar SASS Variables',
    '// Copy this to your src/css/quasar.variables.sass file',
    ''
  ]

  for (const [ key, value ] of Object.entries(theme)) {
    lines.push(`$${ key }: ${ value }`)
  }

  return lines.join('\n')
}

/**
 * Generate CSS variables format
 * @param {Object} theme - Theme colors object
 * @returns {string} CSS variables string
 */
export function toCss (theme) {
  const lines = [
    '/* Quasar CSS Variables */',
    '/* Add this to your global CSS or :root selector */',
    '',
    ':root {'
  ]

  for (const [ key, value ] of Object.entries(theme)) {
    lines.push(`  --q-${ key }: ${ value };`)
  }

  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate Quasar CLI config format (quasar.config.ts)
 * @param {Object} theme - Theme colors object
 * @returns {string} Quasar CLI config snippet
 */
export function toQuasarConfig (theme) {
  const brandLines = []

  for (const [ key, value ] of Object.entries(theme)) {
    // Convert 'dark-page' to 'dark-page' (keep as-is for brand config)
    brandLines.push(`      '${ key }': '${ value }'`)
  }

  return `// quasar.config.ts
// Add this to your Quasar config file

export default defineConfig({
  framework: {
    config: {
      brand: {
${ brandLines.join(',\n') }
      }
    }
  }
})`
}

/**
 * Generate Quasar Vite Plugin config format
 * @param {Object} theme - Theme colors object
 * @returns {string} Vite plugin config snippet
 */
export function toVitePlugin (theme) {
  const sassLines = []

  for (const [ key, value ] of Object.entries(theme)) {
    sassLines.push(`        $${ key }: '${ value }'`)
  }

  return `// vite.config.ts
// Add this to your Vite config file

import { quasar } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    quasar({
      sassVariables: {
${ sassLines.join(',\n') }
      }
    })
  ]
})`
}

/**
 * Generate all export formats
 * @param {Object} theme - Theme colors object
 * @returns {Object} Object with all format strings
 */
export function serializeTheme (theme) {
  return {
    sass: toSass(theme),
    css: toCss(theme),
    quasarConfig: toQuasarConfig(theme),
    vitePlugin: toVitePlugin(theme)
  }
}

export default {
  defaultTheme,
  colorLabels,
  toSass,
  toCss,
  toQuasarConfig,
  toVitePlugin,
  serializeTheme
}



