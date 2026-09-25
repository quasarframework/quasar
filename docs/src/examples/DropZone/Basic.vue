<template>
  <div class="q-pa-md q-gutter-md">
    <div
      v-drop-zone.multiple="onDrop"
      class="drop-zone column flex-center q-pa-lg rounded-borders text-center"
    >
      <q-icon name="cloud_upload" size="48px" />
      <div class="q-mt-sm">Drop files here</div>
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
import { format } from 'quasar'

const files = shallowRef([])

function onDrop(dropped) {
  files.value = [...files.value, ...dropped]
}
</script>

<style lang="sass" scoped>
.drop-zone
  border: 1px solid $grey-5
</style>
