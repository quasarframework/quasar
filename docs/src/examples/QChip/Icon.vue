<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-chip icon="alarm">
        Alarm
      </q-chip>
      <q-chip icon-right="map" color="orange" text-color="white">
        Map
      </q-chip>
      <q-chip icon="mail" color="red" text-color="white">
        10k
      </q-chip>
    </div>
    <div class="q-gutter-sm">
      <q-chip icon="alarm" icon-right="alarm">
        Alarm
      </q-chip>
      <q-chip icon="map" icon-right="map" color="orange" text-color="white">
        Map
      </q-chip>
      <q-chip icon="mail" icon-right="mail" color="red" text-color="white">
        10k
      </q-chip>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
