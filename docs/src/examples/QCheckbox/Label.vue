<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox v-model="right" label="Label on Right" />
    </div>
    <div class="q-gutter-sm">
      <q-checkbox left-label v-model="left" label="Label on Left" />
    </div>

    <div class="q-px-sm">
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      left: ref(true),
      right: ref(false)
    }
  }
}
</script>
