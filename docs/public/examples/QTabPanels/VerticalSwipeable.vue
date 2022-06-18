<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-tab-panels
      v-model="panel"
      animated
      swipeable
      vertical
      infinite
      class="bg-purple text-white shadow-2 rounded-borders"
    >
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
