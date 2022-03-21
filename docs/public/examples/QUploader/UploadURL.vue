<template>
  <div class="q-pa-md">
    <q-uploader
      label="Auto Uploader"
      auto-upload
      :url="getUrl"
      multiple
    />
  </div>
</template>

<script>
export default {
  methods: {
    getUrl (files) {
      return `http://localhost:4444/upload?count=${files.length}`
    }
  }
}
</script>
