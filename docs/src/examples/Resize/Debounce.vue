<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      Drag the bottom-right corner of the box. The box reports every frame, the
      debounced one at most every 300ms.
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-6">
        <div
          v-resize="onImmediate"
          class="container bg-amber rounded-borders q-pa-sm"
        >
          Immediate: {{ immediate }}
        </div>
        <div class="q-mt-sm">Reports: {{ immediateCount }}</div>
      </div>

      <div class="col-6">
        <div
          v-resize:300="onDebounced"
          class="container bg-orange rounded-borders q-pa-sm"
        >
          Debounced: {{ debounced }}
        </div>
        <div class="q-mt-sm">Reports: {{ debouncedCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const immediate = ref('')
const immediateCount = ref(0)
const debounced = ref('')
const debouncedCount = ref(0)

function onImmediate({ width, height }) {
  immediate.value = `${width} x ${height}`
  immediateCount.value++
}

function onDebounced({ width, height }) {
  debounced.value = `${width} x ${height}`
  debouncedCount.value++
}
</script>

<style lang="sass" scoped>
.container
  width: 100%
  height: 120px
  min-width: 100px
  min-height: 60px
  resize: both
  overflow: auto
</style>
