<template>
  <div class="q-pa-md">
    <q-toggle v-model="trailing" label="trailing" class="q-mb-md" />

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
    </div>

    <div class="text-caption q-mt-sm">
      The position updates at most once every 250ms. With trailing on, the last
      position of a movement always gets through.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThrottle } from 'quasar'

const trailing = ref(false)
const events = ref(0)
const runs = ref(0)
const position = ref('-')

function track(evt) {
  const point = evt.touches !== void 0 ? evt.touches[0] : evt
  runs.value++
  position.value = `${Math.round(point.clientX)}, ${Math.round(point.clientY)}`
}

const { throttleFn: dropping } = useThrottle(track, 250)
const { throttleFn: trailingTrack } = useThrottle(track, 250, {
  trailing: true
})

function onMove(evt) {
  events.value++
  if (trailing.value === true) {
    trailingTrack(evt)
  } else {
    dropping(evt)
  }
}
</script>
