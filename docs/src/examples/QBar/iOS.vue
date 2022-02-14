<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar dense class="bg-teal text-white">
      <q-icon :name="fasSignal" />
      <div>mobi-net</div>
      <div>4G</div>
      <q-icon :name="fasWifi" />
      <q-space />
      <q-icon name="near_me" />
      <div>100%</div>
      <q-icon :name="fasBatteryFull" />
    </q-bar>

    <q-bar dense class="bg-amber text-grey-8">
      <q-icon :name="fasSignal" />
      <div>mobi-net</div>
      <div>4G</div>
      <q-icon :name="fasWifi" />
      <q-space />
      <q-icon name="near_me" />
      <div>100%</div>
      <q-icon :name="fasBatteryFull" />
    </q-bar>
  </div>
</template>

<script>
import { fasSignal, fasWifi, fasBatteryFull } from '@quasar/extras/fontawesome-v5'

export default {
  setup () {
    return {
      fasSignal,
      fasWifi,
      fasBatteryFull
    }
  }
}
</script>
