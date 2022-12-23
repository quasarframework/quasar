<template>
  <div class="q-pa-md q-gutter-md" style="font-size: 36px">
    <q-icon name="settings_remote" class="text-brown cursor-pointer">
      <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
        <q-banner class="bg-brown text-white">
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-icon>

    <q-icon name="perm_data_setting" class="text-purple cursor-pointer">
      <q-popup-proxy :offset="[10, 10]">
        <q-banner class="bg-purple text-white">
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-icon>
  </div>
</template>
