<template>
  <div class="q-pa-md">
    <q-btn label="Open Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">First dialog</div>
        </q-card-section>
        <q-card-section class="row items-center q-gutter-sm">
          <q-btn label="Open dialog" color="primary" @click="dialog2 = true" />
          <q-btn v-close-popup label="Close" color="primary" />

          <q-dialog v-model="dialog2">
            <q-card>
              <q-card-section>
                <div class="text-h6">Second dialog</div>
              </q-card-section>
              <q-card-section class="row items-center q-gutter-sm">
                <q-btn v-close-popup="2" label="Close both dialogs" color="accent" />
                <q-btn v-close-popup label="Close this dialog" color="accent" />
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      dialog: ref(false),
      dialog2: ref(false)
    }
  }
}
</script>
