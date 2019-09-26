<template>
  <div class="q-layout-padding">
    <div tabindex="0" style="height: 20vh">
      Focus placeholder
    </div>
    <q-field label="Field 1 (using popup proxy)">
      <template v-slot:control>
        <div class="self-center full-width no-outline" tabindex="0" />
      </template>
      <q-popup-proxy>
        <q-card>
          <q-card-section>
            Hi from q-popup-proxy
          </q-card-section>
          <q-card-actions>
            <q-btn v-close-popup autofocus>
              Close
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-popup-proxy>
    </q-field>
    <div tabindex="0" style="height: 20vh">
      Focus placeholder
    </div>
    <div>
      <q-btn @click="show = true">
        Open dialog
      </q-btn>

      <q-btn>
        Just click
      </q-btn>
    </div>
    <div tabindex="0" style="height: 20vh">
      Focus placeholder
    </div>

    <q-dialog v-model="show">
      <q-card>
        <q-card-section>
          Hi from q-dialog
        </q-card-section>
        <q-card-actions>
          <q-btn @click="show = false" autofocus>
            Close
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  }
}
</script>
