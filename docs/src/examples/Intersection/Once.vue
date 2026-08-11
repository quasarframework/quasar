<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div
        v-intersection.once="onIntersection"
        class="example-observed text-center rounded-borders"
      >
        Observed Element
      </div>

      <div class="example-filler" />
    </div>

    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      {{ visible ? 'Visible' : 'Hidden' }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const visible = ref(false)

const visibleClass = computed(
  () => `bg-${visible.value ? 'positive' : 'negative'}`
)

const message = computed(() =>
  visible.value ? "Visible. We're done." : 'Hidden'
)

function onIntersection(entry) {
  visible.value = entry.isIntersecting
}
</script>

<style lang="sass" scoped>
.example-state
  background: #ccc
  font-size: 20px
  color: #282a37
  padding: 10px
  opacity: 0.8

.example-observed
  width: 100%
  font-size: 20px
  color: #ccc
  background: #424242
  padding: 10px

.example-area
  height: 300px

.example-filler
  height: 500px
</style>
