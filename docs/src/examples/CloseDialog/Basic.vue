<template>
  <div class="q-pa-md">
    <q-btn label="Open Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <!-- Notice v-close-dialog -->
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-dialog />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-dialog />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
