<template>
  <div class="q-pa-md q-gutter-md">
    <q-linear-progress
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      :value="progress"
      color="primary"
      @click="randomize"
      label="Change Model"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const progress = ref(0.65)

    return {
      progress,
      randomize () {
        progress.value = Math.random()
      }
    }
  }
}
</script>
