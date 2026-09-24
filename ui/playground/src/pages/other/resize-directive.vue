<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">v-resize</div>
        <q-slider v-model="boxWidth" :min="100" :max="400" label />
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="Random height" @click="randomHeight" />
          <q-toggle
            v-model="enabled"
            label="enabled (false disables in place)"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          v-resize="enabled ? onResize : false"
          class="box bg-amber rounded-borders"
          :style="boxStyle"
        />
        <div class="q-mt-md q-gutter-sm">
          <q-badge v-if="size" :label="`${size.width} x ${size.height}`" />
          <q-badge color="secondary" :label="`calls: ${calls}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">v-resize:[debounce] (dynamic arg)</div>
        <q-slider v-model="debounce" :min="0" :max="1000" :step="100" label />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          v-resize:[debounce]="onDebouncedResize"
          class="box bg-teal text-white rounded-borders q-pa-sm"
          :style="boxStyle"
        >
          debounce: {{ debounce }}ms
        </div>
        <div class="q-mt-md q-gutter-sm">
          <q-badge
            v-if="debouncedSize"
            :label="`${debouncedSize.width} x ${debouncedSize.height}`"
          />
          <q-badge color="secondary" :label="`calls: ${debouncedCalls}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">v-resize.once and returning false</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-md">
        <div
          v-resize.once="onOnce"
          class="box bg-purple text-white rounded-borders q-pa-sm"
          :style="boxStyle"
        >
          once: {{ onceCalls }} call(s)
        </div>
        <div
          v-resize="onReturnFalse"
          class="box bg-orange text-white rounded-borders q-pa-sm"
          :style="boxStyle"
        >
          returned false: {{ falseCalls }} call(s)
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const boxWidth = ref(200)
const boxHeight = ref(100)
const enabled = ref(true)
const debounce = ref(300)

const size = ref(null)
const calls = ref(0)
const debouncedSize = ref(null)
const debouncedCalls = ref(0)
const onceCalls = ref(0)
const falseCalls = ref(0)

const boxStyle = computed(() => ({
  width: boxWidth.value + 'px',
  height: boxHeight.value + 'px'
}))

function onResize(s) {
  size.value = s
  calls.value++
}

function onDebouncedResize(s) {
  debouncedSize.value = s
  debouncedCalls.value++
}

function onOnce() {
  onceCalls.value++
}

function onReturnFalse() {
  falseCalls.value++
  return false
}

function randomHeight() {
  boxHeight.value = Math.floor(80 + Math.random() * 200)
}
</script>

<style lang="sass" scoped>
.box
  transition: height .3s
</style>
