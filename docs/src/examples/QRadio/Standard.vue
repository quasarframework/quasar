<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="shape" val="line" label="Line" />
      <q-radio v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio v-model="shape" val="polygon" label="Polygon" />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
