<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div v-intersection="onIntersection" class="example-observed text-center rounded-borders">
        Observed Element
      </div>

      <div class="example-filler" />
    </div>

    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      {{ visible === true ? 'Visible' : 'Hidden' }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const visible = ref(false)

    return {
      visible,
      visibleClass: computed(
        () => `bg-${visible.value ? 'positive' : 'negative'}`
      ),

      onIntersection (entry) {
        visible.value = entry.isIntersecting
      }
    }
  }
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
