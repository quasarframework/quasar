/**
 * QThemeDesigner - A dev-only component for visual theme customization
 *
 * This component is 100% tree-shakable and will be removed from
 * production builds unless the `force` prop is set to true.
 */

import { h, computed, ref, getCurrentInstance } from 'vue'

import useThemeDesigner from '../../composables/use-theme-designer/use-theme-designer.js'
import { defaultTheme } from '../../json/themeSerializer.js'
import { createComponent } from '../../utils/private.create/create.js'

import QToggle from '../toggle/QToggle.js'
import QSpace from '../space/QSpace.js'
import QBtn from '../btn/QBtn.js'
import QSelect from '../select/QSelect.js'

import ThemeDesignerSidebar from './ThemeDesignerSidebar.vue'
import ThemeDesignerPreview from './ThemeDesignerPreview.vue'
import ThemeExportDialog from './ThemeExportDialog.vue'
import ThemeDesignerColorDialog from './ThemeDesignerColorDialog.vue'

export default createComponent({
  name: 'QThemeDesigner',

  props: {
    /**
     * Force rendering in production mode.
     * By default, QThemeDesigner only renders in development mode.
     * Set this to true to render in production (not recommended).
     */
    force: Boolean
  },

  setup (props) {
    // Get $q instance for global dark mode
    const { proxy: { $q } } = getCurrentInstance()

    // Text color preference state
    const textColorPreference = ref('recommended')

    // Dev-only guard: Don't render in production unless forced
    const shouldRender = computed(() => {
      // In production, only render if force prop is true
      if (import.meta.env.PROD && !props.force) {
        return false
      }
      return true
    })

    const {
      theme,
      showExportDialog,
      activeColorTab,
      cssVars,
      exportFormats,
      setColor,
      resetTheme,
      openExportDialog,
      closeExportDialog
    } = useThemeDesigner()

    // Color picker dialog state
    const showColorDialog = ref(false)
    const currentColorKey = ref('primary')

    // Open color picker dialog
    function openColorPicker (colorKey) {
      currentColorKey.value = colorKey
      activeColorTab.value = colorKey
      showColorDialog.value = true
    }

    // Close color picker dialog
    function closeColorDialog () {
      showColorDialog.value = false
    }

    // Reset a single color to default
    function resetSingleColor (colorKey) {
      if (colorKey in defaultTheme) {
        setColor(colorKey, defaultTheme[ colorKey ])
      }
    }

    return () => {
      if (shouldRender.value === false) {
        return null
      }

      // Get current text color preference value (reactive)
      const currentTextColorPreference = textColorPreference.value

      return h('div', {
        class: 'q-theme-designer'
      }, [
        // Top Toolbar
        h('div', {
          class: 'q-theme-designer__toolbar q-toolbar row no-wrap items-center bg-dark text-white'
        }, [
          h('div', { class: 'q-toolbar__title ellipsis' }, [
            h('i', { class: 'q-icon notranslate material-icons q-mr-sm', 'aria-hidden': 'true' }, 'palette'),
            'Quasar'
          ]),
          h(QSpace),
          h('div', { class: 'row items-center' }, [
            h(QSelect, {
              modelValue: currentTextColorPreference,
              options: [
                { label: 'Contrast', value: 'recommended' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
              ],
              dense: true,
              outlined: true,
              dark: true,
              emitValue: true,
              mapOptions: true,
              class: 'q-mr-md q-theme-designer__text-color-select',
              style: { minWidth: '120px' },
              'onUpdate:modelValue': (val) => {
                textColorPreference.value = val
              },
              'aria-label': 'Text color preference'
            }),
            h(QToggle, {
              modelValue: $q.dark.isActive,
              color: 'red',
              class: 'q-mr-xs',
              'onUpdate:modelValue': (val) => {
                $q.dark.set(val)
              }
            }),
            h('div', { class: 'text-white q-ml-xs' }, 'Dark page'),
            h(QBtn, {
              color: 'orange',
              label: 'Export',
              class: 'q-ml-md',
              onClick: openExportDialog,
              'aria-label': 'Export theme configuration'
            })
          ])
        ]),

        // Main Content
        h('div', {
          class: 'q-theme-designer__main'
        }, [
          // Sidebar (fixed on left)
          h(ThemeDesignerSidebar, {
            theme,
            activeColorTab: activeColorTab.value,
            textColorPreference: currentTextColorPreference,
            class: 'q-theme-designer__sidebar',
            'onOpen:color-picker': openColorPicker
          }),

          // Preview (scrollable on right, positioned next to sidebar)
          h(ThemeDesignerPreview, {
            cssVars: cssVars.value,
            theme,
            textColorPreference: currentTextColorPreference,
            class: 'q-theme-designer__preview'
          })
        ]),

        // Color Picker Dialog
        h(ThemeDesignerColorDialog, {
          modelValue: showColorDialog.value,
          theme,
          currentColor: currentColorKey.value,
          'onUpdate:modelValue': (val) => {
            showColorDialog.value = val
          },
          'onUpdate:color': setColor,
          'onReset:color': resetSingleColor
        }),

        // Export Dialog
        h(ThemeExportDialog, {
          modelValue: showExportDialog.value,
          exportFormats: exportFormats.value,
          'onUpdate:modelValue': (val) => {
            showExportDialog.value = val
          }
        })
      ])
    }
  }
})

