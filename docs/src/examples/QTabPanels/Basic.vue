<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 350px">
      <q-option-group
        v-model="panel"
        inline
        :options="[
          { label: 'Mails', value: 'mails' },
          { label: 'Alarms', value: 'alarms' },
          { label: 'Movies', value: 'movies' }
        ]"
      />

      <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="mails">
          <div class="text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      panel: ref('mails')
    }
  }
}
</script>
