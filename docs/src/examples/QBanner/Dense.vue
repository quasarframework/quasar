<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner dense>
      <q-icon slot="avatar" name="fas fa-user" color="green-7" />

      Your password was changed on your other device. Please sign in again

      <q-btn slot="action" flat color="green-7" label="Continue as Guest" />
      <q-btn slot="action" flat color="green-7" label="Sign In" />
    </q-banner>

    <q-banner dense class="bg-primary text-white">
      <q-avatar slot="avatar" icon="signal_wifi_off" color="white" text-color="primary" />

      You have lost connection to the internet. This app is offline.

      <q-btn slot="action" flat color="white" label="Turn ON Wifi" />
    </q-banner>
  </div>
</template>
