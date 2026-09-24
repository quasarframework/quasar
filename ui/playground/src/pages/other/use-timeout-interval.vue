<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">useTimeout - isTimeoutPending</div>
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="register 2s" @click="startTimeout" />
          <q-btn flat label="removeTimeout()" @click="removeTimeout" />
          <q-badge
            :color="isTimeoutPending ? 'positive' : 'grey'"
            :label="isTimeoutPending ? 'pending' : 'idle'"
          />
          <q-badge color="secondary" :label="`fired: ${timeoutFired}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">useInterval - isIntervalActive</div>
        <div class="row q-gutter-sm items-center">
          <q-btn
            color="primary"
            label="register 500ms"
            @click="startInterval"
          />
          <q-btn flat label="removeInterval()" @click="removeInterval" />
          <q-badge
            :color="isIntervalActive ? 'positive' : 'grey'"
            :label="isIntervalActive ? 'active' : 'idle'"
          />
          <q-badge color="secondary" :label="`ticks: ${ticks}`" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInterval, useTimeout } from 'quasar'

const timeoutFired = ref(0)
const ticks = ref(0)

const { registerTimeout, removeTimeout, isTimeoutPending } = useTimeout()
const { registerInterval, removeInterval, isIntervalActive } = useInterval()

function startTimeout() {
  registerTimeout(() => {
    timeoutFired.value++
  }, 2000)
}

function startInterval() {
  registerInterval(() => {
    ticks.value++
  }, 500)
}
</script>
