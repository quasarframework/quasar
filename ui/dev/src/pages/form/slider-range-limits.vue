<template>
  <div class="q-layout-padding">
    <div class="q-pa-xl q-ma-xl">
      <div class="row items-center q-gutter-x-lg">
        <q-badge color="secondary">
          ModelS: {{ modelS }} ({{ minValue }} to {{ maxValue }}) / ({{ minTrack }} to {{ maxTrack }})
        </q-badge>

        <q-badge color="secondary">
          ModelR: {{ modelR }} ({{ minValue }} to {{ maxValue }}) / ({{ minTrack }} to {{ maxTrack }})
        </q-badge>
      </div>

      <q-slider
        v-model="modelS"
        :min="minTrack"
        :max="maxTrack"
        :min-value="minValue"
        :max-value="maxValue"
        markers
        label
      />

      <q-slider
        v-model="modelS"
        :min="minTrack"
        :max="maxTrack"
        :min-value="minValue"
        :max-value="maxValue"
        markers
        label
        reverse
      />

      <q-range
        v-model="modelR"
        :min="minTrack"
        :max="maxTrack"
        :min-value="minValue"
        :max-value="maxValue"
        markers
        label
        drag-range
      />

      <q-range
        v-model="modelR"
        :min="minTrack"
        :max="maxTrack"
        :min-value="minValue"
        :max-value="maxValue"
        markers
        label
        reverse
        drag-range
      />

      <div class="q-ma-md row items-center q-gutter-x-lg">
        <q-slider
          style="height: 600px; max-height: 80vh"
          v-model="modelS"
          :min="minTrack"
          :max="maxTrack"
          :min-value="minValue"
          :max-value="maxValue"
          markers
          label
          vertical
        />

        <q-slider
          style="height: 600px; max-height: 80vh"
          v-model="modelS"
          :min="minTrack"
          :max="maxTrack"
          :min-value="minValue"
          :max-value="maxValue"
          markers
          label
          vertical
          reverse
        />

        <q-range
          style="height: 600px; max-height: 80vh"
          v-model="modelR"
          :min="minTrack"
          :max="maxTrack"
          :min-value="minValue"
          :max-value="maxValue"
          markers
          label
          vertical
          drag-range
        />

        <q-range
          style="height: 600px; max-height: 80vh"
          v-model="modelR"
          :min="minTrack"
          :max="maxTrack"
          :min-value="minValue"
          :max-value="maxValue"
          markers
          label
          vertical
          reverse
          drag-range
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelS: 1,
      modelR: { min: -22, max: 1 },

      minValue: 3,
      maxValue: 18,
      minTrack: 0,
      maxTrack: 20
    }
  }
}
</script>
