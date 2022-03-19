<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 400px">
      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
      >
        <q-tab class="text-purple" name="mails" icon="mail" label="Mails" />
        <q-tab class="text-orange" name="alarms" icon="alarm" label="Alarms" />
        <q-tab class="text-teal" name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        class="bg-grey-1"
        dense
        align="justify"
      >
        <q-tab class="text-orange" name="mails" icon="mail" label="Mails" />
        <q-tab class="text-cyan" name="alarms" icon="alarm" label="Alarms" />
        <q-tab class="text-red" name="movies" icon="movie" label="Movies" />
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
