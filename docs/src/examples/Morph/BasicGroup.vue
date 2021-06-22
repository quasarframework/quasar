<template>
  <div class="q-pa-md relative-position" style="height: 600px; max-height: 80vh">
    <div
      class="absolute-top-left bg-red text-white q-ma-md q-pa-lg"
      style="border-radius: 10px; font-size: 32px"
      v-morph:topleft:boxes:800="morphGroupModel"
    >
      Top left
    </div>

    <div
      class="absolute-top-right bg-blue text-white q-ma-lg q-pa-xl"
      style="border-radius: 20px; font-size: 18px"
      v-morph:topright:boxes:600.tween="morphGroupModel"
    >
      Top right
    </div>

    <div
      class="absolute-bottom-right bg-orange text-white q-ma-lg q-pa-lg"
      style="border-radius: 0"
      v-morph:bottomright:boxes:400="morphGroupModel"
    >
      Bottom right
    </div>

    <div
      class="absolute-bottom-left bg-green text-white q-ma-xl q-pa-md"
      style="border-radius: 40px; font-size: 24px"
      v-morph:bottomleft:boxes:600.resize="morphGroupModel"
    >
      Bottom left
    </div>

    <q-btn
      class="absolute-center"
      color="purple"
      label="Next morph"
      no-caps
      @click="nextMorph"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

const boxValues = [
  'topleft',
  'topright',
  'bottomleft',
  'bottomright'
]

export default {
  setup () {
    const morphGroupModel = ref('topleft')

    return {
      morphGroupModel,
      nextMorph () {
        let value = morphGroupModel.value

        // pick random box, other than current one
        while (value === morphGroupModel.value) {
          const i = Math.floor(Math.random() * boxValues.length)
          value = boxValues[ i ]
        }

        morphGroupModel.value = value
      }
    }
  }
}
</script>
