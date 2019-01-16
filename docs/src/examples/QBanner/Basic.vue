<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner>
      <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

      You have lost connection to the internet. This app is offline.

      <q-btn slot="action" flat color="primary" label="Turn on Wifi" />
    </q-banner>

    <q-banner class="bg-primary text-white">

      Unfortunately, the credit card did not go through, please try again.

      <q-btn slot="action" flat color="white" label="Dismiss" />
      <q-btn slot="action" flat color="white" label="Update Credit Card" />
    </q-banner>
  </div>
</template>
