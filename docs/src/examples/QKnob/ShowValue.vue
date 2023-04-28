<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      show-value
      class="text-light-blue q-ma-md"
      v-model="value"
      size="50px"
      color="light-blue"
    />

    <q-knob
      show-value
      class="text-white q-ma-md"
      v-model="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
    >
      <q-icon name="volume_up" />
    </q-knob>

    <q-knob
      show-value
      font-size="12px"
      v-model="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    >
      {{ value }}%
    </q-knob>

    <q-knob
      show-value
      font-size="16px"
      class="text-red q-ma-md"
      v-model="value"
      size="60px"
      :thickness="0.05"
      color="red"
      track-color="grey-3"
    >
      <q-icon name="volume_up" class="q-mr-xs" />
      {{ value }}
    </q-knob>

    <q-knob
      show-value
      font-size="10px"
      class="q-ma-md"
      v-model="value"
      size="80px"
      :thickness="0.25"
      color="primary"
      track-color="grey-3"
    >
      <q-avatar size="60px">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
      </q-avatar>
    </q-knob>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(81)
    }
  }
}
</script>
