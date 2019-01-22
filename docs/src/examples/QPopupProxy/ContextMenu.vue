<template>
  <div class="q-pa-md">
    <q-btn push color="purple" label="Handles right-click">
      <q-popup-proxy context-menu>
        <q-banner>
          <q-icon slot="avatar" name="signal_wifi_off" color="primary" />
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>
