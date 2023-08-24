<template>
  <div class="q-pa-md" style="padding-bottom: 220px">
    <q-toggle v-model="hideLabels" label="Hide labels" />

    <div style="padding-top: 48px;">
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        :hide-label="hideLabels"
      >
        <q-fab-action :hide-label="hideLabels" external-label label-position="top" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action :hide-label="hideLabels" external-label label-position="top" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action :hide-label="hideLabels" external-label label-position="top" color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action :hide-label="hideLabels" external-label label-position="top" color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        external-label
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
        :hide-label="hideLabels"
      >
        <q-fab-action :hide-label="hideLabels" external-label color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action :hide-label="hideLabels" external-label color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action :hide-label="hideLabels" external-label color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action :hide-label="hideLabels" external-label color="accent" @click="onClick" icon="room" label="Map" />
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
