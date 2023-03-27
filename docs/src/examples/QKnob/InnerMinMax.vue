<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :min="5"
      :max="10"
      :inner-min="6"
      v-model="value1"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="55"
      :max="90"
      :inner-min="70"
      :inner-max="85"
      v-model="value2"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="40"
      :max="110"
      :inner-min="50"
      :inner-max="100"
      v-model="value3"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="20"
      :max="70"
      :inner-min="30"
      :inner-max="60"
      v-model="value4"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :inner-max="75"
      v-model="value5"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value1: ref(7),
      value2: ref(70),
      value3: ref(80),
      value4: ref(35),
      value5: ref(70)
    }
  }
}
</script>
