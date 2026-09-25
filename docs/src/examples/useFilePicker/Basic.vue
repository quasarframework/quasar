<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn
      color="primary"
      push
      icon="attach_file"
      label="Pick images (up to 1MB each)"
      @click="attach"
    />

    <q-list
      v-if="acceptedPickerFiles.length !== 0"
      bordered
      separator
      class="rounded-borders"
    >
      <q-item v-for="file in acceptedPickerFiles" :key="file.name">
        <q-item-section>{{ file.name }}</q-item-section>
        <q-item-section side>{{
          format.humanStorageSize(file.size)
        }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { format, useFilePicker, useQuasar } from 'quasar'

const $q = useQuasar()

const { acceptedPickerFiles, openFilePicker } = useFilePicker({
  multiple: true,
  accept: 'image/*',
  maxFileSize: 1024 * 1024,
  onRejected(rejected) {
    $q.notify({
      type: 'negative',
      message: `${rejected.length} file(s) did not pass the validation`
    })
  }
})

async function attach() {
  const picked = await openFilePicker()

  if (picked === null) {
    $q.notify({ message: 'The dialog was dismissed' })
  }
}
</script>
