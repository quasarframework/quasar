<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.horizontal.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="row items-center">
        <q-icon name="arrow_back" />
        <div>Pan to left or right only</div>
        <q-icon name="arrow_forward" />
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const info = ref(null)
    const panning = ref(false)

    return {
      info,
      panning,

      handlePan ({ evt, ...newInfo }) {
        info.value = newInfo

        // native Javascript event
        // console.log(evt)

        if (newInfo.isFirst) {
          panning.value = true
        }
        else if (newInfo.isFinal) {
          panning.value = false
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
