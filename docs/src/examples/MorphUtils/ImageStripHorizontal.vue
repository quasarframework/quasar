<template>
  <div class="q-pa-md">
    <div class="row no-wrap q-gutter-x-sm" style="overflow-x: auto; overflow-y: visible;">
      <q-img
        v-for="(src, index) in images"
        :key="index"
        :ref="el => { thumbRef[index] = el }"
        class="cursor-pointer"
        :class="index === indexZoomed ? 'fixed-top q-mt-md q-mx-auto z-top' : void 0"
        style="border-radius: 3%/5%; flex: 0 0 10vw"
        :style="index === indexZoomed ? 'width: 800px; max-width: 70vw' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUpdate } from 'vue'
import { morph } from 'quasar'

export default {
  setup () {
    const thumbRef = ref([])

    const indexZoomed = ref(void 0)
    const images = ref(Array(24).fill(null).map((_, i) => 'https://picsum.photos/id/' + i + '/500/300'))

    function zoomImage (index) {
      const indexZoomedState = indexZoomed.value
      let cancel = void 0

      indexZoomed.value = void 0

      if (index !== void 0 && index !== indexZoomedState) {
        cancel = morph({
          from: thumbRef.value[ index ].$el,
          onToggle: () => {
            indexZoomed.value = index
          },
          duration: 500,
          onEnd: end => {
            if (end === 'from' && indexZoomed.value === index) {
              indexZoomed.value = void 0
            }
          }
        })
      }

      if (
        indexZoomedState !== void 0 &&
        (cancel === void 0 || cancel() === false)
      ) {
        morph({
          from: thumbRef.value[ indexZoomedState ].$el,
          waitFor: 100,
          duration: 300
        })
      }
    }

    // Make sure to reset the dynamic refs before each update.
    onBeforeUpdate(() => {
      thumbRef.value = []
    })

    return {
      thumbRef,
      indexZoomed,
      images,
      zoomImage
    }
  }
}
</script>
