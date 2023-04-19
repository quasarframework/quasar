<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="90"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="180"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="270"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="52"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
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
      value: ref(61)
    }
  }
}
</script>
