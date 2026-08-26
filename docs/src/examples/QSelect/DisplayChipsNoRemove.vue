<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-select
      filled
      v-model="model"
      multiple
      :options="options"
      use-chips
      no-chip-remove
      stack-label
      label="Non-removable chips"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(['Google', 'Facebook'])
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
