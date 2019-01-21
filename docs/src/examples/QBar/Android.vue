<template>
  <div class="android q-pa-md full-width text-no-wrap">

      <q-bar dense class="bg-black text-white">
        <div>mobi-net</div>
        <q-icon name="email" />
        <q-space />
        <q-icon name="bluetooth" />
        <q-icon name="alarm" />
        <q-icon name="signal_wifi_4_bar" />
        <q-icon name="signal_cellular_4_bar" />
        <div>100%</div>
        <q-icon name="battery_full" />
        <div>10:00AM</div>
      </q-bar><br />

      <q-bar dense class="bg-green text-white">
        <div>mobi-net</div>
        <q-icon name="email" />
        <q-space />
        <q-icon name="bluetooth" />
        <q-icon name="alarm" />
        <q-icon name="signal_wifi_4_bar" />
        <q-icon name="signal_cellular_4_bar" />
        <div>100%</div>
        <q-icon name="battery_full" />
        <div>10:00AM</div>
      </q-bar><br />

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

<style scoped>
.android .q-bar{
  overflow: hidden;
  max-width: 400px;
}
</style>
