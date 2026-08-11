<template>
  <div class="q-pa-md">
    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      :options="[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
