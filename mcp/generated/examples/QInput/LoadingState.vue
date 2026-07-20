<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input :loading="loadingState" filled v-model="text" label="Label" />
      <q-toggle v-model="loadingState" label="Loading state" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const loadingState = ref(false)
</script>
