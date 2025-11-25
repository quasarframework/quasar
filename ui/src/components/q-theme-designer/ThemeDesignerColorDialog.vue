<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="q-theme-designer-color-dialog" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ colorLabels[currentColor] || 'Color Picker' }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          aria-label="Close color picker"
        />
      </q-card-section>

      <q-card-section>
        <!-- Color Picker -->
        <q-color
          :model-value="theme[currentColor]"
          flat
          bordered
          class="full-width"
          format-model="hex"
          @update:model-value="handleColorChange"
        />

        <!-- WCAG Contrast Badge (for all colors) -->
        <div
          v-if="contrastInfo"
          class="q-theme-designer-color-dialog__contrast q-mt-md"
        >
          <div class="text-subtitle2 q-mb-sm">WCAG Contrast</div>
          <div class="row q-gutter-sm">
            <!-- White Text Contrast -->
            <q-chip
              :color="contrastInfo.passesWhiteAA ? 'positive' : 'negative'"
              text-color="white"
              icon="contrast"
              size="sm"
            >
              White: {{ contrastInfo.whiteRatio }}:1
              <q-tooltip>
                {{ contrastInfo.passesWhiteAA ? 'Passes' : 'Fails' }} WCAG AA (4.5:1)
              </q-tooltip>
            </q-chip>

            <!-- Black Text Contrast -->
            <q-chip
              :color="contrastInfo.passesBlackAA ? 'positive' : 'negative'"
              text-color="white"
              icon="contrast"
              size="sm"
            >
              Black: {{ contrastInfo.blackRatio }}:1
              <q-tooltip>
                {{ contrastInfo.passesBlackAA ? 'Passes' : 'Fails' }} WCAG AA (4.5:1)
              </q-tooltip>
            </q-chip>
          </div>

          <!-- Recommendation -->
          <div class="text-caption q-mt-sm text-grey-7">
            Recommended text color:
            <strong>{{ contrastInfo.recommendWhiteText ? 'White' : 'Black' }}</strong>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="grey"
          v-close-popup
        />
        <q-btn
          flat
          label="Reset to Default"
          color="grey"
          @click="handleReset"
        />
        <q-btn
          label="Done"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'

import { colorLabels, defaultTheme } from '../../json/themeSerializer.js'
import { getContrastInfo } from '../../composables/use-theme-designer/use-theme-designer.js'

export default {
  name: 'ThemeDesignerColorDialog',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    theme: {
      type: Object,
      required: true
    },
    currentColor: {
      type: String,
      default: 'primary'
    }
  },

  emits: [ 'update:modelValue', 'update:color', 'reset:color' ],

  setup (props, { emit }) {
    const handleColorChange = (value) => {
      emit('update:color', props.currentColor, value)
    }

    const handleReset = () => {
      if (props.currentColor in defaultTheme) {
        emit('reset:color', props.currentColor)
      }
    }

    const contrastInfo = computed(() => {
      const color = props.theme[ props.currentColor ]
      if (color) {
        return getContrastInfo(color)
      }
      return null
    })

    return {
      colorLabels,
      defaultTheme,
      contrastInfo,
      handleColorChange,
      handleReset
    }
  }
}
</script>

<style lang="sass">
.q-theme-designer-color-dialog
  &__contrast
    padding: 12px
    background: rgba(255, 255, 255, 0.05)
    border-radius: 8px

body:not(.body--dark) .q-theme-designer-color-dialog
  &__contrast
    background: rgba(0, 0, 0, 0.05)
</style>



