<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20, step 4)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      :label-value="value + 'px'"
      label-always
      color="purple"
    />

    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20, step 4)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      :label-value="value + 'px'"
      label-always
      color="red"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>
