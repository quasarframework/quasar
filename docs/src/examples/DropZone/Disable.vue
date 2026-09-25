<template>
  <div class="q-pa-md q-gutter-md">
    <q-toggle v-model="enabled" label="Accept drops" />

    <div
      v-drop-zone="enabled ? onDrop : false"
      class="drop-zone column flex-center q-pa-lg rounded-borders text-center"
      :class="{ 'drop-zone--disabled': !enabled }"
    >
      <q-icon name="cloud_upload" size="48px" />
      <div class="q-mt-sm">
        {{ enabled ? 'Drop a file here' : 'Drops are not accepted' }}
      </div>
    </div>

    <div v-if="lastFile !== null">Last dropped file: {{ lastFile.name }}</div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'

const enabled = ref(true)
const lastFile = shallowRef(null)

function onDrop(files) {
  lastFile.value = files[0]
}
</script>

<style lang="sass" scoped>
.drop-zone
  border: 1px solid $grey-5
  transition: opacity .2s

  &--disabled
    opacity: .5
</style>
