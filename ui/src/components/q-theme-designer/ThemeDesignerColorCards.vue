<template>
  <div class="q-theme-designer-color-cards">
    <div class="row q-gutter-md">
      <q-card
        v-for="(label, key) in colorLabels"
        :key="key"
        class="q-theme-designer-color-cards__card col-12 col-sm-4"
        :style="getCardStyle(getColorValue(key))"
      >
        <q-card-section :class="getTextColorClass(getColorValue(key))" class="relative-position">
          <div class="text-h6">{{ label }}</div>
          <div class="text-caption q-mt-xs">{{ getColorValue(key) }}</div>
          <q-icon
            v-if="getIcon(key)"
            :name="getIcon(key)"
            size="24px"
            class="absolute-top-right q-ma-sm"
            :color="getIconColor(getColorValue(key))"
          />
          <!-- WCAG Contrast Info -->
          <div class="q-theme-designer-color-cards__contrast q-mt-sm">
            <div class="row q-gutter-xs">
              <q-chip
                :color="getContrastForColor(key).passesWhiteAA ? 'positive' : 'negative'"
                text-color="white"
                icon="contrast"
                size="sm"
                dense
              >
                White: {{ getContrastForColor(key).whiteRatio }}:1
                <q-tooltip>
                  White text: {{ getContrastForColor(key).passesWhiteAA ? 'Passes' : 'Fails' }} WCAG AA (4.5:1)
                </q-tooltip>
              </q-chip>
              <q-chip
                :color="getContrastForColor(key).passesBlackAA ? 'positive' : 'negative'"
                text-color="white"
                icon="contrast"
                size="sm"
                dense
              >
                Black: {{ getContrastForColor(key).blackRatio }}:1
                <q-tooltip>
                  Black text: {{ getContrastForColor(key).passesBlackAA ? 'Passes' : 'Fails' }} WCAG AA (4.5:1)
                </q-tooltip>
              </q-chip>
            </div>
            <div class="text-caption q-mt-xs" style="opacity: 0.8">
              Recommended: {{ getContrastForColor(key).recommendWhiteText ? 'White' : 'Black' }} text
            </div>
          </div>
        </q-card-section>
        <q-card-section :class="getTextColorClass(getColorValue(key))" class="q-pt-sm">
          <div class="text-body2">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { colorLabels } from '../../json/themeSerializer.js'
import { getContrastInfo } from '../../composables/use-theme-designer/use-theme-designer.js'

export default {
  name: 'ThemeDesignerColorCards',

  props: {
    theme: {
      type: Object,
      required: true
    },
    textColorPreference: {
      type: String,
      default: 'recommended',
      validator: (value) => [ 'recommended', 'light', 'dark' ].includes(value)
    }
  },

  setup (props) {
    // Icons for specific colors
    const colorIcons = {
      positive: 'check_circle',
      negative: 'error',
      info: 'info',
      warning: 'warning'
    }

    // Get icon for a color key
    function getIcon (key) {
      return colorIcons[ key ] || null
    }

    // Get color value from theme (handles dark-page key)
    function getColorValue (key) {
      // Try exact key first, then with hyphen replaced
      if (props.theme[ key ] !== undefined) {
        return props.theme[ key ]
      }
      // Handle 'dark-page' -> 'darkPage' conversion if needed
      const camelKey = key.replace(/-([a-z])/g, (g) => g[ 1 ].toUpperCase())
      return props.theme[ camelKey ] || '#000000'
    }

    // Solid color for cards (no gradient)
    function getCardStyle (color) {
      return {
        backgroundColor: color
      }
    }

    // Determine text color based on preference or contrast info
    function getTextColorClass (color) {
      if (props.textColorPreference === 'light') {
        return 'text-white'
      }
      if (props.textColorPreference === 'dark') {
        return 'text-black'
      }
      // Recommended: use contrast-based selection
      const contrast = getContrastInfo(color)
      return contrast.recommendWhiteText ? 'text-white' : 'text-black'
    }

    // Get icon color based on preference or contrast info
    function getIconColor (color) {
      if (props.textColorPreference === 'light') {
        return 'white'
      }
      if (props.textColorPreference === 'dark') {
        return 'black'
      }
      // Recommended: use contrast-based selection
      const contrast = getContrastInfo(color)
      return contrast.recommendWhiteText ? 'white' : 'black'
    }

    // Get contrast info for a color key (optimized to avoid multiple calls)
    function getContrastForColor (key) {
      return getContrastInfo(getColorValue(key))
    }

    return {
      colorLabels,
      getIcon,
      getColorValue,
      getCardStyle,
      getTextColorClass,
      getIconColor,
      getContrastForColor
    }
  }
}
</script>

<style lang="sass">
.q-theme-designer-color-cards
  width: 100%

  &__card
    min-height: 180px
    border-radius: 4px
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)

  &__contrast
    // Ensure contrast badges are visible on colored backgrounds
    .q-chip
      backdrop-filter: blur(4px)
      background-color: rgba(0, 0, 0, 0.3) !important

      &.bg-positive
        background-color: rgba(33, 186, 69, 0.9) !important

      &.bg-negative
        background-color: rgba(193, 0, 21, 0.9) !important

  // Mobile: single column with padding
  @media (max-width: 599px)
    .row
      display: flex
      flex-wrap: wrap
      margin-left: -8px
      margin-right: -8px

    &__card
      flex: 0 0 calc(100% - 16px)
      max-width: calc(100% - 16px)
      margin-left: 8px
      margin-right: 8px

  // Desktop: 3 columns
  @media (min-width: 600px)
    .row
      display: flex
      flex-wrap: wrap

    &__card
      flex: 0 0 calc(33.333% - 16px)
      max-width: calc(33.333% - 16px)
</style>
