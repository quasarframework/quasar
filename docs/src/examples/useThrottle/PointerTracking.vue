<template>
  <div class="q-pa-md">
    <div
      class="bg-grey-3 rounded-borders flex flex-center text-grey-8"
      style="height: 160px; user-select: none"
      @mousemove="onMove"
      @touchmove.prevent="onMove"
    >
      Move the pointer here
    </div>

    <div class="q-mt-md">
      <q-badge color="grey-7" :label="`events: ${events}`" />
    </div>

    <q-markup-table flat bordered dense class="q-mt-sm">
      <thead>
        <tr>
          <th class="text-left">trailing</th>
          <th class="text-right">runs</th>
          <th class="text-right">position</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tracker in trackers" :key="tracker.label">
          <td>
            <code>{{ tracker.label }}</code>
            <div class="text-caption text-grey-7">{{
              tracker.description
            }}</div>
          </td>
          <td class="text-right">{{ tracker.runs }}</td>
          <td class="text-right">{{ tracker.position }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useThrottle } from 'quasar'

const events = ref(0)

function createTracker(label, description, trailing) {
  const tracker = reactive({ label, description, runs: 0, position: '-' })

  tracker.track = useThrottle(
    evt => {
      const point = evt.touches?.[0] ?? evt
      tracker.runs++
      tracker.position = `${Math.round(point.clientX)}, ${Math.round(point.clientY)}`
    },
    250,
    trailing
  )

  return tracker
}

const trackers = [
  createTracker(
    'false (default)',
    'Runs at most once every 250ms; a movement ends with an earlier position.'
  ),
  createTracker(
    'true',
    'Runs at most once every 250ms; the last position of a movement always gets through.',
    true
  )
]

function onMove(evt) {
  events.value++
  for (const tracker of trackers) {
    tracker.track(evt)
  }
}
</script>
