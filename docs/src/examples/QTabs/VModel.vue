<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-option-group
      inline
      v-model="tab"
      :options="[
          {label: 'None', value: '', color: 'secondary'},
          {label: 'Mails', value: 'mails'},
          {label: 'Alarms', value: 'alarms'},
          {label: 'Movies', value: 'movies'}
        ]"
    />
    <br>
    <q-tabs v-model="tab" align="justify" class="shadow-2 bg-light-green">
      <q-tab name="mails" icon="mail" label="Mails"/>
      <q-tab name="alarms" icon="alarm" label="Alarms"/>
      <q-tab name="movies" icon="movie" label="Movies"/>
    </q-tabs>

    <q-tabs v-model="tab" align="justify" class="shadow-2 bg-purple text-white">
      <q-tab name="alarms" icon="alarm" label="Alarms"/>
      <q-tab name="movies" icon="movie" label="Movies"/>
      <q-tab name="mails" icon="mail" label="Mails"/>
    </q-tabs>
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
