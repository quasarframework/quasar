<template>
  <div>
    <div class="row q-pa-md q-gutter-sm">
      <q-chip>
        <q-avatar class="q-pl-xs" size="24px" font-size="16px" color="positive" icon="wifi" />
        Online
      </q-chip>
    </div>
    <div class="row q-pa-md q-gutter-sm">
      <q-btn round>
        <q-avatar size="28px">
          <img src="statics/quasar-logo.png" />
        </q-avatar>
      </q-btn>
      <q-btn round>
        <q-avatar size="32px">
          <img src="statics/quasar-logo.png" />
        </q-avatar>
      </q-btn>
      <q-btn round>
        <q-avatar size="40px">
          <img src="statics/quasar-logo.png" />
        </q-avatar>
      </q-btn>
    </div>
    <div class="row q-pa-md q-gutter-sm">
      <q-item color="blue">
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar-framework.org/img/avatar.png" />
        </q-avatar>
        <q-badge floating>1.0</q-badge>
      </q-item>
    </div>
    <q-banner :dense="dense" class="bg-primary text-white q-my-md">
      <q-avatar slot="avatar" icon="signal_wifi_off" color="white" text-color="primary" />

      You have lost connection to the internet. This app is offline.

      <q-btn slot="action" flat color="white" label="Turn ON Wifi" />
    </q-banner>
  </div>
</template>
