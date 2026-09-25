<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section class="row q-gutter-sm">
        <q-btn color="primary" label="pick image" @click="openFilePicker" />
        <q-btn color="secondary" label="generated blob" @click="generate" />
        <q-btn flat label="set null" @click="source = null" />
        <q-btn flat label="revokeObjectUrl()" @click="revokeObjectUrl" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge :label="`objectUrl: ${objectUrl ?? 'null'}`" />
          <q-badge color="grey" :label="`revoked: ${revoked}`" />
        </div>
        <q-img
          v-if="objectUrl !== null"
          :src="objectUrl"
          fit="contain"
          class="q-mt-sm"
          style="max-width: 300px; max-height: 200px"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import { useFilePicker, useObjectUrl } from 'quasar'

const source = shallowRef(null)
const revoked = ref(0)

const { openFilePicker } = useFilePicker({
  accept: 'image/*',
  onChange(files) {
    source.value = files[0]
  }
})

const { objectUrl, revokeObjectUrl } = useObjectUrl(source)

let counter = 0

function generate() {
  counter++
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect width="200" height="100" fill="hsl(${(counter * 70) % 360} 70% 50%)"/><text x="100" y="60" text-anchor="middle" font-size="40" fill="#fff">${counter}</text></svg>`
  source.value = new Blob([svg], { type: 'image/svg+xml' })
}

onMounted(() => {
  const original = URL.revokeObjectURL.bind(URL)
  URL.revokeObjectURL = u => {
    revoked.value++
    original(u)
  }
})
</script>
