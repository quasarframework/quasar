<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Open dialog" color="primary" @click="dialog = true">
      <q-tooltip>Open a dialog that returns focus to this button</q-tooltip>
    </q-btn>
    <q-btn label="Next control" flat />

    <q-dialog v-model="dialog" aria-label="Tooltip focus restoration">
      <q-card style="max-width: 400px">
        <q-card-section>
          Press Escape to close. Focus returns to the opener without showing its
          tooltip. Hover the opener, or Tab away and back, to show it again.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Close" color="primary" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
</script>
