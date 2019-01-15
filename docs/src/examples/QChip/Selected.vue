<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-chip :selected.sync="mail" clickable icon="alarm" color="primary" text-color="white">
        Alarm
      </q-chip>
      <q-chip :selected.sync="map" clickable icon-right="map" color="secondary" text-color="white">
        Map
      </q-chip>
      <q-chip :selected.sync="tenK" clickable color="orange" text-color="white">
        10k
      </q-chip>
      <q-chip :selected.sync="fiveK" clickable color="red" text-color="white">
        5k
      </q-chip>
    </div>

    <div class="q-px-sm">
      Mail: <strong>{{ JSON.stringify(mail) }}</strong><br>
      Map: <strong>{{ JSON.stringify(map) }}</strong><br>
      10k: <strong>{{ JSON.stringify(tenK) }}</strong><br>
      5k: <strong>{{ JSON.stringify(fiveK) }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mail: false,
      map: false,
      tenK: false,
      fiveK: false
    }
  }
}
</script>
