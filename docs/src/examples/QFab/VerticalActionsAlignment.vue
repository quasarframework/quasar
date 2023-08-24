<template>
  <div class="q-pa-md" style="padding-top: 220px">
    <div class="row justify-between">
      <q-fab
        v-model="fabLeft"
        vertical-actions-align="left"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action label-position="right" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action label-position="right" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action label-position="right" color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action label-position="right" color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>

      <q-fab
        v-model="fabCenter"
        vertical-actions-align="center"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>

      <q-fab
        v-model="fabRight"
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action label-position="left" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action label-position="left" color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action label-position="left" color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action label-position="left" color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      fabLeft: ref(true),
      fabCenter: ref(true),
      fabRight: ref(true),

      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
