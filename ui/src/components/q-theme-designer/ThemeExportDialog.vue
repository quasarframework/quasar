<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="q-theme-designer-export-dialog" style="min-width: 600px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Export Theme</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          aria-label="Close export dialog"
        />
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="sass" label="SASS" />
          <q-tab name="css" label="CSS" />
          <q-tab name="cli" label="Quasar CLI" />
          <q-tab name="vite" label="Vite Plugin" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated class="q-mt-md">
          <!-- SASS Panel -->
          <q-tab-panel name="sass" class="q-pa-none">
            <div class="text-caption q-mb-sm text-grey-7">
              Copy to <code>src/css/quasar.variables.sass</code>
            </div>
            <q-input
              :model-value="exportFormats.sass"
              type="textarea"
              outlined
              readonly
              :rows="12"
              class="q-theme-designer-export-dialog__code"
            />
            <q-btn
              color="primary"
              label="Copy SASS"
              icon="content_copy"
              class="q-mt-md"
              @click="copyToClipboard(exportFormats.sass, 'SASS')"
            />
          </q-tab-panel>

          <!-- CSS Panel -->
          <q-tab-panel name="css" class="q-pa-none">
            <div class="text-caption q-mb-sm text-grey-7">
              Add to your global CSS or <code>:root</code> selector
            </div>
            <q-input
              :model-value="exportFormats.css"
              type="textarea"
              outlined
              readonly
              :rows="12"
              class="q-theme-designer-export-dialog__code"
            />
            <q-btn
              color="primary"
              label="Copy CSS"
              icon="content_copy"
              class="q-mt-md"
              @click="copyToClipboard(exportFormats.css, 'CSS')"
            />
          </q-tab-panel>

          <!-- Quasar CLI Panel -->
          <q-tab-panel name="cli" class="q-pa-none">
            <div class="text-caption q-mb-sm text-grey-7">
              Add to <code>quasar.config.ts</code> or <code>quasar.config.js</code>
            </div>
            <q-input
              :model-value="exportFormats.quasarConfig"
              type="textarea"
              outlined
              readonly
              :rows="12"
              class="q-theme-designer-export-dialog__code"
            />
            <q-btn
              color="primary"
              label="Copy CLI Config"
              icon="content_copy"
              class="q-mt-md"
              @click="copyToClipboard(exportFormats.quasarConfig, 'CLI Config')"
            />
          </q-tab-panel>

          <!-- Vite Plugin Panel -->
          <q-tab-panel name="vite" class="q-pa-none">
            <div class="text-caption q-mb-sm text-grey-7">
              Add to <code>vite.config.ts</code> or <code>vite.config.js</code>
            </div>
            <q-input
              :model-value="exportFormats.vitePlugin"
              type="textarea"
              outlined
              readonly
              :rows="12"
              class="q-theme-designer-export-dialog__code"
            />
            <q-btn
              color="primary"
              label="Copy Vite Config"
              icon="content_copy"
              class="q-mt-md"
              @click="copyToClipboard(exportFormats.vitePlugin, 'Vite Config')"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import useQuasar from '../../composables/use-quasar/use-quasar.js'

export default {
  name: 'ThemeExportDialog',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    exportFormats: {
      type: Object,
      required: true
    }
  },

  emits: [ 'update:modelValue' ],

  setup () {
    const $q = useQuasar()
    const activeTab = ref('sass')

    async function copyToClipboard (text, formatName) {
      try {
        await navigator.clipboard.writeText(text)
        $q.notify({
          type: 'positive',
          message: `${ formatName } copied to clipboard!`,
          position: 'bottom',
          timeout: 2000
        })
      }
      catch (err) {
        console.error('Failed to copy:', err)
        $q.notify({
          type: 'negative',
          message: 'Failed to copy to clipboard',
          position: 'bottom',
          timeout: 2000
        })
      }
    }

    return {
      activeTab,
      copyToClipboard
    }
  }
}
</script>

<style lang="sass">
.q-theme-designer-export-dialog
  &__code
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace

    .q-field__control
      background: #1e1e1e

    textarea
      color: #d4d4d4 !important
      font-size: 12px
      line-height: 1.5
</style>
