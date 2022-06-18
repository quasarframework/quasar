<template>
  <div class="q-pa-md">
    <q-btn size="sm" color="primary" @click="randomize" label="Change Model" />

    <q-linear-progress reverse :value="progress" class="q-mt-md" />

    <q-linear-progress reverse :value="progress" color="warning" class="q-mt-sm" />

    <q-linear-progress reverse :value="progress" color="secondary" class="q-mt-sm" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const progress = ref(0.4)

    return {
      progress,
      randomize () {
        progress.value = Math.random()
      }
    }
  }
}
</script>
