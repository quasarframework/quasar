<template>
  <div class="q-pa-md">
    <q-toggle v-model="immediate" label="immediate" class="q-mb-md" />

    <div
      class="bg-grey-3 rounded-borders flex flex-center text-grey-8"
      style="height: 160px; user-select: none"
      @mousemove="onMove"
      @touchmove.prevent="onMove"
    >
      Move the pointer here
    </div>

    <div class="row items-center q-gutter-sm q-mt-md">
      <q-badge color="grey-7" :label="`events: ${events}`" />
      <q-badge color="primary" :label="`runs: ${runs}`" />
      <q-badge color="secondary" :label="`position: ${position}`" />
      <q-badge v-if="isWaiting" color="orange" label="waiting" />
    </div>

    <div class="text-caption q-mt-sm">
      The position updates once the pointer stops for 250ms, with where it
      stopped. With immediate on, it updates where the movement started instead.
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDebounce } from 'quasar'

const immediate = ref(false)
const events = ref(0)
const runs = ref(0)
const position = ref('-')

function track(evt) {
  const point = evt.touches !== void 0 ? evt.touches[0] : evt
  runs.value++
  position.value = `${Math.round(point.clientX)}, ${Math.round(point.clientY)}`
}

const { debounceFn: trailingTrack, isDebouncePending } = useDebounce(track, 250)
const { debounceFn: immediateTrack } = useDebounce(track, 250, true)

const isWaiting = computed(
  () => immediate.value !== true && isDebouncePending.value
)

function onMove(evt) {
  events.value++
  if (immediate.value === true) {
    immediateTrack(evt)
  } else {
    trailingTrack(evt)
  }
}
</script>
