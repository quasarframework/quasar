<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        disable-tab-selection
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
