<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination
        v-model="current"
        max="5"
        direction-links
        flat
        color="grey"
        active-color="primary"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        outline
        color="orange"
        active-design="unelevated"
        active-color="brown"
        active-text-color="orange"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        push
        color="teal"
        active-design="push"
        active-color="orange"
      />

      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        unelevated
        color="black"
        active-color="purple"
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
