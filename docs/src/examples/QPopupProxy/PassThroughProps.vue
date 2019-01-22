<template>
  <div class="q-pa-md">
    <div class="q-pa-sm q-mb-md text-center text-subtitle2 shadow-1">
      Pass Through Prop: transition-show
      <q-popup-proxy transition-show="slide-down">
        <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />
            You have lost connection to the internet. This app is offline.
          </q-banner>
      </q-popup-proxy>
    </div>
    <div class="q-pa-sm q-mb-md text-center text-subtitle2 shadow-1">
      Pass Through Prop: offset
      <q-popup-proxy :offset="[10, 30]">
        <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />
            You have lost connection to the internet. This app is offline.
          </q-banner>
      </q-popup-proxy>
    </div>
  </div>
</template>
