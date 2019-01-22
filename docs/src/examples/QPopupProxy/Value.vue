<template>
  <div class="q-pa-md">
    <div style="width: 150px" class="q-pa-sm text-center text-subtitle2 shadow-1">
      Handles Click
      <q-popup-proxy :value="true">
        <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />
            You have lost connection to the internet. This app is offline.
          </q-banner>
      </q-popup-proxy>
    </div>
  </div>
</template>
