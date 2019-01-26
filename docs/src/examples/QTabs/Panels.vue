<template>
  <div class="q-pa-sm">
    <div class="shadow-2">
      <q-tabs class="bg-secondary text-white" v-model="tab" align="justify">
        <q-tab name="mails" icon="mail" label="Mails"/>
        <q-tab name="alarms" icon="alarm" label="Alarms"/>
        <q-tab name="movies" icon="movie" label="Movies"/>
      </q-tabs>
      <q-tab-panels v-model="tab" animated swipeable>
        <q-tab-panel name="mails">Emails tab</q-tab-panel>
        <q-tab-panel name="alarms">Alarms tab</q-tab-panel>
        <q-tab-panel name="movies">Movies tab</q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'mails'
    }
  }
}
</script>
