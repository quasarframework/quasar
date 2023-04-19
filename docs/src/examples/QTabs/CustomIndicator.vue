<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        v-model="tab"
        indicator-color="purple"
        class="text-teal"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
        <q-tab name="movies" icon="movie" />

      </q-tabs>

      <q-tabs
        v-model="tab"
        indicator-color="yellow"
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        narrow-indicator
        class="bg-purple text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        inline-label
        switch-indicator
        indicator-color="primary"
        class="bg-lime text-dark shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        indicator-color="transparent"
        active-color="white"
        class="bg-teal text-grey-5 shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      tab: ref('mails')
    }
  }
}
</script>
