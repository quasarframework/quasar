<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner inline-actions rounded class="bg-orange text-white">
      You have lost connection to the internet. This app is offline.

      <template v-slot:action>
        <q-btn flat label="Turn ON Wifi" />
        <q-btn flat label="Dismiss" />
      </template>
    </q-banner>
  </div>
</template>
