<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-badge color="teal">
        Model: {{ time }}
      </q-badge>
    </div>

    <q-btn icon="access_time" round color="primary">
      <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
        <q-time v-model="proxyTime">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
            <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
          </div>
        </q-time>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const time = ref('10:56')
    const proxyTime = ref('10:56')

    return {
      time,
      proxyTime,

      updateProxy () {
        proxyTime.value = time.value
      },

      save () {
        time.value = proxyTime.value
      }
    }
  }
}
</script>
