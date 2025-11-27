<template>
  <div
    :key="previewKey"
    class="q-theme-designer-preview"
    :class="{ 'q-theme-designer-preview--dark': isDarkMode }"
    :style="cssVars"
  >
    <div class="q-theme-designer-preview__content">
      <!-- Color Cards Grid -->
      <ThemeDesignerColorCards
        :theme="theme"
        :text-color-preference="textColorPreference"
        class="q-theme-designer-preview__color-cards q-mb-md q-pt-md"
      />

      <!-- Component Examples -->
      <div class="q-theme-designer-preview__components">
          <!-- Buttons Section -->
          <div class="q-mb-lg q-px-lg q-pt-md">
            <div class="text-subtitle1 q-mb-sm">Buttons</div>
            <div class="row q-gutter-sm q-mb-md">
              <q-btn color="primary" :text-color="getTextColorForBackground(theme.primary)" label="Primary" />
              <q-btn color="secondary" :text-color="getTextColorForBackground(theme.secondary)" label="Secondary" />
              <q-btn color="accent" :text-color="getTextColorForBackground(theme.accent)" label="Accent" />
              <q-btn color="positive" :text-color="getTextColorForBackground(theme.positive)" label="Positive" />
              <q-btn color="negative" :text-color="getTextColorForBackground(theme.negative)" label="Negative" />
              <q-btn color="warning" :text-color="getTextColorForBackground(theme.warning)" label="Warning" />
              <q-btn color="info" :text-color="getTextColorForBackground(theme.info)" label="Info" />
            </div>
            <div class="row q-gutter-sm">
              <q-btn outline color="primary" label="Outlined" />
              <q-btn flat color="primary" label="Flat" />
              <q-btn unelevated color="primary" :text-color="getTextColorForBackground(theme.primary)" label="Unelevated" />
              <q-btn round color="primary" :text-color="getTextColorForBackground(theme.primary)" icon="favorite" />
            </div>
          </div>

          <!-- Chips Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Chips</div>
            <div class="row q-gutter-sm">
              <q-chip color="primary" :text-color="getTextColorForBackground(theme.primary)" label="Primary" />
              <q-chip color="secondary" :text-color="getTextColorForBackground(theme.secondary)" label="Secondary" />
              <q-chip color="accent" :text-color="getTextColorForBackground(theme.accent)" label="Accent" />
              <q-chip color="positive" :text-color="getTextColorForBackground(theme.positive)" label="Positive" />
              <q-chip color="negative" :text-color="getTextColorForBackground(theme.negative)" label="Negative" />
              <q-chip color="warning" :text-color="getTextColorForBackground(theme.warning)" label="Warning" />
              <q-chip color="info" :text-color="getTextColorForBackground(theme.info)" label="Info" />
            </div>
          </div>

          <!-- Card Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Card</div>
            <q-card class="q-theme-designer-preview__card">
              <q-card-section :class="['bg-primary', getTextColorClassForBackground(theme.primary)]">
                <div class="text-h6">Card Title</div>
                <div class="text-subtitle2">Subtitle text</div>
              </q-card-section>
              <q-card-section>
                This is a sample card with some content. The header uses the primary color.
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat color="primary" label="Action 1" />
                <q-btn flat color="secondary" label="Action 2" />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Inputs Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Inputs</div>
            <div class="row q-gutter-md">
              <q-input
                v-model="sampleInput"
                outlined
                label="Outlined Input"
                color="primary"
                class="col-5"
              />
              <q-input
                v-model="sampleInput"
                filled
                label="Filled Input"
                color="secondary"
                class="col-5"
              />
            </div>
          </div>

          <!-- List Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">List</div>
            <q-list bordered class="q-theme-designer-preview__list">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon color="primary" name="inbox" />
                </q-item-section>
                <q-item-section>Inbox</q-item-section>
                <q-item-section side>
                  <q-badge color="primary" label="12" />
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon color="secondary" name="star" />
                </q-item-section>
                <q-item-section>Starred</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon color="accent" name="send" />
                </q-item-section>
                <q-item-section>Sent</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Progress Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Progress</div>
            <div class="row q-gutter-md items-center">
              <q-linear-progress
                :value="0.6"
                color="primary"
                class="col-5"
              />
              <q-circular-progress
                :value="60"
                size="50px"
                color="secondary"
                track-color="grey-3"
              />
              <q-spinner-dots color="accent" size="40px" />
            </div>
          </div>

          <!-- Table Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Table</div>
            <q-table
              :rows="tableRows"
              :columns="tableColumns"
              row-key="name"
              flat
              bordered
              class="q-theme-designer-preview__table"
            >
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.value === 'Active' ? 'positive' : 'negative'"
                    :label="props.value"
                  />
                </q-td>
              </template>
            </q-table>
          </div>

          <!-- FAB Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Floating Action Button</div>
            <div class="row q-gutter-md items-center" style="height: 80px">
              <q-fab
                color="primary"
                icon="add"
                direction="right"
                style="position: relative"
              >
                <q-fab-action color="secondary" icon="mail" />
                <q-fab-action color="accent" icon="alarm" />
              </q-fab>
            </div>
          </div>

          <!-- Alerts Section -->
          <div class="q-mb-lg q-px-lg">
            <div class="text-subtitle1 q-mb-sm">Alerts / Banners</div>
            <q-banner :class="['bg-positive', getTextColorClassForBackground(theme.positive), 'q-mb-sm']">
              <template #avatar>
                <q-icon name="check_circle" />
              </template>
              Success message banner
            </q-banner>
            <q-banner :class="['bg-negative', getTextColorClassForBackground(theme.negative), 'q-mb-sm']">
              <template #avatar>
                <q-icon name="error" />
              </template>
              Error message banner
            </q-banner>
            <q-banner :class="['bg-warning', getTextColorClassForBackground(theme.warning), 'q-mb-sm']">
              <template #avatar>
                <q-icon name="warning" />
              </template>
              Warning message banner
            </q-banner>
            <q-banner :class="['bg-info', getTextColorClassForBackground(theme.info)]">
              <template #avatar>
                <q-icon name="info" />
              </template>
              Info message banner
            </q-banner>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import { getContrastInfo } from '../../composables/use-theme-designer/use-theme-designer.js'
