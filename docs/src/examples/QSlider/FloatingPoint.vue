<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ smallStep }} (0.1 to 1.5, step 0.1)
    </q-badge>

    <q-slider
      v-model="smallStep"
      :min="0.1"
      :max="1.5"
      :step="0.1"
    />

    <q-badge color="secondary">
      Model: {{ xsmallStep }} (0.1 to 1, step 0.05)
    </q-badge>

    <q-slider
      v-model="xsmallStep"
      :min="0.1"
      :max="1"
      :step="0.05"
    />

    <q-badge color="secondary">
      Model: {{ zeroStep }} (0.0 to 10.5, step 0)
    </q-badge>

    <q-slider
      v-model="zeroStep"
      :min="0.0"
      :max="10.5"
      :step="0"
      color="red"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      smallStep: ref(0.3),
      xsmallStep: ref(0.530),
      zeroStep: ref(0.5)
    }
  }
}
</script>
