<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <q-btn
        color="primary"
        push
        icon="image"
        label="Pick an image"
        no-caps
        @click="openFilePicker"
      />
      <q-btn
        v-if="url"
        push
        color="negative"
        label="Clear"
        no-caps
        @click="image = null"
      />
    </div>

    <q-img
      v-if="url"
      :src="url"
      fit="contain"
      class="q-mt-md rounded-borders"
      style="max-width: 300px; max-height: 200px"
    />
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'
import { useFilePicker, useObjectUrl } from 'quasar'

const image = shallowRef(null)

const { openFilePicker } = useFilePicker({
  accept: 'image/*',
  onChange(files) {
    image.value = files[0]
  }
})

const { url } = useObjectUrl(image)
</script>
