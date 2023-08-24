<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-swipe.mouse="handleSwipe"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <q-icon name="arrow_back" />
          <div>Swipe in any direction</div>
          <q-icon name="arrow_forward" />
        </div>
        <q-icon name="arrow_downward" />
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
      handleSwipe ({ evt, ...newInfo }) {
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
  height: 220px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px
</style>
