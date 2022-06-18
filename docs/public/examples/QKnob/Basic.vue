<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      v-model="value"
      size="50px"
      color="orange"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="90px"
      :thickness="0.2"
      color="purple-3"
      center-color="purple"
      track-color="purple-1"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="45px"
      :thickness="1"
      color="grey-8"
      track-color="light-blue"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="50px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="75px"
      :thickness="0.6"
      color="orange"
      center-color="orange-10"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="40px"
      :thickness="0.4"
      color="orange"
      track-color="orange-3"
      class="q-ma-md"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(71)
    }
  }
}
</script>
