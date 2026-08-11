<template>
  <div class="q-layout-padding">
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-input
          ref="input"
          v-model="text"
          label="Standard"
          autofocus
        ></q-input>

        <button
          @mousedown.prevent
          @touchstart.prevent
          @keydown.enter.space.prevent
        >
          Click me - preventing mousedown works here
        </button>

        <q-btn
          label="Click me - preventing!"
          @keydown.enter.space.prevent
          @mousedown.prevent
          @touchstart.prevent
        />
        <q-btn label="Click me - not preventing" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
