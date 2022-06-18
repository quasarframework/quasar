<template>
  <div class="q-pa-md" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        color="primary"
        glossy
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action square external-label label-position="top" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action square external-label label-position="top" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action square external-label label-position="top" color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action square external-label label-position="top" color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>

    <div class="q-mt-md row justify-center">
      <q-fab
        v-model="fab2"
        square
        vertical-actions-align="right"
        color="secondary"
        glossy
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action square color="primary" @click="onClick" icon="mail" label="Email" label-position="left" />
        <q-fab-action square color="secondary" @click="onClick" icon="alarm" label="Alarm" label-position="left" />
        <q-fab-action glossy square color="orange" @click="onClick" icon="airplay" label="Airplay" label-position="left" />
        <q-fab-action square color="accent" @click="onClick" icon="room" label="Map" label-position="left" />
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

      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
