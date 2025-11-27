import { h, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'
import { useDashboardPanelsContext } from '../../composables/use-dashboard-panels/use-dashboard-panels.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

const STORAGE_KEY_PREFIX = 'q-dashboard-panel'

/**
 * Clamp a value between min and max
 */
function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
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
 * Safely parse JSON from localStorage
 */
function safeParseJSON (str, fallback = null) {
  try {
    return JSON.parse(str)
  }
  catch {
    return fallback
  }
}

export default createComponent({
  name: 'QDashboardPanel',

  props: {
    ...useDarkProps,

    // Required unique identifier for persistence
    id: {
      type: String,
      required: true
    },

    // Enable/disable resize behavior
    resizable: {
      type: Boolean,
      default: true
    },

    // Initial width in specified unit
    defaultSize: {
      type: Number,
      default: 35
    },

    // Minimum allowed width
    minSize: {
      type: Number,
      default: 15
    },

    // Maximum allowed width
    maxSize: {
      type: Number,
      default: 100
    },

    // Initial collapsed state
    collapsed: {
      type: Boolean,
      default: false
    },

    // Initial maximized state
    maximized: {
      type: Boolean,
      default: false
    },

    // Unit for size measurements
    unit: {
      type: String,
      default: '%',
      validator: v => [ '%', 'px', 'rem' ].includes(v)
    },

    // Storage strategy: 'local' or 'group'
    storage: {
      type: String,
      default: 'local',
      validator: v => [ 'local', 'group' ].includes(v)
    },

    // Disable persistence entirely
    noPersist: {
      type: Boolean,
      default: false
    },

    // Disable resizing on mobile breakpoints
    disableOnMobile: {
      type: Boolean,
      default: true
    },

    // Keyboard increment for arrow key resize
    keyboardIncrement: {
      type: Number,
      default: 1
    },

    // QCard passthrough props
    tag: {
      type: String,
      default: 'div'
    },
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  emits: [
    'update:size',
    'update:collapsed',
    'update:maximized',
    'resizeStart',
    'resize',
    'resizeEnd',
    'collapse',
    'expand',
    'maximize',
    'restore'
  ],

  setup (props, { slots, emit, attrs }) {
    const { proxy: { $q } } = getCurrentInstance()
    const isDark = useDark(props, $q)

    // Try to get group context from parent
    const groupContext = useDashboardPanelsContext()

    // Refs
    const rootRef = ref(null)
    const resizeHandleRef = ref(null)

    // Local state
    const localSize = ref(props.defaultSize)
    const localCollapsed = ref(props.collapsed)
    const localMaximized = ref(props.maximized)
    const isResizing = ref(false)
    const priorSize = ref(props.defaultSize) // Store size before maximize

    // Check if on mobile
    const isMobile = computed(() =>
      $q.screen.xs === true || $q.screen.sm === true
    )

    // Determine if resizing should be disabled
    const resizeDisabled = computed(() =>
      props.resizable !== true
      || (props.disableOnMobile === true && isMobile.value === true)
      || localMaximized.value === true
    )

    // Storage key for local persistence
    const storageKey = computed(() => `${ STORAGE_KEY_PREFIX }-${ props.id }`)
    const storageAvailable = isLocalStorageAvailable()

    // Computed classes
    const classes = computed(() => {
      const cls = [
        'q-dashboard-panel',
        'q-card'
      ]

      if (isDark.value === true) {
        cls.push('q-card--dark', 'q-dark', 'q-dashboard-panel--dark')
      }
      if (props.bordered === true) cls.push('q-card--bordered')
      if (props.square === true) cls.push('q-card--square', 'no-border-radius')
      if (props.flat === true) cls.push('q-card--flat', 'no-shadow')
      if (localCollapsed.value === true) cls.push('q-dashboard-panel--collapsed')
      if (localMaximized.value === true) cls.push('q-dashboard-panel--maximized')
      if (isResizing.value === true) cls.push('q-dashboard-panel--resizing')
      if (isMobile.value === true) cls.push('q-dashboard-panel--mobile')

      return cls.join(' ')
    })

    // Computed style for width
    const panelStyle = computed(() => {
      // Base style - always ensure overflow visible for resize handle
      const base = { overflow: 'visible' }

      // On mobile, always full width
      if (isMobile.value === true) {
        return { ...base, width: '100%', maxWidth: '100%', flexBasis: '100%' }
      }

      // When maximized, use 100%
      if (localMaximized.value === true) {
        return { ...base, width: '100%', maxWidth: '100%', flexBasis: '100%', flexGrow: 1 }
      }

      const widthValue = `${ localSize.value }${ props.unit }`
      const maxWidthValue = `${ props.maxSize }${ props.unit }`
      const minWidthValue = `${ props.minSize }${ props.unit }`

      return {
        ...base,
        width: widthValue,
        minWidth: minWidthValue,
        maxWidth: maxWidthValue,
        flexBasis: widthValue,
        flexShrink: 0,
        flexGrow: 0
      }
    })

    /**
     * Load state from storage
     */
    function loadFromStorage () {
      // Skip if persistence is disabled
      if (props.noPersist === true) return

      // Try group context first
      if (props.storage === 'group' && groupContext !== null) {
        const state = groupContext.registerPanel(props.id, {
          size: props.defaultSize,
          collapsed: props.collapsed,
          maximized: props.maximized
        })

        if (state) {
          localSize.value = clamp(state.size ?? props.defaultSize, props.minSize, props.maxSize)
          localCollapsed.value = state.collapsed ?? props.collapsed
          localMaximized.value = state.maximized ?? props.maximized
        }
        return
      }

      // Fall back to localStorage
      if (storageAvailable !== true) return

      const stored = localStorage.getItem(storageKey.value)
      const parsed = safeParseJSON(stored, null)

      if (parsed !== null && typeof parsed === 'object') {
        if (typeof parsed.size === 'number') {
          localSize.value = clamp(parsed.size, props.minSize, props.maxSize)
        }
        if (typeof parsed.collapsed === 'boolean') {
          localCollapsed.value = parsed.collapsed
        }
        if (typeof parsed.maximized === 'boolean') {
          localMaximized.value = parsed.maximized
        }
        if (typeof parsed.priorSize === 'number') {
          priorSize.value = parsed.priorSize
        }
      }
    }

    /**
     * Save state to storage
     */
    function saveToStorage () {
      // Skip if persistence is disabled
      if (props.noPersist === true) return

      // Use group context if available
      if (props.storage === 'group' && groupContext !== null) {
        groupContext.setPanelSize(props.id, localSize.value, props.minSize, props.maxSize)
        groupContext.setPanelCollapsed(props.id, localCollapsed.value)
        groupContext.setPanelMaximized(props.id, localMaximized.value)
        return
      }

      // Fall back to localStorage
      if (storageAvailable !== true) return

      try {
        localStorage.setItem(storageKey.value, JSON.stringify({
          size: localSize.value,
          collapsed: localCollapsed.value,
          maximized: localMaximized.value,
          priorSize: priorSize.value
        }))
      }
      catch {
        // Quota exceeded or other error - fail silently
      }
    }

    /**
     * Set panel size with clamping
     */
    function setSize (newSize) {
      const clamped = clamp(newSize, props.minSize, props.maxSize)
      if (clamped !== localSize.value) {
        localSize.value = clamped
        emit('update:size', clamped)
        saveToStorage()
      }
    }

    /**
     * Toggle collapsed state
     */
    function toggleCollapsed () {
      localCollapsed.value = !localCollapsed.value
      emit('update:collapsed', localCollapsed.value)
      emit(localCollapsed.value === true ? 'collapse' : 'expand')
      saveToStorage()
    }

    /**
     * Set collapsed state
     */
    function setCollapsed (value) {
      if (localCollapsed.value !== value) {
        localCollapsed.value = value
        emit('update:collapsed', value)
        emit(value === true ? 'collapse' : 'expand')
        saveToStorage()
      }
    }

    /**
     * Toggle maximized state
     */
    function toggleMaximized () {
      if (localMaximized.value !== true) {
        // Store current size before maximizing
        priorSize.value = localSize.value
        localMaximized.value = true
        emit('update:maximized', true)
        emit('maximize')
      }
      else {
        // Restore previous size
        localMaximized.value = false
        localSize.value = priorSize.value
        emit('update:maximized', false)
        emit('restore')
        emit('update:size', localSize.value)
      }
      saveToStorage()
    }

    /**
     * Set maximized state
     */
    function setMaximized (value) {
      if (localMaximized.value !== value) {
        if (value === true) {
          priorSize.value = localSize.value
          localMaximized.value = true
          emit('update:maximized', true)
          emit('maximize')
        }
        else {
          localMaximized.value = false
          localSize.value = priorSize.value
          emit('update:maximized', false)
          emit('restore')
          emit('update:size', localSize.value)
        }
        saveToStorage()
      }
    }

    // Resize handling
    let startX = 0
    let startSize = 0
    let containerWidth = 0
    let rafId = null

    function getContainerWidth () {
      if (rootRef.value === null) return 0
      const parent = rootRef.value.parentElement
      if (parent) {
        // For flex containers, use the parent's width
        // For non-flex, use window width as fallback
        const parentWidth = parent.getBoundingClientRect().width
        return parentWidth > 0 ? parentWidth : window.innerWidth
      }
      return window.innerWidth
    }

    function onResizeStart (evt) {
      if (resizeDisabled.value === true) return

      evt.preventDefault()
      evt.stopPropagation()

      isResizing.value = true
      startX = evt.type.includes('touch') ? evt.touches[ 0 ].clientX : evt.clientX
      startSize = localSize.value
      containerWidth = getContainerWidth()

      emit('resizeStart', { size: localSize.value, unit: props.unit })

      // Add document listeners
      document.addEventListener('mousemove', onResizeMove, { passive: false })
      document.addEventListener('mouseup', onResizeEnd)
      document.addEventListener('touchmove', onResizeMove, { passive: false })
      document.addEventListener('touchend', onResizeEnd)
    }

    function onResizeMove (evt) {
      if (isResizing.value !== true) return

      evt.preventDefault()

      const currentX = evt.type.includes('touch') ? evt.touches[ 0 ].clientX : evt.clientX
      const deltaX = currentX - startX

      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        let newSize

        if (props.unit === '%') {
          // Convert pixel delta to percentage
          const deltaPercent = containerWidth > 0 ? (deltaX / containerWidth) * 100 : 0
          newSize = startSize + deltaPercent
        }
        else if (props.unit === 'px') {
          newSize = startSize + deltaX
        }
        else if (props.unit === 'rem') {
          const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
          newSize = startSize + (deltaX / rootFontSize)
        }

        const clamped = clamp(newSize, props.minSize, props.maxSize)

        if (clamped !== localSize.value) {
          localSize.value = clamped
          emit('resize', { size: clamped, unit: props.unit })
        }

        rafId = null
      })
    }

    function onResizeEnd () {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }

      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
      document.removeEventListener('touchmove', onResizeMove)
      document.removeEventListener('touchend', onResizeEnd)

      if (isResizing.value === true) {
        isResizing.value = false
        emit('resizeEnd', { size: localSize.value, unit: props.unit })
        emit('update:size', localSize.value)
        saveToStorage()
      }
    }

    function onHandleDoubleClick (evt) {
      evt.preventDefault()
      toggleMaximized()
    }

    function onHandleKeydown (evt) {
      if (resizeDisabled.value === true) return

      let delta = 0
      if (evt.key === 'ArrowRight' || evt.key === 'ArrowUp') {
        delta = props.keyboardIncrement
      }
      else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowDown') {
        delta = -props.keyboardIncrement
      }

      if (delta !== 0) {
        evt.preventDefault()
        setSize(localSize.value + delta)
      }
    }

    // Watch for prop changes
    watch(() => props.collapsed, val => {
      if (val !== localCollapsed.value) {
        setCollapsed(val)
      }
    })

    watch(() => props.maximized, val => {
      if (val !== localMaximized.value) {
        setMaximized(val)
      }
    })

    // Lifecycle
    onMounted(() => {
      loadFromStorage()
    })

    onBeforeUnmount(() => {
      // Cleanup
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      document.removeEventListener('mousemove', onResizeMove)
      document.removeEventListener('mouseup', onResizeEnd)
      document.removeEventListener('touchmove', onResizeMove)
      document.removeEventListener('touchend', onResizeEnd)

      // Unregister from group if using group storage
      if (props.storage === 'group' && groupContext !== null) {
        groupContext.unregisterPanel(props.id)
      }
    })

    // Expose public API
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, {
      toggleCollapsed,
      toggleMaximized,
      setSize,
      setCollapsed,
      setMaximized
    })

    return () => {
      const handleProps = {
        ref: resizeHandleRef,
        class: 'q-dashboard-panel__resize-handle',
        role: 'separator',
        'aria-orientation': 'vertical',
        'aria-valuenow': localSize.value,
        'aria-valuemin': props.minSize,
        'aria-valuemax': props.maxSize,
        tabindex: resizeDisabled.value === true ? -1 : 0,
        onMousedown: onResizeStart,
        onTouchstart: onResizeStart,
        onDblclick: onHandleDoubleClick,
        onKeydown: onHandleKeydown
      }

      // Resize handle slot or default
      // Show handle if resizable AND (not mobile OR disableOnMobile is false)
      const shouldShowHandle = props.resizable === true && (isMobile.value !== true || props.disableOnMobile !== true)

      const resizeHandle = shouldShowHandle
        ? (
            slots[ 'resize-handle' ] !== void 0
              ? slots[ 'resize-handle' ]({
                onMousedown: onResizeStart,
                onTouchstart: onResizeStart,
                onDblclick: onHandleDoubleClick,
                onKeydown: onHandleKeydown,
                disabled: resizeDisabled.value,
                size: localSize.value,
                unit: props.unit,
                minSize: props.minSize,
                maxSize: props.maxSize
              })
              : h('div', handleProps, [
                h('div', { class: 'q-dashboard-panel__resize-handle-inner' })
              ])
          )
        : null

      // Header section
      const header = slots.header !== void 0
        ? h('div', {
          class: 'q-dashboard-panel__header'
        }, [
          slots.header({
            collapsed: localCollapsed.value,
            maximized: localMaximized.value,
            toggleCollapsed,
            toggleMaximized
          })
        ])
        : null

      // Body section (hidden when collapsed)
      const body = localCollapsed.value !== true && slots.body !== void 0
        ? h('div', {
          class: 'q-dashboard-panel__body'
        }, slots.body())
        : null

      // Footer section (hidden when collapsed)
      const footer = localCollapsed.value !== true && slots.footer !== void 0
        ? h('div', {
          class: 'q-dashboard-panel__footer'
        }, slots.footer())
        : null

      // Default slot content
      const defaultContent = localCollapsed.value !== true
        ? hSlot(slots.default)
        : null

      return h(props.tag, {
        ref: rootRef,
        class: classes.value,
        style: panelStyle.value,
        'data-testid': 'panel',
        ...attrs
      }, [
        header,
        body,
        defaultContent,
        footer,
        resizeHandle
      ])
    }
  }
})
