<template>
  <div class="q-theme-designer-sidebar">
    <!-- Color Swatches List -->
    <div class="q-theme-designer-sidebar__list q-pa-sm">
      <div class="row q-gutter-xs">
        <q-btn
          v-for="(label, key) in colorLabels"
          :key="key"
          :class="[
            'q-theme-designer-sidebar__color-button',
            { 'q-theme-designer-sidebar__color-button--active': activeColorTab === key }
          ]"
          :style="{
            ...getButtonStyle(theme[key]),
            color: getTextColor(theme[key])
          }"
          unelevated
          no-caps
          class="q-mb-xs"
          @click="$emit('open:color-picker', key)"
        >
          <div class="column items-start" style="width: 100%">
            <div class="text-weight-medium">{{ label }}</div>
            <div class="text-caption text-weight-normal">{{ theme[key] }}</div>
          </div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

import { colorLabels } from '../../json/themeSerializer.js'
import { getContrastInfo } from '../../composables/use-theme-designer/use-theme-designer.js'
import { hexToRgb } from '../../utils/colors/colors.js'

export default {
  name: 'ThemeDesignerSidebar',

  props: {
    theme: {
      type: Object,
      required: true
    },
    isDarkMode: {
      type: Boolean,
      default: false
    },
    activeColorTab: {
      type: String,
      default: 'primary'
    },
    textColorPreference: {
      type: String,
      default: 'recommended',
      validator: (value) => [ 'recommended', 'light', 'dark' ].includes(value)
    }
  },

  emits: [ 'open:color-picker' ],

  setup (props) {
    // Compute contrast info for primary and secondary (for potential future use)
    const contrastInfo = computed(() => ({
      primary: getContrastInfo(props.theme.primary),
      secondary: getContrastInfo(props.theme.secondary)
    }))

    // Determine text color based on preference or contrast info
    // Note: Using the actual color (bottom half of gradient) for contrast calculation
    function getTextColor (color) {
      if (props.textColorPreference === 'light') {
        return '#FFFFFF'
      }
      if (props.textColorPreference === 'dark') {
        return '#000000'
      }
      // Contrast-based selection
      const contrast = getContrastInfo(color)
      return contrast.recommendWhiteText ? '#FFFFFF' : '#000000'
    }

    // Create gradient style: half lighter color on top, half real color on bottom
    function getButtonStyle (color) {
      const rgb = hexToRgb(color)
      if (!rgb) return { backgroundColor: color }

      // Lighten the color (~20% lighter for subtle gradient)
      const lighterRgb = {
        r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * 0.20)),
        g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * 0.20)),
        b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * 0.20))
      }

      const lighterHex = '#'
        + lighterRgb.r.toString(16).padStart(2, '0')
        + lighterRgb.g.toString(16).padStart(2, '0')
        + lighterRgb.b.toString(16).padStart(2, '0')

      return {
        background: `linear-gradient(to bottom, ${ lighterHex } 0%, ${ lighterHex } 50%, ${ color } 50%, ${ color } 100%)`
      }
    }

    return {
      colorLabels,
      contrastInfo,
      getTextColor,
      getButtonStyle
    }
  }
}
</script>

<style lang="sass">
.q-theme-designer-sidebar,
.q-theme-designer__sidebar
  display: flex
  flex-direction: column
  height: 100%
  background: var(--q-dark-page, #121212)
  overflow-y: auto

  &__list
    padding: 8px

  &__color-button
    padding: 12px 16px
    border-radius: 8px
    text-align: left
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2)
    transition: all 0.2s ease
    min-height: 60px
    // Default: full width (desktop sidebar)
    width: 100%

    &:hover
      transform: translateY(-2px)
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)

    &--active
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)

// Mobile: Force 3 columns (when sidebar is full width), fill width with proper spacing
@media (max-width: 599px)
  .q-theme-designer-sidebar,
  .q-theme-designer__sidebar
    overflow-y: visible !important

    &__list
      // Override q-pa-sm padding on mobile - keep 8px padding
      padding: 8px !important

      .row
        display: flex !important
        flex-wrap: wrap !important
        margin-left: 0 !important
        margin-right: 0 !important
        width: 100% !important
        gap: 4px !important
        // Remove gutter system on mobile completely
        > *
          margin-left: 0 !important
          margin-right: 0 !important
          margin-top: 0 !important
          margin-bottom: 0 !important

      .q-theme-designer-sidebar__color-button
        // Calculate width using gap property: (100% - 8px gap) / 3
        // Container has 8px padding, row is 100% of container content area
        // gap: 4px creates 2 gaps of 4px each = 8px total
        flex: 0 0 calc((100% - 8px) / 3) !important
        max-width: calc((100% - 8px) / 3) !important
        width: calc((100% - 8px) / 3) !important
        min-width: calc((100% - 8px) / 3) !important
        margin: 0 !important
        box-sizing: border-box !important

// Light mode adjustments
body:not(.body--dark) .q-theme-designer-sidebar,
body:not(.body--dark) .q-theme-designer__sidebar
  background: #f5f5f5
  border-right-color: rgba(0, 0, 0, 0.1)
</style>
