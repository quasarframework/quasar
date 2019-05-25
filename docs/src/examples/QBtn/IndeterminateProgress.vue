<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn :loading="loading1" color="secondary" @click="simulateProgress(1)" label="Button" />
    <q-btn :loading="loading2" color="red" @click="simulateProgress(2)">
      Button
      <template v-slot:loading>
        Loading...
      </template>
    </q-btn>
    <q-btn :loading="loading3" color="purple" @click="simulateProgress(3)">
      Button
      <template v-slot:loading>
        <q-spinner-radio />
      </template>
    </q-btn>
    <q-btn :loading="loading4" color="primary" @click="simulateProgress(4)" style="width: 150px">
      Button
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Loading...
      </template>
    </q-btn>
    <br>
    <q-btn round :loading="loading5" color="brown" @click="simulateProgress(5)" icon="camera_front">
      <template v-slot:loading>
        <q-spinner-facebook />
      </template>
    </q-btn>
    <q-btn round :loading="loading6" color="black" @click="simulateProgress(6)" icon="camera_rear">
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
export default {
  data () {
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      progress: false
    }
  },

  methods: {
    simulateProgress (number) {
      // we set loading state
      this[`loading${number}`] = true
      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        this[`loading${number}`] = false
      }, 3000)
    }
  }
}
</script>
