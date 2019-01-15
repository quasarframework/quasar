<template>
  <div class="q-pa-md gutter-md">
    <div class="row justify-around">
    <q-input class="q-ma-sm" label="Progress" type="number" v-model="progress"></q-input>
    <q-input class="q-ma-sm" label="Buffer" type="number" v-model="buffer"></q-input>
    </div>
    <div class="q-gutter-md q-pa-md">
      Standard:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" class="q-mb-lg" />
      Secondary:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" class="q-mb-lg" color="secondary" />
      Deep Orange, Track Color Blue:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" class="q-mb-lg" color="deep-orange" track-color="blue" />
      Purple 5, Track Color Red:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" class="q-mb-lg" color="purple-5" track-color="red" />
      Rounded:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" rounded class="q-mb-lg" />
      Reverse:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" reverse class="q-mb-lg" />
      Stripe:
      <q-linear-progress :value="progressNum" :buffer="bufferNum" stripe class="q-mb-lg" />
      <q-card class="bg-grey-10 text-white q-pa-sm">
        Dark:
        <q-linear-progress :value="progressNum" :buffer="bufferNum" class="q-mb-lg" dark />
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0.4,
      buffer: 0.8
    }
  },
  computed: {
    progressNum () {
      return parseFloat(this.progress)
    },
    bufferNum () {
      return parseFloat(this.buffer)
    }
  }
}
</script>
