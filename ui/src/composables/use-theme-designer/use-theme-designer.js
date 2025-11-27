import { ref, reactive, computed, watch, onMounted } from 'vue'

import { luminosity } from '../../utils/colors/colors.js'
import { defaultTheme, colorLabels, serializeTheme } from '../../json/themeSerializer.js'

const STORAGE_KEY = 'quasar-theme-designer-last-theme'

/**
 * Calculate WCAG contrast ratio between two colors
 * @param {string} color1 - First color (hex string)
 * @param {string} color2 - Second color (hex string)
 * @returns {number} Contrast ratio (1 to 21)
 */
function getContrastRatio (color1, color2) {
  const L1 = luminosity(color1)
  const L2 = luminosity(color2)

  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG AA requirements
 * @param {number} ratio - Contrast ratio
 * @param {boolean} largeText - Whether text is large (14pt bold or 18pt+)
 * @returns {boolean} Whether contrast meets AA requirements
 */
function meetsWcagAA (ratio, largeText = false) {
  return largeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Get contrast badge info for a color against white and black
 * @param {string} color - Color to check (hex string)
 * @returns {Object} Contrast info with ratios and pass/fail status
 */
function getContrastInfo (color) {
  const whiteRatio = getContrastRatio(color, '#FFFFFF')
  const blackRatio = getContrastRatio(color, '#000000')

  return {
    whiteRatio: whiteRatio.toFixed(2),
    blackRatio: blackRatio.toFixed(2),
    passesWhiteAA: meetsWcagAA(whiteRatio),
    passesBlackAA: meetsWcagAA(blackRatio),
    // Recommend white text if it has better contrast
    recommendWhiteText: whiteRatio > blackRatio
  }
}

/**
 * Load theme from localStorage
 * @returns {Object|null} Saved theme or null
 */
function loadFromStorage () {
  if (typeof localStorage === 'undefined') return null

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  }
  catch (e) {
    console.warn('Failed to load theme from localStorage:', e)
  }
  return null
}

/**
 * Save theme to localStorage
 * @param {Object} theme - Theme to save
 */
function saveToStorage (theme) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  }
  catch (e) {
    console.warn('Failed to save theme to localStorage:', e)
  }
}

/**
 * Composable for managing theme designer state
 * @returns {Object} Theme designer state and methods
 */
export default function useThemeDesigner () {
  // Theme colors state
  const theme = reactive({ ...defaultTheme })

  // Dark mode toggle for preview
  const isDarkMode = ref(false)

  // Export dialog visibility
  const showExportDialog = ref(false)

  // Current active color tab
  const activeColorTab = ref('primary')

  // Load saved theme on mount
  onMounted(() => {
    const saved = loadFromStorage()
    if (saved) {
      Object.assign(theme, saved)
    }
  })

  // Auto-save theme changes to localStorage
  watch(
    () => ({ ...theme }),
    (newTheme) => {
      saveToStorage(newTheme)
    },
    { deep: true }
  )

  // Computed CSS variables for preview
  const cssVars = computed(() => {
    const vars = {}
    for (const [ key, value ] of Object.entries(theme)) {
      vars[ `--q-${ key }` ] = value
    }
    return vars
  })

  // Computed contrast info for primary and secondary colors
  const primaryContrast = computed(() => getContrastInfo(theme.primary))
  const secondaryContrast = computed(() => getContrastInfo(theme.secondary))

  // Update a single color
  function setColor (colorKey, value) {
    if (colorKey in theme) {
      theme[ colorKey ] = value
    }
  }

  // Reset theme to defaults
  function resetTheme () {
    Object.assign(theme, defaultTheme)
  }

  // Get all export formats
  const exportFormats = computed(() => serializeTheme(theme))

  // Toggle dark mode
  function toggleDarkMode () {
    isDarkMode.value = !isDarkMode.value
  }

  // Open export dialog
  function openExportDialog () {
    showExportDialog.value = true
  }

  // Close export dialog
  function closeExportDialog () {
    showExportDialog.value = false
  }

  return {
    // State
    theme,
    isDarkMode,
    showExportDialog,
    activeColorTab,

    // Computed
    cssVars,
    primaryContrast,
    secondaryContrast,
    exportFormats,

    // Constants
    colorLabels,
    defaultTheme,

    // Methods
    setColor,
    resetTheme,
    toggleDarkMode,
    openExportDialog,
    closeExportDialog,
    getContrastInfo
  }
}

export {
  getContrastRatio,
  meetsWcagAA,
  getContrastInfo,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEY
}
