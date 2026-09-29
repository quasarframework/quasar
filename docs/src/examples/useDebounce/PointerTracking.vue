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

    <div class="q-mt-md row justify-end">
      <q-badge color="grey-7" :label="`events: ${events}`" />
    </div>

    <q-markup-table flat bordered dense class="q-mt-sm">
      <thead>
        <tr>
          <th class="text-left">options</th>
          <th class="text-right">runs</th>
          <th class="text-right">position</th>
          <th class="text-left" style="width: 75px">state</th>
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
          <td>
            <q-badge
              v-if="tracker.track.isPending"
              color="orange"
              label="waiting"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useDebounce } from 'quasar'

const events = ref(0)

function createTracker(label, description, options) {
  const tracker = reactive({ label, description, runs: 0, position: '-' })

  tracker.track = useDebounce(
    evt => {
      const point = evt.touches?.[0] ?? evt
      tracker.runs++
      tracker.position = `${Math.round(point.clientX)}, ${Math.round(point.clientY)}`
    },
    250,
    options
  )

  return tracker
}

const trackers = [
  createTracker(
    '(default: { leading: false, trailing: true })',
    'Runs once the pointer stops for 250ms, with where it stopped.'
  ),
  createTracker(
    'true ({ leading: true, trailing: false })',
    'Runs where the movement started; the moves that follow within 250ms are swallowed.',
    true
  ),
  createTracker(
    '{ leading: true }',
    'Runs where the movement started and again where it stopped.',
    { leading: true }
  ),
  createTracker(
    '{ maxWait: 1000 }',
    'Runs once the pointer stops for 250ms, but at least once a second while it keeps moving.',
    { maxWait: 1000 }
  )
]

function onMove(evt) {
  events.value++
  for (const tracker of trackers) {
    tracker.track(evt)
  }
}
</script>
