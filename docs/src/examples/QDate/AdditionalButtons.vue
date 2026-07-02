<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-badge color="teal"> Model: {{ date }} </q-badge>
    </div>

    <q-btn icon="event" round color="primary">
      <q-popup-proxy
        @before-show="updateProxy"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date v-model="proxyDate">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
            <q-btn
              label="OK"
              color="primary"
              flat
              @click="save"
              v-close-popup
            />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/03/01')
const proxyDate = ref('2019/03/01')

function updateProxy() {
  proxyDate.value = date.value
}

function save() {
  date.value = proxyDate.value
}
</script>
