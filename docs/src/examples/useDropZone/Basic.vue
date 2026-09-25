<template>
  <div class="q-pa-md q-gutter-md">
    <div
      ref="zone"
      class="drop-zone column flex-center q-pa-lg rounded-borders text-center"
      :class="isOverDropZone ? 'drop-zone--over' : ''"
    >
      <q-icon name="cloud_upload" size="48px" />
      <div class="q-mt-sm">Drop images here (up to 5MB each)</div>
      <q-btn
        push
        color="primary"
        label="Or pick them"
        class="q-mt-sm"
        @click="openFilePicker"
      />
    </div>

    <q-list
      v-if="files.length !== 0"
      bordered
      separator
      class="rounded-borders"
    >
      <q-item v-for="(file, index) in files" :key="index">
        <q-item-section>{{ file.name }}</q-item-section>
        <q-item-section side>{{
          format.humanStorageSize(file.size)
        }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { shallowRef, useTemplateRef } from 'vue'
import { format, useDropZone, useFilePicker, useQuasar } from 'quasar'

const $q = useQuasar()
const zone = useTemplateRef('zone')
const files = shallowRef([])

const options = {
  multiple: true,
  accept: 'image/*',
  maxFileSize: 5 * 1024 * 1024,
  onRejected(rejected) {
    $q.notify({
      type: 'negative',
      message: `${rejected.length} file(s) did not pass the validation`
    })
  }
}

function addFiles(accepted) {
  files.value = [...files.value, ...accepted]
}

const { isOverDropZone } = useDropZone({
  ...options,
  target: zone,
  onDrop: addFiles
})

const { openFilePicker } = useFilePicker({
  ...options,
  onChange: addFiles
})
</script>

<style lang="sass" scoped>
.drop-zone
  border: 2px dashed $grey-5
  transition: background-color .2s, border-color .2s

  &--over
    border-color: $primary
    background-color: rgba($primary, .08)
</style>
