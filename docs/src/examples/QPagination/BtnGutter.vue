<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination
        v-model="current"
        max="5"
        direction-links
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        gutter="sm"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        gutter="md"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        gutter="20px"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      current: ref(2)
    }
  }
}
</script>
