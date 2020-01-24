<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="filesImages"
        filled
        rounded
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        style="max-width: 300px"
      />

      <q-file
        v-model="filesMaxSize"
        outlined
        label="Max file size (2k)"
        multiple
        :max-file-size="2048"
        style="max-width: 300px"
      />

      <q-file
        v-model="filesMaxTotalSize"
        standout
        label="Max total upload size (4k)"
        multiple
        :max-total-size="4096"
        style="max-width: 300px"
      />

      <q-file
        v-model="filesMaxNumber"
        standout
        label="Max number of files (3)"
        multiple
        max-files="3"
        style="max-width: 300px"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filesImages: null,
      filesMaxSize: null,
      filesMaxTotalSize: null,
      filesMaxNumber: null
    }
  }
}
</script>
