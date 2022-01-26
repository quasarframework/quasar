<template>
  <div class="q-pa-lg" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        padding="xs"
      >
        <q-fab-action padding="5px" external-label label-position="top" color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action padding="5px" external-label label-position="top" color="orange" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>

    <div class="q-mt-lg">
      <q-fab
        v-model="fab2"
        label="Actions"
        vertical-actions-align="left"
        color="purple"
        padding="none xl"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action padding="3px" external-label color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action padding="3px" external-label color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action padding="3px" external-label color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action padding="3px" external-label color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      fab1: ref(false),
      fab2: ref(false),

      onClick () {
        // console.log('Clicked on a fab action')
      }
    }
  }
}
</script>
