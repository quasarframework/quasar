<template>
  <div class="q-pa-md" style="padding-bottom: 240px">
    <q-toggle v-model="hideLabels" label="Hide labels" />

    <div class="q-mt-md">
      <q-fab
        v-model="fab1"
        label="Actions"
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        :hide-label="hideLabels"
      >
        <q-fab-action :hide-label="hideLabels" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action :hide-label="hideLabels" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
      </q-fab>
    </div>

    <div class="q-mt-md row justify-center">
      <q-fab
        v-model="fab2"
        label="Actions"
        label-position="bottom"
        glossy
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
        :hide-label="hideLabels"
      >
        <q-fab-action :hide-label="hideLabels" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action :hide-label="hideLabels" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action :hide-label="hideLabels" color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action :hide-label="hideLabels" color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      fab1: ref(true),
      fab2: ref(true),
      hideLabels: ref(false),

      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
