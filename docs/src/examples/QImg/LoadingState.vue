<template>
  <div class="q-pa-md">
    <q-btn push color="teal" label="Change image" @click="refresh" class="q-mb-md" />

    <div class="q-gutter-sm row items-start">
      <q-img
        :src="url"
        spinner-color="red"
        style="height: 140px; max-width: 150px"
      />

      <q-img
        :src="url"
        spinner-color="primary"
        spinner-size="82px"
        style="height: 140px; max-width: 150px"
      />

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <template v-slot:loading>
          <div class="text-subtitle1 text-white">
            Loading...
          </div>
        </template>
      </q-img>

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <template v-slot:loading>
          <q-spinner-gears color="white" />
        </template>
      </q-img>

      <q-img
        :src="url"
        style="height: 140px; max-width: 150px"
      >
        <template v-slot:loading>
          <div class="text-yellow">
            <q-spinner-ios />
            <div class="q-mt-md">Loading...</div>
          </div>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const url = ref('https://placeimg.com/500/300/nature')

    return {
      url,
      refresh () {
        url.value = 'https://placeimg.com/500/300/nature?t=' + Math.random()
      }
    }
  }
}
</script>
