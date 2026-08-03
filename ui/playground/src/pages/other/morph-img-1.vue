<template>
  <div class="q-pa-md">
    <div
      class="row justify-center q-gutter-sm q-mx-auto"
      style="max-width: 80vw"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="cursor-pointer"
        style="border-radius: 3%/5%; width: 300px; max-width: 20vw"
        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>

    <q-img
      ref="refFull"
      class="cursor-pointer fixed-center z-top"
      :class="indexZoomed === void 0 ? 'no-pointer-events' : void 0"
      style="border-radius: 3%/5%; width: 800px; max-width: 70vw"
      :src="images[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { ref } from 'vue'

const indexZoomed = ref(void 0)
const imgLoaded = ref({
  promise: Promise.resolve(),
  resolve: () => {},
  reject: () => {}
})
const images = ref(
  Array.from(
    { length: 24 },
    (_, i) => 'https://picsum.photos/id/' + i + '/500/300'
  )
)

const refThumb = ref(null)
const refFull = ref(null)

let cancel

function imgLoadedResolve() {
  imgLoaded.value.resolve()
}

function imgLoadedReject() {
  imgLoaded.value.reject()
}

function zoomImage(index) {
  const zoomedIndex = indexZoomed.value

  imgLoaded.value.reject()

  const zoom = () => {
    if (index !== void 0 && index !== zoomedIndex) {
      imgLoaded.value.promise = new Promise((resolve, reject) => {
        imgLoaded.value.resolve = () => {
          imgLoaded.value.resolve = () => {}
          imgLoaded.value.reject = () => {}

          resolve()
        }
        imgLoaded.value.reject = () => {
          imgLoaded.value.resolve = () => {}
          imgLoaded.value.reject = () => {}

          reject(new Error('Error loading image'))
        }
      })

      cancel = morph({
        from: refThumb.value[index].$el,
        to: refFull.value.$el,
        onToggle: () => {
          indexZoomed.value = index
        },
        waitFor: imgLoaded.value.promise,
        duration: 400,
        hideFromClone: true,
        onEnd: end => {
          if (end === 'from' && indexZoomed.value === index) {
            indexZoomed.value = void 0
          }
        }
      })
    }
  }

  if (zoomedIndex !== void 0 && (cancel === void 0 || cancel() === false)) {
    morph({
      from: refFull.value.$el,
      to: refThumb.value[zoomedIndex].$el,
      onToggle: () => {
        indexZoomed.value = void 0
      },
      duration: 200,
      keepToClone: true,
      onEnd: zoom
    })
  } else {
    zoom()
  }
}
</script>
