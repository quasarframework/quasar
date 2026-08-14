<template>
  <div class="overflow-hidden">
    <q-resize-observer @resize="onResize" :debounce="0" />

    <q-splitter
      id="photos"
      v-model="splitterModel"
      :limits="[0, 100]"
      :style="splitterStyle"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
    >
      <template v-slot:before>
        <img
          alt="Landscape photo"
          src="https://cdn.quasar.dev/img/parallax1.jpg"
          :width="width"
          class="absolute-top-left"
        />
      </template>

      <template v-slot:after>
        <img
          alt="Landscape photo in black and white"
          src="https://cdn.quasar.dev/img/parallax1-bw.jpg"
          :width="width"
          class="absolute-top-right"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const width = ref(400)
const splitterModel = ref(50) // start at 50%

const splitterStyle = computed(() => ({
  height: Math.min(600, 0.66 * width.value) + 'px',
  width: width.value + 'px'
}))

function onResize(info) {
  width.value = info.width
}
</script>
