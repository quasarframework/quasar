<template>
  <div class="q-layout-padding" style="min-height: 100vh">
    <div style="max-width: 500px">
      <q-toggle v-model="dense" label="Dense banners" />

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-icon name="signal_wifi_off" color="primary" />
        </template>

        <q-input v-model="text" />
        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
          <q-btn flat color="primary" label="Dismiss" />
        </template>
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-icon name="signal_wifi_off" color="primary" text-color="white" />
        </template>

        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
          <q-btn flat color="primary" label="Dismiss" />
        </template>
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        </template>

        You have lost connection to the internet. This app is offline.
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        </template>

        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
        </template>
      </q-banner>

      <q-banner rounded :dense="dense" class="bg-primary text-white q-my-md">
        <template v-slot:avatar>
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        </template>

        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
        </template>
      </q-banner>

      <q-banner inline-actions :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        </template>

        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
        </template>
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </template>

        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
          <q-btn flat color="primary" label="Dismiss" />
        </template>
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        <template v-slot:avatar>
          <img src="https://cdn.quasar.dev/img/mountains.jpg" style="width: 100px; height: 64px">
        </template>

        You have lost connection to the internet. This app is offline.
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        You have lost connection to the internet. This app is offline.
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
        </template>
      </q-banner>

      <q-banner :dense="dense" class="q-my-md">
        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
          <q-btn flat color="primary" label="Dismiss" />
        </template>
      </q-banner>

      <q-banner inline-actions :dense="dense" class="text-white bg-red q-my-md">
        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
        </template>
      </q-banner>

      <q-banner inline-actions :dense="dense" class="q-my-md">
        You have lost connection to the internet. This app is offline.
        You have lost connection to the internet. This app is offline.

        <template v-slot:action>
          <q-btn flat color="primary" label="Turn ON Wifi" />
          <q-btn flat color="primary" label="Dismiss" />
        </template>
      </q-banner>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      dense: false
    }
  }
}
</script>
