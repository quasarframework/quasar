import { ref, reactive, provide, inject, readonly } from 'vue'

const DASHBOARD_PANELS_KEY = Symbol('dashboardPanels')
const STORAGE_KEY_PREFIX = 'q-dashboard-panels'

/**
 * Clamp a value between min and max
 */
function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Safely parse JSON from localStorage
 */
function safeParseJSON (str, fallback = null) {
  if (str === null || str === void 0) {
    return fallback
  }

  try {
    const parsed = JSON.parse(str)
    return parsed === null ? fallback : parsed
  }
  catch {
    return fallback
  }
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable () {
  try {
    const testKey = '__q_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  }
  catch {
    return false
  }
}

/**
 * Convert size between units
 * @param {number} value - The size value
 * @param {string} fromUnit - Source unit (%, px, rem)
 * @param {string} toUnit - Target unit (%, px, rem)
 * @param {number} containerSize - Container size in pixels (for % conversions)
 * @param {number} rootFontSize - Root font size (for rem conversions)
 */
export function convertSize (value, fromUnit, toUnit, containerSize = 0, rootFontSize = 16) {
  if (fromUnit === toUnit) return value

  // First convert to pixels
  let px = value
  if (fromUnit === '%') {
    px = (value / 100) * containerSize
  }
  else if (fromUnit === 'rem') {
    px = value * rootFontSize
  }

  // Then convert from pixels to target unit
  if (toUnit === 'px') return px
  if (toUnit === '%') return containerSize > 0 ? (px / containerSize) * 100 : 0
  if (toUnit === 'rem') return px / rootFontSize

  return value
}

/**
 * Composable for managing a group of dashboard panels with shared state.
 * Provides centralized storage and state management for multiple panels.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.storageKey - Key for localStorage (default: 'default')
 * @param {boolean} options.persist - Whether to persist state (default: true)
 * @returns {Object} Dashboard panels context
 */
export function useDashboardPanels (options = {}) {
  const {
    storageKey = 'default',
    persist = true
  } = options

  const fullStorageKey = `${ STORAGE_KEY_PREFIX }-${ storageKey }`
  const storageAvailable = isLocalStorageAvailable()

  // Panel states: { [panelId]: { size, collapsed, maximized } }
  const panelStates = reactive({})

  // Track registered panels
  const registeredPanels = ref(new Set())

  /**
   * Load persisted state from localStorage
   */
  function loadState () {
    if (!persist || !storageAvailable) return

    const stored = localStorage.getItem(fullStorageKey)
    const parsed = safeParseJSON(stored, {})

    Object.keys(parsed).forEach(id => {
      if (parsed[ id ] && typeof parsed[ id ] === 'object') {
        panelStates[ id ] = {
          size: parsed[ id ].size,
          collapsed: Boolean(parsed[ id ].collapsed),
          maximized: Boolean(parsed[ id ].maximized)
        }
      }
    })
  }

  /**
   * Save current state to localStorage
   */
  function saveState () {
    if (!persist || !storageAvailable) return

    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(panelStates))
    }
    catch {
      // Quota exceeded or other storage error - fail silently
    }
  }

  /**
   * Register a panel with the group
   */
  function registerPanel (id, initialState = {}) {
    registeredPanels.value.add(id)

    // Use persisted state if available, otherwise use initial state
    if (!panelStates[ id ]) {
      panelStates[ id ] = {
        size: initialState.size ?? 35,
        collapsed: initialState.collapsed ?? false,
        maximized: initialState.maximized ?? false
      }
    }

    return panelStates[ id ]
  }

  /**
   * Unregister a panel from the group
   */
  function unregisterPanel (id) {
    registeredPanels.value.delete(id)
  }

  /**
   * Get panel state
   */
  function getPanelState (id) {
    return panelStates[ id ] || null
  }

  /**
   * Update panel size
   */
  function setPanelSize (id, size, minSize = 15, maxSize = 100) {
    if (!panelStates[ id ]) return

    panelStates[ id ].size = clamp(size, minSize, maxSize)
    saveState()
  }

  /**
   * Update panel collapsed state
   */
  function setPanelCollapsed (id, collapsed) {
    if (!panelStates[ id ]) return

    panelStates[ id ].collapsed = collapsed
    saveState()
  }

  /**
   * Update panel maximized state
   */
  function setPanelMaximized (id, maximized) {
    if (!panelStates[ id ]) return

    panelStates[ id ].maximized = maximized
    saveState()
  }

  /**
   * Toggle panel collapsed state
   */
  function toggleCollapsed (id) {
    if (!panelStates[ id ]) return

    panelStates[ id ].collapsed = !panelStates[ id ].collapsed
    saveState()
  }

  /**
   * Toggle panel maximized state
   */
  function toggleMaximized (id) {
    if (!panelStates[ id ]) return

    panelStates[ id ].maximized = !panelStates[ id ].maximized
    saveState()
  }

  /**
   * Reset all panels to their default state
   */
  function resetAll () {
    Object.keys(panelStates).forEach(id => {
      delete panelStates[ id ]
    })

    if (persist && storageAvailable) {
      localStorage.removeItem(fullStorageKey)
    }
  }

  // Load persisted state on initialization
  loadState()

  const context = {
    panelStates: readonly(panelStates),
    registeredPanels: readonly(registeredPanels),
    registerPanel,
    unregisterPanel,
    getPanelState,
    setPanelSize,
    setPanelCollapsed,
    setPanelMaximized,
    toggleCollapsed,
    toggleMaximized,
    resetAll,
    saveState
  }

  // Provide context to child components
  provide(DASHBOARD_PANELS_KEY, context)

  return context
}

/**
 * Inject dashboard panels context from parent
 * Returns null if no parent provider exists
 */
export function useDashboardPanelsContext () {
  return inject(DASHBOARD_PANELS_KEY, null)
}

// Export symbols for advanced usage
useDashboardPanels.key = DASHBOARD_PANELS_KEY
useDashboardPanels.storageKeyPrefix = STORAGE_KEY_PREFIX

export default useDashboardPanels
