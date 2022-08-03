<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="q-gutter-sm">
      <q-chip>
        <q-avatar color="red" text-color="white">50</q-avatar>
        Emails
      </q-chip>
      <q-chip>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        John
      </q-chip>
    </div>

    <div class="q-gutter-x-sm">
      <q-btn round>
        <q-avatar size="28px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
      <q-btn round>
        <q-avatar size="32px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
      <q-btn round>
        <q-avatar size="40px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
    </div>

    <q-item clickable v-ripple>
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
          <q-badge floating color="teal">new</q-badge>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Mary</q-item-label>
        <q-item-label caption>2 new messages</q-item-label>
      </q-item-section>
      <q-item-section side>
        3 min ago
      </q-item-section>
    </q-item>

    <q-banner rounded class="bg-primary text-white">
      <template v-slot:avatar>
        <q-avatar icon="signal_wifi_off" color="white" text-color="primary" />
      </template>

      You have lost connection to the internet. This app is offline.

      <template v-slot:action>
        <q-btn flat color="white" label="Turn ON Wifi" />
      </template>
    </q-banner>
  </div>
</template>
