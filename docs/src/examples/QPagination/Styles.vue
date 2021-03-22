<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        flat
        color="grey-4"
        active-color="primary"
      />

      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        outline
        color="orange"
        active-color="primary"
      />

      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        push
        color="teal"
      />

      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        unelevated
        color="black"
        active-color="yellow"
        active-text-color="black"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      current: ref(3)
    }
  }
}
</script>
