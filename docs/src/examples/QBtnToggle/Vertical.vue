<template>
  <div class="q-pa-md row q-gutter-md items-start">
    <q-btn-toggle
      v-model="model"
      vertical
      toggle-color="primary"
      :options="[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ]"
    />

    <q-btn-toggle
      v-model="model"
      vertical
      outline
      no-caps
      toggle-color="primary"
      :options="[
        { label: 'Left', value: 'one', icon: 'format_align_left' },
        { label: 'Center', value: 'two', icon: 'format_align_center' },
        { label: 'Right', value: 'three', icon: 'format_align_right' }
      ]"
    />

    <q-btn-toggle
      v-model="model"
      vertical
      spread
      rounded
      unelevated
      style="height: 160px"
      toggle-color="teal"
      color="white"
      text-color="teal"
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

const model = ref('one')
</script>
