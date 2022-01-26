<template>
  <div class="relative-position">
    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      Percent: {{ percent }}%
    </div>

    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div v-intersection="options" class="example-observed flex flex-center rounded-borders">
        Observed Element
      </div>

      <div class="example-filler" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

const thresholds = []

for (let i = 0; i <= 1.0; i += 0.01) {
  thresholds.push(i)
}

export default {
  setup () {
    const percent = ref(0)

    return {
      percent,
      visibleClass: computed(
        () => `bg-${percent.value > 0 ? 'positive' : 'negative'}`
      ),

      options: {
        handler (entry) {
          const val = (entry.intersectionRatio * 100).toFixed(0)
          if (percent.value !== val) {
            percent.value = val
          }
        },
        cfg: {
          threshold: thresholds
        }
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
  height: 150px
  font-size: 20px
  color: #ccc
  background: #282a37
  padding: 10px

.example-area
  height: 300px

.example-filler
  height: 500px
</style>
