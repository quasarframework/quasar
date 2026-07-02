<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Standard"
        emit-value
        map-options
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    label: 'Google',
    value: 'goog'
  },
  // #region
  {
    label: 'Facebook',
    value: 'fb'
  },
  {
    label: 'Twitter',
    value: 'twt'
  },
  {
    label: 'Apple',
    value: 'app'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'ora',
    disable: true
  }
]
</script>
