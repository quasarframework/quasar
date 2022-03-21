<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        v-model="tab"
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails">
          <q-badge color="red" floating>2</q-badge>
        </q-tab>
        <q-tab name="alarms" icon="alarm" label="Alarms">
          <q-badge color="red" floating>10+</q-badge>
        </q-tab>
        <q-tab alert name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        class="bg-purple text-white shadow-2"
      >
        <q-tab alert="yellow" alert-icon="warning" name="mails" label="Mails" />
        <q-tab alert alert-icon="event" label="Alarms" name="alarms" />
        <q-tab alert="orange" alert-icon="announcement" name="movies" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        class="bg-yellow"
      >
        <q-tab name="mails" icon="mail" label="Mails">
          <q-badge color="primary" text-color="white" floating>2</q-badge>
        </q-tab>
        <q-tab name="alarms" icon="alarm" label="Alarms">
          <q-badge color="purple" text-color="white" floating>10+</q-badge>
        </q-tab>
        <q-tab alert name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        class="bg-grey-3"
      >
        <q-tab alert="red" name="mails" icon="mail" label="Mails" />
        <q-tab alert="purple" name="alarms" icon="alarm" label="Alarms" />
        <q-tab alert="orange" name="movies" icon="movie" label="Movies" />
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
