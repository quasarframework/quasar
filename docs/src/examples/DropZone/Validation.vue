<template>
  <div class="q-pa-md q-gutter-md">
    <div
      v-drop-zone="{
        handler: onDrop,
        multiple: true,
        accept: 'image/*',
        maxFileSize: 1024 * 1024,
        onRejected
      }"
      class="drop-zone column flex-center q-pa-lg rounded-borders text-center"
    >
      <q-icon name="add_photo_alternate" size="48px" />
      <div class="q-mt-sm">Drop images here (up to 1MB each)</div>
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
import { shallowRef } from 'vue'
import { format, useQuasar } from 'quasar'

const $q = useQuasar()
const files = shallowRef([])

function onDrop(dropped) {
  files.value = [...files.value, ...dropped]
}

function onRejected(rejected) {
  $q.notify({
    type: 'negative',
    message: `${rejected.length} file(s) did not pass the validation`
  })
}
</script>

<style lang="sass" scoped>
.drop-zone
  border: 1px solid $grey-5
</style>
