<template>
  <div class="q-pa-md" style="padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="left"
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" label="Alarm" />
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
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