import ThemeDesignerColorCards from './ThemeDesignerColorCards.vue'

export default {
  name: 'ThemeDesignerPreview',

  components: {
    ThemeDesignerColorCards
  },

  props: {
    cssVars: {
      type: Object,
      required: true
    },
    theme: {
      type: Object,
      required: true
    },
    isDarkMode: {
      type: Boolean,
      default: undefined
    },
    textColorPreference: {
      type: String,
      default: 'recommended',
      validator: (value) => [ 'recommended', 'light', 'dark' ].includes(value)
    }
  },

  setup (props) {
    const $q = useQuasar()
    const sampleInput = ref('Sample text')

    // Force re-render key when cssVars change
    const previewKey = computed(() => JSON.stringify(props.cssVars))

    // Use prop if provided, otherwise use global dark mode
    const darkMode = computed(() => {
      return props.isDarkMode !== undefined ? props.isDarkMode : $q.dark.isActive
    })

    // Get text color for a given background color based on preference
    function getTextColorForBackground (color) {
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

    // Get text color class for a given background color
    function getTextColorClassForBackground (color) {
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

    const tableColumns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' }
    ]

    const tableRows = [
      { name: 'John Doe', email: 'john@example.com', status: 'Active' },
      { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
      { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
    ]

    return {
      sampleInput,
      previewKey,
      tableColumns,
      tableRows,
      // eslint-disable-next-line vue/no-dupe-keys
      isDarkMode: darkMode, // Computed shadows prop to provide fallback logic
      getTextColorForBackground,
      getTextColorClassForBackground
    }
  }
}
</script>

<style lang="sass">
.q-theme-designer-preview
  flex: 1
  overflow-y: auto
  background: #fafafa
  height: 100%

  &--dark
    background: var(--q-dark-page, #121212)
    color: #fff

  &__content
    width: 100%

  &__components
    width: 100%

  &__card
    max-width: 400px

  &__list
    max-width: 400px

  &__table
    max-width: 600px

  &__color-cards
    padding-left: 16px
    padding-right: 16px

    @media (min-width: 600px)
      padding-left: 16px
      padding-right: 16px

// Mobile: Disable individual scroll, use unified scroll from parent
@media (max-width: 599px)
  .q-theme-designer-preview
    overflow-y: visible !important
    overflow-x: hidden !important
</style>
