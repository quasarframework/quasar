<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-chip clickable @click="onClicked('Alarm')" icon="alarm" color="primary" text-color="white">
        Alarm
      </q-chip>
      <q-chip clickable @click="onClicked('Map')" icon-right="map" color="secondary" text-color="white">
        Map
      </q-chip>
      <q-chip clickable @click="onClicked('10k')" color="orange" text-color="white">
        10k
      </q-chip>
      <q-chip clickable @click="onClicked('5k')" color="red" text-color="white">
        5k
      </q-chip>
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ JSON.stringify(value) }}</strong>
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
    onClicked (data) {
      this.value = data
    }
  }
}
</script>
