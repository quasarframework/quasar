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
      push
      no-caps
      color="white"
      text-color="dark"
      toggle-color="amber"
      toggle-text-color="dark"
      align="left"
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
      color="yellow-2"
      toggle-color="teal"
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
