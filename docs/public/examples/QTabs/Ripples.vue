<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 400px">
      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-primary"
      >
        <q-tab :ripple="false" name="mails" icon="mail" label="Mails" />
        <q-tab :ripple="false" name="alarms" icon="alarm" label="Alarms" />
        <q-tab :ripple="false" name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-purple"
      >
        <q-tab :ripple="{ color: 'orange' }" name="mails" icon="mail" label="Mails" />
        <q-tab :ripple="{ color: 'orange' }" name="alarms" icon="alarm" label="Alarms" />
        <q-tab :ripple="{ color: 'orange' }" name="movies" icon="movie" label="Movies" />
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
