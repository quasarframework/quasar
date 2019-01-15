<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-chip removable @remove="onRemove('Alarm')" square icon="alarm" color="primary" text-color="white">
        Alarm
      </q-chip>
      <q-chip removable @remove="onRemove('Map')" square icon-right="map" color="secondary" text-color="white">
        Map
      </q-chip>
      <q-chip removable @remove="onRemove('10k')" square color="warning" text-color="white">
        10k
      </q-chip>
      <q-chip removable @remove="onRemove('5k')" outline square color="info" text-color="white">
        5k
      </q-chip>
    </div>

    <div class="q-px-sm">
      Received signal to remove: <strong>{{ JSON.stringify(value) }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onRemove (data) {
      this.value = data
    }
  }
}
</script>
