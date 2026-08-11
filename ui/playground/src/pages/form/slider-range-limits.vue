<template>
  <div class="q-layout-padding">
    <div class="q-pa-xl q-ma-xl">
      <div class="row items-center q-gutter-x-lg">
        <q-badge color="secondary">
          ModelS: {{ modelS }} ({{ innerMin }} to {{ innerMax }}) / ({{
            min
          }}
          to {{ max }})
        </q-badge>

        <q-badge color="secondary">
          ModelR: {{ modelR }} ({{ innerMin }} to {{ innerMax }}) / ({{
            min
          }}
          to {{ max }})
        </q-badge>
      </div>

      <q-slider
        v-model="modelS"
        :min="min"
        :max="max"
        :inner-min="innerMin"
        :inner-max="innerMax"
        markers
        label
      />

      <q-slider
        v-model="modelS"
        :min="min"
        :max="max"
        :inner-min="innerMin"
        :inner-max="innerMax"
        markers
        label
        reverse
      />

      <q-range
        v-model="modelR"
        :min="min"
        :max="max"
        :inner-min="innerMin"
        :inner-max="innerMax"
        markers
        label
        drag-range
      />

      <q-range
        v-model="modelR"
        :min="min"
        :max="max"
        :inner-min="innerMin"
        :inner-max="innerMax"
        markers
        label
        reverse
        drag-range
      />

      <div class="q-ma-md row items-center q-gutter-x-lg">
        <q-slider
          style="height: 600px; max-height: 80vh"
          v-model="modelS"
          :min="min"
          :max="max"
          :inner-min="innerMin"
          :inner-max="innerMax"
          markers
          label
          vertical
        />

        <q-slider
          style="height: 600px; max-height: 80vh"
          v-model="modelS"
          :min="min"
          :max="max"
          :inner-min="innerMin"
          :inner-max="innerMax"
          markers
          label
          vertical
          reverse
        />

        <q-range
          style="height: 600px; max-height: 80vh"
          v-model="modelR"
          :min="min"
          :max="max"
          :inner-min="innerMin"
          :inner-max="innerMax"
          markers
          label
          vertical
          drag-range
        />

        <q-range
          style="height: 600px; max-height: 80vh"
          v-model="modelR"
          :min="min"
          :max="max"
          :inner-min="innerMin"
          :inner-max="innerMax"
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

<script setup>
import { ref } from 'vue'

const modelS = ref(1)
const modelR = ref({ min: -22, max: 1 })

const innerMin = ref(3)
const innerMax = ref(18)
const min = ref(0)
const max = ref(20)
</script>
