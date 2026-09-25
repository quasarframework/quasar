<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-gutter-sm">
      <q-btn
        color="primary"
        push
        label="Pick a document"
        @click="pickDocument"
      />
      <q-btn color="secondary" push label="Pick a folder" @click="pickFolder" />
    </div>

    <div v-if="acceptedPickerFiles.length !== 0" class="q-gutter-sm">
      <q-badge :label="`${acceptedPickerFiles.length} file(s)`" />
      <div
        v-for="file in acceptedPickerFiles.slice(0, 10)"
        :key="file.webkitRelativePath || file.name"
      >
        {{ file.webkitRelativePath || file.name }}
      </div>
      <div v-if="acceptedPickerFiles.length > 10">...</div>
    </div>
  </div>
</template>

<script setup>
import { useFilePicker } from 'quasar'

const { acceptedPickerFiles, openFilePicker } = useFilePicker({
  accept: '.pdf,.doc,.docx,.txt'
})

function pickDocument() {
  openFilePicker()
}

function pickFolder() {
  // the overrides apply to this one call only
  openFilePicker({ directory: true, accept: void 0 })
}
</script>
