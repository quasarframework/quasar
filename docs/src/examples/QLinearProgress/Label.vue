<template>
  <div class="q-pa-md">
    <q-linear-progress size="25px" :value="progress1" color="accent">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel1" />
      </div>
    </q-linear-progress>

    <q-linear-progress size="50px" :value="progress2" color="accent" class="q-mt-sm">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel2" />
      </div>
    </q-linear-progress>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const progress1 = ref(0.3)
    const progress2 = ref(0.9)

    return {
      progress1,
      progressLabel1: computed(() => (progress1.value * 100).toFixed(2) + '%'),

      progress2,
      progressLabel2: computed(() => (progress2.value * 100).toFixed(2) + '%')
    }
  }
}
</script>
