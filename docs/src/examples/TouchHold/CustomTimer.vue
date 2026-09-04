<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold:2000.mouse="handleHold"
      class="custom-area cursor-pointer bg-purple text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Click/touch and hold for 2 seconds.
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleHold({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 170px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
  line-height: 1.2
</style>
