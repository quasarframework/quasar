<template>
  <div class="q-pa-md">
    <div
      class="row no-wrap q-gutter-x-sm"
      style="overflow-x: auto; overflow-y: visible"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="cursor-pointer"
        :class="index === indexZoomed ? 'fixed-center z-top' : void 0"
        style="border-radius: 3%/5%; flex: 0 0 20vw"
        :style="
          index === indexZoomed ? 'width: 800px; max-width: 70vw' : void 0
        "
        :src="src"
        @click="zoomImage(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { ref } from 'vue'

const indexZoomed = ref(void 0)
const images = ref(
  Array.from(
    { length: 24 },
    (_, i) => 'https://picsum.photos/id/' + i + '/500/300'
  )
)

const refThumb = ref(null)

let cancel

function zoomImage(index) {
  const zoomedIndex = indexZoomed.value

  indexZoomed.value = void 0

  if (index !== void 0 && index !== zoomedIndex) {
    cancel = morph({
      from: refThumb.value[index].$el,
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

  if (zoomedIndex !== void 0 && (cancel === void 0 || cancel() === false)) {
    morph({
      from: refThumb.value[zoomedIndex].$el,
      waitFor: 100,
      duration: 300
    })
  }
}
</script>
