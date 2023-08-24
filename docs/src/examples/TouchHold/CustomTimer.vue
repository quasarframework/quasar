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

<script>
import { ref } from 'vue'

export default {
  setup () {
    const info = ref(null)

    return {
      info,

      handleHold ({ evt, ...newInfo }) {
        info.value = newInfo

        // native Javascript event
        // console.log(evt)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 200px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
