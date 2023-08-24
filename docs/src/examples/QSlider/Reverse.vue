<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ standard }} (0 to 50)
    </q-badge>

    <q-slider reverse v-model="standard" :min="0" :max="50"/>
    <q-slider reverse v-model="standard" :min="0" :max="50" color="green"/>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      standard: ref(2)
    }
  }
}
</script>
