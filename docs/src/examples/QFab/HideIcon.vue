<template>
  <div class="q-pa-md">
    <q-fab
      v-model="fab"
      label="Actions"
      label-position="left"
      color="purple"
      hide-icon
      direction="right"
    >
      <q-fab-action color="primary" @click="onClick" hide-icon label="Email" />
      <q-fab-action color="secondary" @click="onClick" hide-icon label="Alarm" />
    </q-fab>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      fab: ref(true),
      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
