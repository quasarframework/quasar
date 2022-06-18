<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn :loading="loading[0]" color="secondary" @click="simulateProgress(0)" label="Button" />
    <q-btn :loading="loading[1]" color="red" @click="simulateProgress(1)">
      Button
      <template v-slot:loading>
        Loading...
      </template>
    </q-btn>
    <q-btn :loading="loading[2]" color="purple" @click="simulateProgress(2)">
      Button
      <template v-slot:loading>
        <q-spinner-radio />
      </template>
    </q-btn>
    <q-btn :loading="loading[3]" color="primary" @click="simulateProgress(3)" style="width: 150px">
      Button
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <br>
    <q-btn round :loading="loading[4]" color="brown" @click="simulateProgress(4)" icon="camera_front">
      <template v-slot:loading>
        <q-spinner-facebook />
      </template>
    </q-btn>
    <q-btn round :loading="loading[5]" color="black" @click="simulateProgress(5)" icon="camera_rear">
      <template v-slot:loading>
        <q-spinner-gears />
      </template>
    </q-btn>
    <br>

    <q-btn :loading="progress" color="primary" @click="progress = true">
      Controlled from outside
      <template v-slot:loading>
        <q-spinner-radio class="on-left" />
        Click "Stop" Button
      </template>
    </q-btn>
    <q-btn :disable="!progress" color="negative" @click="progress = false" label="Stop" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const loading = ref([
      false,
      false,
      false,
      false,
      false,
      false
    ])

    const progress = ref(false)

    function simulateProgress (number) {
      // we set loading state
      loading.value[ number ] = true

      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        loading.value[ number ] = false
      }, 3000)
    }

    return {
      loading,
      progress,
      simulateProgress
    }
  }
}
</script>
