<template>
  <div class="q-pa-md">
    <q-linear-progress size="25px" :value="progress1" color="accent">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel1" />
      </div>
    </q-linear-progress>

    <q-linear-progress
      size="50px"
      :value="progress2"
      color="accent"
      class="q-mt-sm"
    >
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel2" />
      </div>
    </q-linear-progress>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const progress1 = ref(0.3)
const progressLabel1 = computed(() => (progress1.value * 100).toFixed(2) + '%')
const progress2 = ref(0.9)
const progressLabel2 = computed(() => (progress2.value * 100).toFixed(2) + '%')
</script>
