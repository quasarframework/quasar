<template>
  <div class="q-pa-md">
    <q-btn push color="primary" label="Handles click">
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" color="primary" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>
