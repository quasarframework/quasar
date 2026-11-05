<template>
  <div class="q-pa-md">
    <p>
      Hover the button, focus it with the keyboard and press Enter while the
      tooltip opens. The input receives focus when the transition completes.
      This example uses a one-second transition to make the sequence easier to
      try.
    </p>
    <button type="button" @click="input?.focus()">
      Focus the input
      <q-tooltip
        :transition-duration="1000"
        @show="showCount++"
        @hide="hideCount++"
      >
        Press Enter to request input focus
      </q-tooltip>
    </button>
    <q-input
      ref="input"
      v-model="inputValue"
      class="q-mt-md"
      outlined
      label="Target input"
    />
    <div class="q-mt-sm" role="status">
      Completed transitions: {{ showCount }} show, {{ hideCount }} hide
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const input = useTemplateRef('input')
const inputValue = ref('')
const showCount = ref(0)
const hideCount = ref(0)
</script>
